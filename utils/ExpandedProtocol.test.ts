/** @jest-environment node */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const yaml = require('js-yaml')
const { parseDocument, isAlias, isScalar, visit } = require('yaml')
const { expandProtocolYaml, writeExpandedProtocol, expandedProtocolFilename } = require('./expanded-protocol.cjs')
const expandedProtocolPlugin = require('../.vitepress/plugins/expanded-protocol.cjs')

const fixture = `version: 3
templates:
  headers:
    reply: &replyHeaders
      3: { presence: optional }
      4: { presence: optional, value: 0 }
messages:
  37:
    description: Base description stays at the base.
    data:
      1:
        type: int16
        sentinels:
          -32768: { id: unavailable, name: Unavailable }
    interactions:
      get:
        response: &localResponse
          headers:
            <<: *replyHeaders
            4: { value: 6 }
          note: 'Text containing &anchor, *alias and <<: is not YAML syntax.'
      subscribe:
        response: *localResponse
    versions:
      2:
        data: {}
    metadata:
      templates: preserved
`

describe('expanded protocol YAML', () => {
  it('resolves native aliases and shallow merges without adding application inheritance', () => {
    const output = expandProtocolYaml(fixture)
    const parsed = yaml.load(output)
    const { templates, ...expected } = yaml.load(fixture)
    expect(parsed).toEqual(expected)
    expect(parsed.templates).toBeUndefined()
    expect(parsed.messages[37].metadata.templates).toBe('preserved')
    expect(parsed.messages[37].interactions.get.response.headers).toEqual({
      3: { presence: 'optional' },
      4: { value: 6 },
    })
    expect(parsed.messages[37].interactions.subscribe.response).toEqual(parsed.messages[37].interactions.get.response)
    expect(parsed.messages[37].versions[2]).toEqual({ data: {} })
    const document = parseDocument(output)
    expect(document.errors).toEqual([])
    visit(document, (_key: unknown, node: any) => {
      expect(isAlias(node)).toBe(false)
      expect(node?.anchor).toBeUndefined()
      if (isScalar(node)) expect(node.value).not.toBe('<<')
    })
  })

  it('keeps every authored value from the complete canonical spec except the registry', () => {
    const source = readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8')
    const { templates, ...expected } = yaml.load(source)
    const output = expandProtocolYaml(source)
    expect(yaml.load(output)).toEqual(expected)
    // JS objects alone cannot distinguish integer map keys from string keys.
    const expectedTyped = parseDocument(source, { merge: true, customTags: ['timestamp'] }).toJS({ mapAsMap: true })
    expectedTyped.delete('templates')
    expect(parseDocument(output, { customTags: ['timestamp'] }).toJS({ mapAsMap: true })).toEqual(expectedTyped)
    // The expansion is deterministic and already-expanded output is unchanged.
    expect(expandProtocolYaml(output)).toBe(output)
  })

  it('preserves integer keys required by SDK generators, including merged headers and sentinels', () => {
    const parsed = parseDocument(expandProtocolYaml(fixture)).toJS({ mapAsMap: true })
    const messages = parsed.get('messages')
    expect([...messages.keys()]).toEqual([37])
    const message = messages.get(37)
    expect([...message.get('data').keys()]).toEqual([1])
    expect([...message.get('data').get(1).get('sentinels').keys()]).toEqual([-32768])
    expect([...message.get('versions').keys()]).toEqual([2])
    for (const method of ['get', 'subscribe']) {
      const headers = message.get('interactions').get(method).get('response').get('headers')
      expect([...headers.keys()].sort()).toEqual([3, 4])
    }
  })

  it('does not turn deliberately quoted scalar keys or values into numbers, dates or booleans', () => {
    const source = `version: 3
integerKeys:
  1: one
  -32768: sentinel
stringKeys:
  "1": numeric-looking key
  "001": leading zero key
  "false": boolean-looking key
  "2025-10-10": date-looking key
quotedDate: "2025-10-10"
timestamp: 2025-10-10
quotedNumber: "1e2"
stringYes: yes
`
    const output = expandProtocolYaml(source)
    const parsed = parseDocument(output, { customTags: ['timestamp'] }).toJS({ mapAsMap: true })
    expect([...parsed.get('integerKeys').keys()]).toEqual([1, -32768])
    expect([...parsed.get('stringKeys').keys()]).toEqual(['1', '001', 'false', '2025-10-10'])
    expect(yaml.load(output)).toEqual(yaml.load(source))
    expect(parsed.get('quotedDate')).toBe('2025-10-10')
    expect(parsed.get('timestamp')).toEqual(new Date('2025-10-10T00:00:00.000Z'))
  })

  it('rejects invalid YAML and non-mapping documents instead of emitting a partial export', () => {
    expect(() => expandProtocolYaml('messages: *missing')).toThrow()
    expect(() => expandProtocolYaml('version: 3\nversion: 4')).toThrow()
    for (const source of ['', 'null', '[]', 'plain string']) {
      expect(() => expandProtocolYaml(source)).toThrow('must contain a mapping')
    }
  })

  it('exports clean YAML through the command from any working directory', () => {
    const source = readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8')
    const output = execFileSync(process.execPath, [resolve(__dirname, 'expanded-protocol.cjs')], {
      cwd: tmpdir(), encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    })
    expect(output).toBe(expandProtocolYaml(source))
  })
})

describe('expanded protocol download', () => {
  let directory: string
  let sourcePath: string
  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'expanded-protocol-'))
    sourcePath = join(directory, 'source.yaml')
    writeFileSync(sourcePath, fixture)
  })
  afterEach(() => rmSync(directory, { recursive: true, force: true }))

  function request(base: string, url: string, method = 'GET') {
    let handler: any
    expandedProtocolPlugin(sourcePath, base).configureServer({
      middlewares: { use(callback: any) { handler = callback } },
    })
    const response = { setHeader: jest.fn(), end: jest.fn() }
    const next = jest.fn()
    handler({ url, method }, response, next)
    return { response, next }
  }

  it('writes the same derived file into the build output without modifying the source', () => {
    writeExpandedProtocol(join(directory, 'output'), sourcePath)
    expect(readFileSync(join(directory, 'output/files', expandedProtocolFilename), 'utf8')).toBe(expandProtocolYaml(fixture))
    expect(readFileSync(sourcePath, 'utf8')).toBe(fixture)
  })

  it.each(['/', '/docs/pr/30/'])('serves fresh YAML with the %s base path in development', base => {
    const url = `${base}files/${expandedProtocolFilename}?download=1`
    const { response, next } = request(base, url)
    expect(next).not.toHaveBeenCalled()
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/yaml; charset=utf-8')
    expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(response.end).toHaveBeenCalledWith(expandProtocolYaml(fixture))
    writeFileSync(sourcePath, fixture.replace('version: 3', 'version: 4'))
    expect(yaml.load(request(base, url).response.end.mock.calls[0][0]).version).toBe(4)
  })

  it('supports HEAD without a body and leaves other paths and methods alone', () => {
    expect(request('/', `/files/${expandedProtocolFilename}`, 'HEAD').response.end).toHaveBeenCalledWith(undefined)
    for (const [base, url, method] of [
      ['/', `/files/${expandedProtocolFilename}`, 'POST'],
      ['/', '/files/protocol-v3.yaml', 'GET'],
      ['/docs/pr/30/', `/files/${expandedProtocolFilename}`, 'GET'],
    ]) {
      const { response, next } = request(base, url, method)
      expect(next).toHaveBeenCalledWith()
      expect(response.end).not.toHaveBeenCalled()
    }
  })

  it('passes invalid source errors through instead of returning a successful download', () => {
    writeFileSync(sourcePath, 'messages: *missing')
    const { response, next } = request('/', `/files/${expandedProtocolFilename}`)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(response.end).not.toHaveBeenCalled()
  })
})
