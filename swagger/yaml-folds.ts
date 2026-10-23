import { isMap, isScalar, isSeq, LineCounter, parseDocument } from 'yaml'

type Fold = { start: number; end: number }

/** Parser ranges, not indentation guesses: multiline examples remain indivisible. */
export function yamlFoldRanges(text: string): Fold[] {
    const lineCounter = new LineCounter()
    const document = parseDocument(text, { lineCounter })
    if (document.errors.length) throw document.errors[0]
    const folds: Fold[] = []
    function visit(node: any, parentKey = '') {
        if (isMap(node)) {
            for (const pair of node.items) {
                if (!isScalar(pair.key)) continue
                const key = String(pair.key.value)
                const value = pair.value
                if ((isMap(value) || isSeq(value)) && pair.key?.range && value.range) {
                    const start = lineCounter.linePos(pair.key.range[0]).line - 1
                    const end = lineCounter.linePos(value.range[1] - 1).line
                    if (end - start >= 5 && (key === 'requestBody' || parentKey === 'responses' || key === 'properties' || key === 'items')) {
                        folds.push({ start, end })
                    }
                }
                visit(value, key)
            }
        } else if (isSeq(node)) {
            for (const item of node.items) visit(item, parentKey)
        }
    }
    visit(document.contents)
    return folds.sort((a, b) => a.start - b.start || b.end - a.end)
}

export function foldingYamlMarkdown(text: string): string {
    const lines = text.trimEnd().split('\n')
    const folds = yamlFoldRanges(text)
    const escape = (line: string) => line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const code = (start: number, end: number) => {
        if (start === end) return ''
        const value = lines.slice(start, end).join('\n') + '\n'
        const fence = '`'.repeat(Math.max(3, ...Array.from(value.matchAll(/`+/g), match => match[0].length + 1)))
        return `<div class="api-yaml-chunk">\n\n${fence}yaml\n${value}${fence}\n\n</div>\n\n`
    }
    function render(start: number, end: number): string {
        let result = '', cursor = start
        for (const fold of folds) {
            if (fold.start < cursor || fold.start >= end || fold.end > end) continue
            result += code(cursor, fold.start)
            result += `<details class="api-yaml-fold" open>\n<summary><code class="api-yaml-source" v-pre>${escape(lines[fold.start])}</code></summary>\n\n`
            result += render(fold.start + 1, fold.end)
            result += '</details>\n\n'
            cursor = fold.end
        }
        return result + code(cursor, end)
    }
    // The copy source is an attribute, not a second indexed/visible YAML block.
    const source = escape(text).replace(/\"/g, '&quot;').replace(/\n/g, '&#10;')
    return `<div class="api-yaml-document" data-yaml="${source}" v-pre>\n\n${render(0, lines.length)}</div>\n`
}
