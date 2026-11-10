#!/usr/bin/env python3
# cspell:words Raleway instancer recalc
"""Regenerate PDF fonts from the checked-in Raleway source. Requires Python fontTools.
Run from any directory: python scripts/build-pdf-fonts.py
The generated asset is committed; normal builds do not require Python/fontTools.
"""
import base64
import io
from pathlib import Path
import re
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

fonts = Path(__file__).resolve().parents[1] / 'public' / 'fonts'
source = (fonts / 'Raleway-VariableFont_wght-normal.js').read_text()
font_bytes = base64.b64decode(re.search(r'var font = "([^"]+)"', source)[1])
output = [
    '// cspell:disable -- generated font data; see scripts/build-pdf-fonts.py',
    '// Static regular/bold instances derived from the bundled Raleway variable font.',
    '// Copyright 2010 The Raleway Project Authors; SIL OFL 1.1. See Lightbug-Spec-OFL.txt.',
    '// Regenerate with: python scripts/build-pdf-fonts.py (requires fontTools).',
    '(function (api) {',
    '  if (api.lightbugSpecFontsLoaded) return;',
]
for weight, style in [(400, 'normal'), (700, 'bold')]:
    font = TTFont(io.BytesIO(font_bytes), recalcTimestamp=False)
    instance = instantiateVariableFont(font, {'wght': weight})
    # Raleway is a reserved font name under OFL. Rename the static derivative,
    # retaining the original copyright and license records.
    family = 'Lightbug Specification'
    subfamily = 'Regular' if style == 'normal' else 'Bold'
    names = {1: family, 2: subfamily, 3: f'{family} {subfamily}',
             4: f'{family} {subfamily}', 6: f'LightbugSpecification-{subfamily}',
             16: family, 17: subfamily, 25: 'LightbugSpecification'}
    for record in instance['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    buffer = io.BytesIO()
    instance.save(buffer)
    data = base64.b64encode(buffer.getvalue()).decode()
    name = f'Lightbug-Spec-{style}.ttf'
    output += [
        '  api.events.push(["addFonts", function () {',
        f'    this.addFileToVFS("{name}", "{data}");',
        f'    this.addFont("{name}", "Lightbug-Spec", "{style}");',
        '  }]);',
    ]
output += ['  api.lightbugSpecFontsLoaded = true;', '})(window.jspdf.jsPDF.API);']
(fonts / 'Lightbug-Spec.js').write_text('\n'.join(output) + '\n')
