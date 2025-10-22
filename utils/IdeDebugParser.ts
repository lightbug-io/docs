/**
 * Parse IDE debug data in CSV format from debuggers (STM32CubeIDE, etc)
 * Extracts char[N] arrays and converts byte values to hex format
 *
 * @param csvText - CSV formatted debug output with headers: Level,Expression,Value,Location,...
 * @returns Space-separated hex bytes (e.g., "0xf0 0x12 0x00") or null if not IDE debug format
 */
export const parseIdeDebugCsv = (csvText: string): string | null => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);

    if (lines.length < 1) return null;

    // Check if first line contains the expected CSV headers
    const headerLine = lines[0];
    if (!headerLine.includes('Level') || !headerLine.includes('Expression') || !headerLine.includes('Value')) {
        return null;
    }

    // Ignore lines containing '<outofscope>'
    const relevantLines = lines.filter(line => !line.includes('<outofscope>'));

    const extractedBytes: number[] = [];
    let i = 1; // Skip header line

    while (i < relevantLines.length) {
        const line = relevantLines[i];

        // Look for char[N] pattern in the Expression column
        const charArrayMatch = line.match(/char\[(\d+)\]/);
        if (charArrayMatch) {
            const arraySize = parseInt(charArrayMatch[1]);

            // Skip if this line says outofscope
            if (line.includes('<outofscope>')) {
                i++;
                continue;
            }

            // Look ahead for the next arraySize lines that contain array elements
            let elementCount = 0;
            let j = i + 1;

            while (elementCount < arraySize && j < relevantLines.length) {
                const elementLine = relevantLines[j];

                // Skip lines with outofscope
                if (elementLine.includes('<outofscope>')) {
                    j++;
                    continue;
                }

                // Look for pattern like: 1,"[N]","<value>",...
                // Extract the value from the Value column (third column in CSV)
                const csvParts = elementLine.split(',');
                if (csvParts.length >= 3 && csvParts[1].includes('[')) {
                    // Extract the Value (third column, index 2)
                    let valueStr = csvParts[2].trim().replace(/^["']|["']$/g, '');

                    // Parse the value - could be negative numbers or escaped chars
                    // Format: "18 ('\018')" or "-16 ('ð')" or similar
                    const numberMatch = valueStr.match(/^(-?\d+)/);
                    if (numberMatch) {
                        const byteValue = parseInt(numberMatch[1]);
                        // Convert to unsigned byte (0-255 range)
                        const unsignedByte = ((byteValue % 256) + 256) % 256;
                        extractedBytes.push(unsignedByte);
                        elementCount++;
                    }
                }
                j++;
            }

            // Skip past the elements we just processed
            i = j;
        } else {
            i++;
        }
    }

    // If we extracted bytes, return them as hex string
    if (extractedBytes.length > 0) {
        return extractedBytes.map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ');
    }

    return null;
};
