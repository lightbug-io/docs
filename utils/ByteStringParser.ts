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
 * Handles messy input with random text, hex values, and decimal integers.
 * Only valid characters are: 0-9, A-F, a-f, X, x
 * All other characters (including newlines, commas, spaces, parentheses, etc.) are treated as noise.
 *
 * Supports multiple byte formats:
 * - Continuous hex: "ffff" = [255, 255]
 * - 0x notation: "0xff0xff" = [255, 255]
 * - Space/comma separated: "255 255" or "255,255" = [255, 255]
 * - Mixed with noise: "ff foolala ff" = [255, 255]
 * - Multiline: "255\n255" = [255, 255]
 *
 * @param input - Raw input string potentially containing bytes
 * @returns Object with parsed bytes array and hex detection flag
 */
export function parseByteString(input: string): ParsedBytes {
    if (!input || !input.trim()) {
        return { bytes: [], hasHex: false };
    }

    return parseSingleByteString(input);
}

/**
 * Parse a single message string into ParsedBytes.
 */
function parseSingleByteString(input: string): ParsedBytes {
    // Normalize the input
    let normalized = input.trim();

    // Check if input contains 0x prefix - strong indicator of hex mode
    if (/0x/i.test(normalized)) {
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

    // If we have hex pairs AND hex letters (a-f), check if they're actual hex pairs
    // Count how many of the hex pairs contain a-f (strong hex indicators)
    if (hexPairs.length >= 2 && hasHexLetters) {
        const hexPairsWithLetters = hexPairs.filter(pair => /[a-fA-F]/.test(pair)).length;
        // If at least one hex pair contains letters, and most pairs are hex-like, use hex mode
        if (hexPairsWithLetters >= 1 && hexPairsWithLetters / hexPairs.length > 0.3) {
            return parseHexBytes(normalized);
        }
    }

    // Check if input looks like continuous hex (e.g., "030E000D" or "ffff")
    // Remove all non-valid characters and check if what's left is all hex digits
    // AND is a reasonable length for continuous hex (even number of chars, not too long)
    const onlyValid = normalized.replace(/[^0-9a-fA-F]/g, '');
    const allHexPattern = /^[0-9a-fA-F]+$/;

    if (allHexPattern.test(onlyValid) && /[a-fA-F]/.test(onlyValid) && onlyValid.length >= 4 && onlyValid.length % 2 === 0) {
        // Check if there's a continuous hex sequence in the ORIGINAL input that's long enough (10+ bytes = 20+ chars)
        // This handles cases where hex is embedded in messy logs
        const continuousHexPattern = /[0-9a-fA-F]{20,}/g;
        const continuousSequences = normalized.match(continuousHexPattern) || [];

        if (continuousSequences.length > 0) {
            // Found a long continuous hex sequence, likely hex mode
            return parseHexBytes(normalized);
        }

        // Fallback: calculate how much of the original input is hex chars
        const hexDensity = onlyValid.length / normalized.replace(/\s/g, '').length;
        // If > 70% of non-whitespace chars are valid hex, likely continuous hex
        if (hexDensity > 0.7) {
            return parseHexBytes(normalized);
        }
    }

    // Default to decimal mode
    return parseDecimalBytes(normalized);
}

/**
 * Parse hex values from input.
 * Handles continuous hex strings, 0x-prefixed values, and hex with noise.
 * Only extracts valid hex characters (0-9, A-F, a-f, X, x).
 */
function parseHexBytes(input: string): ParsedBytes {
    const bytes: number[] = [];

    // First, check for long continuous hex sequences (4+ characters)
    // These indicate actual hex messages embedded in logs
    // Do this EARLY before other patterns to prioritize them
    const continuousHexPattern = /[0-9a-fA-F]{4,}/g;
    const sequences = input.match(continuousHexPattern) || [];

    // If we found significant continuous sequences, extract all 4+ character sequences
    // This handles cases where multiple messages are in the same input
    if (sequences.length > 0) {
        // Concatenate ALL sequences (even short ones like "2025") to handle multi-message logs
        // But we'll sort them so we preserve order: keep them in original order from input
        const hexOnly = sequences.join('');

        // However, if we have a very long sequence (>= 20 chars), prefer just that
        const significantSequences = sequences.filter(s => s.length >= 20);
        if (significantSequences.length > 0) {
            // Use only the significant sequences
            const significantHex = significantSequences.join('');

            // Parse as pairs of hex digits
            for (let i = 0; i < significantHex.length; i += 2) {
                const byteStr = significantHex.substring(i, i + 2);
                if (byteStr.length === 2) {
                    const value = parseInt(byteStr, 16);
                    if (!isNaN(value)) {
                        bytes.push(value);
                    }
                }
            }

            if (bytes.length > 0) {
                return { bytes, hasHex: true };
            }
        } else {
            // Use all sequences if none are particularly long
            for (let i = 0; i < hexOnly.length; i += 2) {
                const byteStr = hexOnly.substring(i, i + 2);
                if (byteStr.length === 2) {
                    const value = parseInt(byteStr, 16);
                    if (!isNaN(value)) {
                        bytes.push(value);
                    }
                }
            }

            if (bytes.length > 0) {
                return { bytes, hasHex: true };
            }
        }
    }

    // Try to find 0x-prefixed hex values
    // Match 0x followed by exactly 1 or 2 hex digits
    // We'll match greedily and process all of them
    const hex0xPattern = /0x([0-9a-fA-F]{1,2})/gi;
    let match;
    let last0xIndex = -1;

    while ((match = hex0xPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (value >= 0 && value <= 255) {
            bytes.push(value);
            last0xIndex = match.index + match[0].length;
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

    // Look for hex pairs (2 consecutive hex digits) anywhere in the input
    // This will match "ff", "aa", "bb", "cc" but not the "e" from "noise" or "ore"
    const hexPairPattern = /\b([0-9a-fA-F]{2})\b/g;
    while ((match = hexPairPattern.exec(input)) !== null) {
        const value = parseInt(match[1], 16);
        if (!isNaN(value)) {
            bytes.push(value);
        }
    }

    // If we found word-boundary hex pairs, use those
    if (bytes.length > 0) {
        return { bytes, hasHex: true };
    }

    // Final fallback: extract all valid hex characters as continuous hex
    // This handles cases like "ffff" without spaces
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
