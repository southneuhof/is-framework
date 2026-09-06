#!/usr/bin/env python3
"""Validate or explicitly generate/integrate source. Never writes to a database."""
import argparse
import json
from pathlib import Path
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', required=True, help='Path to module.json')
    parser.add_argument('--root', type=Path, help='Target checkout; defaults to the owning checkout')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--check', action='store_true', help='Read-only manifest validation (default)')
    mode.add_argument('--apply', action='store_true', help='Generate and integrate source only')
    parser.add_argument('--json', action='store_true', help='Emit one JSON result, no mixed logs')
    args = parser.parse_args()
    tools_root = Path(__file__).resolve().parents[4]
    root = (args.root or tools_root).resolve()
    manifest = Path(args.manifest).resolve()
    commands = []
    try:
        if not root.is_dir():
            raise ValueError('Target checkout directory does not exist.')
        json.loads(manifest.read_text(encoding='utf-8'))
        scaffold = str(tools_root / 'scripts/scaffold-bounded-module.mjs')
        integrate = str(tools_root / 'scripts/integrate-bounded-module.mjs')
        common = ['--root', str(root), '--json']
        pipeline = [['node', scaffold, '--config', str(manifest), '--check', *common]]
        if args.apply:
            pipeline += [
                ['node', integrate, '--manifest', str(manifest), '--check', *common],
                ['node', scaffold, '--config', str(manifest), *common],
                ['node', integrate, '--manifest', str(manifest), '--apply', *common],
            ]
        for command in pipeline:
            result = subprocess.run(command, cwd=root, capture_output=True, text=True, timeout=60)
            commands.append({'argv': command, 'exitCode': result.returncode, 'stdout': result.stdout, 'stderr': result.stderr})
            if result.returncode:
                raise RuntimeError('Source pipeline failed; inspect reported output and any generated files before retrying.')
        output = {'status': 'APPLIED' if args.apply else 'VALID', 'scope': 'source' if args.apply else 'manifest', 'databaseWrites': False, 'commands': commands}
        code = 0
    except (OSError, ValueError, RuntimeError, subprocess.TimeoutExpired) as error:
        output = {'status': 'FAIL', 'error': str(error), 'databaseWrites': False, 'commands': commands}
        code = 1
    if args.json:
        print(json.dumps(output, indent=2))
    else:
        print(f"{output['status']}: source tooling only; no migration, seed or application tests ran.")
        if 'error' in output:
            print(output['error'], file=sys.stderr)
            for command in commands:
                if command['exitCode']:
                    print(command['stderr'], file=sys.stderr)
    return code


if __name__ == '__main__':
    raise SystemExit(main())
