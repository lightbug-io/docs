import { parseHtmlForPdfLinks } from './PdfText'

describe('PDF text conversion', () => {
    test.each([
        ['Plain **Markdown** and [a label](/guide)', 'Plain **Markdown** and [a label](/guide)'],
        ['Accuracy < 10 mm and frequency > 1 Hz', 'Accuracy < 10 mm and frequency > 1 Hz'],
        ['<b>Nested <i>formatting</i></b> stays readable', 'Nested formatting stays readable'],
        ['<span title="one > two">Visible</span><!-- note --> text', 'Visible text'],
        ['<b>Nested <i>formatting</b> still readable</i>', 'Nested formatting still readable'],
        ['<<strong>Label</strong>', '<Label'],
        ['&lt;label&gt; &amp; &#60;value&#62; &#x3C;unit&#x3E;', '<label> & <value> <unit>'],
        ['&amp;lt;label&amp;gt;', '&lt;label&gt;'],
        ['5&nbsp;V &quot;input&quot; &apos;output&apos; &copy;', '5\u00a0V "input" \'output\' ©'],
        ['L1<br>L2<BR />L3', 'L1\nL2\nL3'],
        ['<script>unused()</script><style>.label { color: red }</style><template>Not displayed</template>Label', 'Label'],
        ['<b></b><!-- empty -->', ''],
    ])('converts %s to text without a second markup pass', (input, expected) => {
        expect(parseHtmlForPdfLinks(input)).toEqual([{ text: expected, isLink: false }])
    })

    test('preserves nested link labels and decodes text and destinations once', () => {
        const input = 'See &lt;spec&gt; <a href="/guide?a=1&amp;b=2"><strong>RTK</strong> &amp; <em>GNSS</em></a> now'
        expect(parseHtmlForPdfLinks(input)).toEqual([
            { text: 'See <spec> ', isLink: false },
            { text: 'RTK & GNSS', isLink: true, url: '/guide?a=1&b=2' },
            { text: ' now', isLink: false },
        ])
    })

    test('keeps encoded angle brackets in labels and destinations as literal text', () => {
        const input = '<a href="/guide?value=&lt;unit&gt;">&lt;label&gt;</a>'
        expect(parseHtmlForPdfLinks(input)).toEqual([
            { text: '<label>', isLink: true, url: '/guide?value=<unit>' },
        ])
    })

    test.each([
        '<A HREF=/guide>Read <strong>more</strong></A>',
        "<a href='/guide'>Read <strong>more</strong></a>",
        '<a title="one > two" href="/guide">Read <strong>more</strong></a>',
        '<a href=/guide>Read <strong>more',
    ])('handles ordinary HTML attribute and fragment syntax: %s', (input) => {
        expect(parseHtmlForPdfLinks(input)).toEqual([
            { text: 'Read more', isLink: true, url: '/guide' },
        ])
    })

    test('retains separate relative, absolute and fragment links, and anchors without href', () => {
        const input = '<a href="/guide">Guide</a>, <a href="https://example.com/docs">Docs</a> <a href="#details">Details</a> <a id="note">Note</a>'
        expect(parseHtmlForPdfLinks(input)).toEqual([
            { text: 'Guide', isLink: true, url: '/guide' },
            { text: ', ', isLink: false },
            { text: 'Docs', isLink: true, url: 'https://example.com/docs' },
            { text: ' ', isLink: false },
            { text: 'Details', isLink: true, url: '#details' },
            { text: ' Note', isLink: false },
        ])
    })

    test('keeps line breaks inside a formatted link label', () => {
        const input = '<a href="/guide"><b>First</b><br>Second</a>'
        expect(parseHtmlForPdfLinks(input)).toEqual([
            { text: 'First\nSecond', isLink: true, url: '/guide' },
        ])
    })

    test.each([[null, ''], [undefined, ''], ['', ''], [0, '0'], [false, 'false']])(
        'normalizes empty and primitive values: %s', (input, expected) => {
            expect(parseHtmlForPdfLinks(input)).toEqual([{ text: expected, isLink: false }])
        }
    )

    test('never attaches parsed elements to the document', () => {
        const before = document.documentElement.outerHTML
        expect(parseHtmlForPdfLinks('<img src="/unused.png"><iframe src="/unused"></iframe>Label')).toEqual([{ text: 'Label', isLink: false }])
        expect(document.documentElement.outerHTML).toBe(before)
    })
})
