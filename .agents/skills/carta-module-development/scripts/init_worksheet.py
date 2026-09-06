#!/usr/bin/env python3
"""Create a worksheet from its canonical template; preserve existing work."""
import argparse
from pathlib import Path
import re


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('feature', help='Lowercase, hyphen-separated feature slug')
    parser.add_argument('--modules', default='', help='Related module names')
    parser.add_argument('--reason', default='single module', help='Why these modules form one feature')
    parser.add_argument('--path', type=Path, help='Explicit output path')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.feature):
        parser.error('feature must be a lowercase, hyphen-separated slug')
    output = args.path or Path('plans') / args.feature / 'worksheet.md'
    if output.exists():
        print(f'exists: {output} (not overwritten)')
        return 0
    template = Path(__file__).resolve().parents[1] / 'assets/worksheet-template.md'
    text = template.read_text(encoding='utf-8')
    for key, value in {'FEATURE': args.feature, 'MODULES': args.modules or args.feature, 'REASON': args.reason}.items():
        text = text.replace('{{' + key + '}}', ' '.join(value.splitlines()))
    output.parent.mkdir(parents=True, exist_ok=True)
    try:
        with output.open('x', encoding='utf-8') as file:
            file.write(text)
    except FileExistsError:
        print(f'exists: {output} (not overwritten)')
        return 0
    print(f'created: {output}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
