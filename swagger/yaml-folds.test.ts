/** @jest-environment-options {"customExportConditions":["node","node-addons"]} */
import MarkdownIt from 'markdown-it'
import { foldingYamlMarkdown, yamlFoldRanges } from './yaml-folds'

const text = `paths:
  /test:
    post:
      requestBody:
        content:
          application/json:
            schema:
              properties:
                message:
                  type: string
                  description: |-
                    responses:
                      '400': do not interpret this example as structure
                    </code><script>alert(1)</script>{{value}}
      responses:
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                type: string
`

test('folds structural requests, responses and properties, not keys inside multiline descriptions', () => {
    const lines = text.split('\n')
    const ranges = yamlFoldRanges(text)
    expect(ranges.map(fold => lines[fold.start].trim())).toEqual(['requestBody:', 'properties:', "'400':"])
    expect(ranges.every(fold => fold.end > fold.start + 1)).toBe(true)
})

test('renders every YAML line once, keeps exact canonical copy text and escapes untrusted examples', () => {
    document.body.innerHTML = new MarkdownIt({ html: true }).render(foldingYamlMarkdown(text))
    expect(document.querySelector<HTMLElement>('.api-yaml-document')!.dataset.yaml).toBe(text)
    expect(document.querySelector('script')).toBeNull()
    const displayed = Array.from(document.querySelectorAll('.api-yaml-source, .api-yaml-chunk pre code'))
        .map(node => node.textContent!.replace(/\n$/, '') + '\n').join('')
    expect(displayed).toBe(text)
    expect(document.querySelectorAll('details').length).toBe(3)
    expect(document.querySelector('details details')).not.toBeNull()
})
