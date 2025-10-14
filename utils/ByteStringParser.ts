/**
 * Utility for parsing byte strings from various input formats.
 * Handles messy input with random text, hex values, and decimal integers.
 */

export interface ParsedBytes {
    bytes: number[];
    hasHex: boolean;
}

/**
 * Extract valid byte values (0-255) from any input string.
 * Handles:
 * - Decimal integers (0-255)
 * - Hex values (with or without 0x prefix)
 * - Mixed text and numbers
 * - Various separators (spaces, commas, etc.)
 *
 * @param input - Raw input string potentially containing bytes
 * @returns Object with parsed bytes array and hex detection flag
 */
export function parseByteString(input: string): ParsedBytes {
    if (!input || !input.trim()) {
        return { bytes: [], hasHex: false };
    }

    // Normalize the input
    let normalized = input.trim();

    // Check if input contains 0x prefix - strong indicator of hex mode
    if (/0x/i.test(normalized)) {
        return parseHexBytes(normalized);
    }

    // Check if input looks like continuous hex (e.g., "030E000D")
    // Remove all whitespace and check if what's left is all hex digits
    const noWhitespace = normalized.replace(/\s/g, '');
    const allHexPattern = /^[0-9a-fA-F]+$/;

    if (allHexPattern.test(noWhitespace) && /[a-fA-F]/.test(noWhitespace) && noWhitespace.length >= 4) {
        // Looks like a continuous hex string
        return parseHexBytes(normalized);
    }

    // Check for comma-separated hex pattern (e.g., "03, 11, 00, 0d")
    // This is a very strong indicator of hex mode
    const commaHexPattern = /\b[0-9a-fA-F]{2}\s*,\s*[0-9a-fA-F]{2}\b/;
    if (commaHexPattern.test(normalized) && /[a-fA-F]/.test(normalized)) {
        return parseHexBytes(normalized);
    }

    // Check for separated hex pairs like "03 0E 00 0D" or "FF AA BB"
    // Must have multiple hex pairs and predominantly hex characters
    const hexPairPattern = /\b[0-9a-fA-F]{2}\b/g;
    const hexPairs = normalized.match(hexPairPattern) || [];
    const hasHexLetters = /[a-fA-F]/.test(normalized);

    // If we have multiple hex pairs AND hex letters (a-f), AND they make up
    // a significant portion of the input, treat as hex
    if (hexPairs.length >= 3 && hasHexLetters) {
        const hexPairChars = hexPairs.join('').length;
        const totalChars = normalized.replace(/\s/g, '').length;

        // If hex pairs make up > 40% of non-whitespace characters, treat as hex
        if (hexPairChars / totalChars > 0.4) {
            return parseHexBytes(normalized);
        }
    }

    // Default to decimal mode
    return parseDecimalBytes(normalized);
}

/**
 * Parse hex values from input.
 * Handles continuous hex strings and 0x-prefixed values.
 */
function parseHexBytes(input: string): ParsedBytes {
    const bytes: number[] = [];

    // First, try to find 0x-prefixed hex values
    const hex0xPattern = /0x([0-9a-fA-F]{1,2})\b/g;
    let match;
    const foundRanges: Array<{start: number, end: number}> = [];

    while ((match = hex0xPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (value >= 0 && value <= 255) {
            bytes.push(value);
            foundRanges.push({ start: match.index, end: match.index + match[0].length });
        }
    }

    // If we found 0x-prefixed values, use those
    if (bytes.length > 0) {
        return { bytes, hasHex: true };
    }

    // Check for comma-separated hex (e.g., "03, 11, 00, 0d")
    // This is common in log output
    const commaHexPattern = /\b([0-9a-fA-F]{2})\s*,/g;
    while ((match = commaHexPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (!isNaN(value)) {
            bytes.push(value);
        }
    }

    // Also check for the last hex pair after the final comma (no trailing comma)
    const lastHexPattern = /,\s*([0-9a-fA-F]{2})\b(?!\s*,)/g;
    while ((match = lastHexPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (!isNaN(value)) {
            bytes.push(value);
        }
    }

    // If we found comma-separated values, use those
    if (bytes.length > 0) {
        return { bytes, hasHex: true };
    }

    // Otherwise, look for isolated hex pairs (word boundaries)
    // This will match things like "0a" or "FF" but not "hello"
    const hexPairPattern = /\b([0-9a-fA-F]{2})\b/g;
    while ((match = hexPairPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (!isNaN(value)) {
            bytes.push(value);
        }
    }

    // If we found hex pairs, use those
    if (bytes.length > 0) {
        return { bytes, hasHex: true };
    }

    // Last resort: treat entire string as continuous hex (remove non-hex chars)
    const hexOnly = input.replace(/[^0-9a-fA-F]/g, '');

    // Parse as pairs of hex digits
    for (let i = 0; i < hexOnly.length; i += 2) {
        const byteStr = hexOnly.substring(i, i + 2);
        if (byteStr.length === 2) {
            const value = parseInt(byteStr, 16);
            if (!isNaN(value)) {
                bytes.push(value);
            }
        }
    }

    return { bytes, hasHex: true };
}

/**
 * Parse decimal integer values from input.
 * Extracts all valid integers (0-255) regardless of surrounding text.
 */
function parseDecimalBytes(input: string): ParsedBytes {
    const bytes: number[] = [];

    // Match all sequences of digits, including those preceded by optional minus sign
    // We'll filter out negative numbers and values > 255
    const numberPattern = /-?\d+/g;
    let match;

    while ((match = numberPattern.exec(input)) !== null) {
        const value = parseInt(match[0], 10);
        // Only accept valid byte values (0-255)
        if (!isNaN(value) && value >= 0 && value <= 255) {
            bytes.push(value);
        }
    }

    return { bytes, hasHex: false };
}

/**
 * Format bytes for display in various formats.
 */
export type ByteDisplayFormat = 'ints' | 'hex' | 'hex0x' | 'printf';

export function formatBytes(
    bytes: number[],
    format: ByteDisplayFormat,
    separators?: { spaces?: boolean; commas?: boolean }
): string {
    const formatByte = (byte: number): string => {
        switch (format) {
            case 'hex':
                return byte.toString(16).padStart(2, '0').toUpperCase();
            case 'hex0x':
                return '0x' + byte.toString(16).padStart(2, '0').toUpperCase();
            case 'printf':
                return `'\\x${byte.toString(16).padStart(2, '0')}'`;
            default:
                return byte.toString();
        }
    };

    if (format === 'printf') {
        // Printf format: continuous string
        return bytes.map(formatByte).join('');
    }

    // Apply separators
    const { spaces = false, commas = false } = separators || {};

    if (spaces && commas) {
        return bytes.map(formatByte).join(', ');
    } else if (commas) {
        return bytes.map(formatByte).join(',');
    } else if (spaces) {
        return bytes.map(formatByte).join(' ');
    } else {
        return bytes.map(formatByte).join('');
    }
}
