import { strict as assert } from 'node:assert'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test, afterEach } from 'node:test'
import { assertTestTarget } from '../apps/api/scripts/test-target.mjs'

const roots = []
const valid = { DATABASE_URL: 'postgresql://test:local@localhost:5432/carta_api_test', CARTA_DATABASE_PURPOSE: 'test', CARTA_TEST_DATABASE_NAME: 'carta_api_test' }
function setup(values = valid, development = 'postgresql://dev:local@localhost:5432/carta') {
  const cwd = mkdtempSync(join(tmpdir(), 'carta-test-target-')); roots.push(cwd)
  if (values) writeFileSync(join(cwd, '.env.test'), Object.entries(values).map(([k,v]) => `${k}=${v}`).join('\n'))
  if (development) writeFileSync(join(cwd, '.env'), `DATABASE_URL=${development}\n`)
  return cwd
}
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }) })

test('API tests require an explicit file, purpose and pinned database name', () => {
  assert.throws(() => assertTestTarget({ cwd: setup(null), env: valid }), /\.env.test/)
  for (const key of ['DATABASE_URL', 'CARTA_DATABASE_PURPOSE', 'CARTA_TEST_DATABASE_NAME']) {
    const value = { ...valid }; delete value[key]
    assert.throws(() => assertTestTarget({ cwd: setup(value), env: valid }), new RegExp(key))
  }
})
test('API tests reject wrong purpose, name, default databases and inherited overrides', () => {
  for (const overrides of [
    { CARTA_DATABASE_PURPOSE: 'development' },
    { CARTA_TEST_DATABASE_NAME: 'other' },
    { DATABASE_URL: 'postgresql://test:local@localhost/postgres', CARTA_TEST_DATABASE_NAME: 'postgres' },
    { DATABASE_URL: 'https://localhost/carta_api_test' },
  ]) {
    const env = { ...valid, ...overrides }
    assert.throws(() => assertTestTarget({ cwd: setup(env), env }), /test|database|PostgreSQL/)
  }
  const cwd = setup()
  for (const overrides of [{ DATABASE_URL: 'postgresql://dev:local@remote/carta' }, { CARTA_DATABASE_PURPOSE: 'development' }, { CARTA_TEST_DATABASE_NAME: 'other' }]) {
    assert.throws(() => assertTestTarget({ cwd, env: { ...valid, ...overrides } }), /effective|override/)
  }
})
test('the test target cannot equal the development target with different credentials or loopback spelling', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const cwd = setup(valid, `postgres://other:credentials@${host}/carta_api_test`)
    assert.throws(() => assertTestTarget({ cwd, env: valid }), /development/)
  }
})
test('valid isolated configuration returns only non-secret identity information', () => {
  const result = assertTestTarget({ cwd: setup(), env: valid })
  assert.deepEqual(result, { purpose: 'test', hostname: 'localhost', port: '5432', database: 'carta_api_test' })
  assert.ok(!JSON.stringify(result).includes('postgresql://'))
})

test('connection-string query parameters cannot redirect the declared test target', () => {
  for (const key of ['host', 'hostaddr', 'port', 'database', 'dbname', 'service']) {
    const env = { ...valid, DATABASE_URL: `${valid.DATABASE_URL}?${key}=other` }
    assert.throws(() => assertTestTarget({ cwd: setup(env), env }), /override|target/)
  }
})
