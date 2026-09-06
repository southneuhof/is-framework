#!/usr/bin/env node
// Content-scoped evidence. This records selected inputs, not a dependency analysis.
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs'
import { dirname, basename, isAbsolute, relative, resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const excludedDirectories = new Set(['.git', 'node_modules', '.turbo', 'playwright-report', 'test-results'])
const hash = (value) => createHash('sha256').update(value).digest('hex')
function canonicalAbsolute(path) {
  const absolute = resolve(path)
  try { return realpathSync(absolute) } catch (error) { if (error?.code !== 'ENOENT') throw error }
  const tail = [basename(absolute)]
  let dir = dirname(absolute)
  for (;;) {
    try { return resolve(realpathSync(dir), ...tail) } catch (error) { if (error?.code !== 'ENOENT') throw error }
    if (dir === dirname(dir)) return absolute
    tail.unshift(basename(dir))
    dir = dirname(dir)
  }
}
function within(root, path) {
  const name = relative(root, path)
  if (name === '..' || name.startsWith(`..${sep}`) || isAbsolute(name)) throw new Error(`Input must be within the repository: ${path}`)
  return name.split(sep).join('/') || '.'
}

export function captureInputs({ root = process.cwd(), inputs } = {}) {
  root = realpathSync(root)
  if (!Array.isArray(inputs) || !inputs.length || inputs.some(path => typeof path !== 'string' || !path.trim())) throw new Error('At least one nonempty input path is required.')
  const selected = [...new Set(inputs.map(path => within(root, canonicalAbsolute(resolve(root, path)))) )].sort()
  const entries = {}
  function visit(path) {
    const name = within(root, path)
    // Check every component: a symlinked parent must not escape the selected root.
    let parent = path
    while (parent !== root) {
      if (existsSync(parent) && lstatSync(parent).isSymbolicLink()) throw new Error(`Input symlink needs an explicit real owner: ${name}`)
      parent = dirname(parent)
    }
    let stat
    try { stat = lstatSync(path) } catch (error) {
      if (error.code !== 'ENOENT') throw error
      entries[name] = { kind: 'missing' }; return
    }
    if (stat.isSymbolicLink()) throw new Error(`Input symlink needs an explicit real owner: ${name}`)
    if (stat.isDirectory()) {
      entries[name] = { kind: 'directory' }
      for (const child of readdirSync(path).sort()) {
        if (!excludedDirectories.has(child)) visit(resolve(path, child))
      }
    } else if (stat.isFile()) {
      entries[name] = { kind: 'file', sha256: hash(readFileSync(path)), executable: Boolean(stat.mode & 0o111) }
    } else throw new Error(`Unsupported input type: ${name}`)
  }
  for (const path of selected) visit(resolve(root, path))
  const sorted = Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)))
  return { schemaVersion: 1, scope: 'snapshot', root, inputs: selected, fingerprint: hash(JSON.stringify(sorted)), entries: sorted }
}

export function checkFreshness(report, { root } = {}) {
  const snapshot = report.before ?? report.snapshot ?? report
  if (snapshot?.schemaVersion !== 1 || !snapshot.fingerprint || !Array.isArray(snapshot.inputs) || !snapshot.inputs.length) throw new Error('Invalid evidence snapshot.')
  const current = captureInputs({ root: root ?? snapshot.root, inputs: snapshot.inputs })
  const unchangedDuringRun = !report.after || snapshot.fingerprint === report.after.fingerprint
  return {
    fresh: unchangedDuringRun && snapshot.fingerprint === current.fingerprint,
    expected: snapshot.fingerprint,
    current: current.fingerprint,
    unchangedDuringRun,
  }
}

export function runCommand(command, args, { cwd = process.cwd(), timeoutMs = 180_000 } = {}) {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error('timeoutMs must be a positive integer.')
  if (typeof command !== 'string' || !command || !Array.isArray(args) || args.some(arg => typeof arg !== 'string')) throw new Error('A command and string argument vector are required.')
  const startedAt = new Date().toISOString(), started = Date.now()
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: timeoutMs, killSignal: 'SIGTERM', maxBuffer: 32 * 1024 * 1024 })
  const stdout = result.stdout ?? '', stderr = result.stderr ?? ''
  return {
    command: [command, ...args].map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg).join(' '),
    argv: [command, ...args], cwd: resolve(cwd), startedAt, durationMs: Date.now() - started,
    status: result.status === 0 && !result.error ? 'PASS' : 'FAIL', exitCode: result.status ?? 1,
    timeoutMs, timedOut: result.error?.code === 'ETIMEDOUT', signal: result.signal ?? null,
    error: result.error?.message ?? null, stdout, stderr, output: `${stdout}${stderr}`,
  }
}

function prepareOutput(output) {
  if (!output) throw new Error('An output path is required.')
  output = canonicalAbsolute(resolve(output))
  for (const path of [output, `${output}.stdout.log`, `${output}.stderr.log`]) {
    if (existsSync(path)) throw new Error(`Refusing to overwrite evidence: ${path}`)
  }
  mkdirSync(dirname(output), { recursive: true })
  return output
}

export function recordCommand(command, args, { root = process.cwd(), cwd, inputs, output, environment, timeoutMs } = {}) {
  root = realpathSync(root)
  if (typeof environment !== 'string' || !environment.trim()) throw new Error('An environment identity (without credentials) is required.')
  const before = captureInputs({ root, inputs })
  const destination = canonicalAbsolute(resolve(output ?? ''))
  for (const candidate of [destination, `${destination}.stdout.log`, `${destination}.stderr.log`]) {
    for (const input of before.inputs) {
      const source = resolve(root, input)
      if (candidate === source || candidate.startsWith(`${source}${sep}`)) throw new Error('Evidence output must not overlap an input path.')
    }
  }
  output = prepareOutput(output)
  const result = runCommand(command, args, { cwd: cwd ? resolve(root, cwd) : root, timeoutMs })
  let after, snapshotError = null
  try { after = captureInputs({ root, inputs }) } catch (error) { snapshotError = error.message }
  const unchanged = after?.fingerprint === before.fingerprint
  const report = {
    schemaVersion: 1, scope: 'command', status: result.status === 'FAIL' ? 'FAIL' : unchanged ? 'PASS' : 'INVALIDATED',
    environment, before, after: after ?? { fingerprint: null }, snapshotError,
    result, artifacts: { stdout: `${output}.stdout.log`, stderr: `${output}.stderr.log` },
  }
  writeFileSync(report.artifacts.stdout, result.stdout, { flag: 'wx' })
  writeFileSync(report.artifacts.stderr, result.stderr, { flag: 'wx' })
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
  return report
}

const help = `Usage:
  node scripts/module-evidence.mjs snapshot --input <path> [--input <path>] --output <snapshot.json> [--root <repo>]
  node scripts/module-evidence.mjs record --input <path> --output <report.json> --environment <identity> [--cwd <directory>] [--root <repo>] [--timeout-ms <n>] -- <command> [args...]
  node scripts/module-evidence.mjs check --report <snapshot-or-command.json> [--root <repo>]

Inputs can be files, directories or planned missing paths inside the repository.
Include the approved design, affected owners/dependencies, tests and config; exclude
status/report output. No shell is used. The command is executed once. A fresh failed
report remains a failure. A snapshot is drift evidence, not a test pass. Environment
identity and source fingerprints do not prove that an external service is unchanged.
Do not pass secrets in arguments or emit them in test output; reports preserve logs.`

export function execute(argv) {
  if (argv.includes('--help') || argv.length === 0) return { text: help, code: 0 }
  const [mode, ...rest] = argv
  const options = { inputs: [] }, command = []
  const keys = { '--root': 'root', '--input': 'input', '--output': 'output', '--environment': 'environment', '--cwd': 'cwd', '--timeout-ms': 'timeoutMs', '--report': 'report' }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--') { command.push(...rest.slice(i + 1)); break }
    const key = keys[rest[i]], value = rest[++i]
    if (!key || !value || value.startsWith('--')) throw new Error('Unknown option or missing option value. Use --help.')
    if (key === 'input') options.inputs.push(value)
    else options[key] = key === 'timeoutMs' ? Number(value) : value
  }
  if (mode === 'snapshot') {
    const snapshot = captureInputs(options)
    const output = canonicalAbsolute(resolve(options.output ?? ''))
    for (const input of snapshot.inputs) {
      const source = resolve(snapshot.root, input)
      if (output === source || output.startsWith(`${source}${sep}`)) throw new Error('Snapshot output must not overlap an input path.')
    }
    writeFileSync(prepareOutput(options.output), `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' })
    return { text: JSON.stringify(snapshot, null, 2), code: 0 }
  }
  if (mode === 'record') {
    if (!command.length) throw new Error('record requires -- <command> [args].')
    const report = recordCommand(command[0], command.slice(1), options)
    return { text: JSON.stringify(report, null, 2), code: report.status === 'PASS' ? 0 : 1 }
  }
  if (mode === 'check') {
    if (!options.report) throw new Error('check requires --report.')
    const report = JSON.parse(readFileSync(options.report, 'utf8'))
    const freshness = checkFreshness(report, options)
    const passed = report.scope === 'snapshot' || report.status === 'PASS'
    return { text: JSON.stringify({ scope: report.scope, recordedStatus: report.status ?? 'SNAPSHOT', ...freshness }, null, 2), code: freshness.fresh && passed ? 0 : 1 }
  }
  throw new Error('Unknown mode. Use --help.')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const result = execute(process.argv.slice(2)); console.log(result.text); process.exitCode = result.code }
  catch (error) { console.error(`module-evidence: ${error.message}`); process.exitCode = 1 }
}
