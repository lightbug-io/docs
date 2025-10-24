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
 * Also supports base64 encoded data.
 * Only valid characters are: 0-9, A-F, a-f, X, x for hex
 * A-Z, a-z, 0-9, +, /, = for base64
 * All other characters (including newlines, commas, spaces, parentheses, etc.) are treated as noise.
 *
 * Supports multiple byte formats:
 * - Continuous hex: "ffff" = [255, 255]
 * - 0x notation: "0xff0xff" = [255, 255]
 * - Space/comma separated: "255 255" or "255,255" = [255, 255]
 * - Mixed with noise: "ff foolala ff" = [255, 255]
 * - Multiline: "255\n255" = [255, 255]
 * - Base64: "A+E=" or "AzgAIgACBBc..." = decoded bytes
 *
 * @param input - Raw input string potentially containing bytes
 * @returns Object with parsed bytes array and hex detection flag
 */
export function parseByteString(input: string): ParsedBytes {
    if (!input || !input.trim()) {
        return { bytes: [], hasHex: false };
    }

    // Check if input looks like base64 first
    if (looksLikeBase64(input)) {
        const decoded = tryDecodeBase64(input);
        if (decoded.length > 0) {
            return { bytes: decoded, hasHex: false };
        }
    }

    return parseSingleByteString(input);
}

/**
 * Check if input looks like it might be base64 encoded.
 * Base64 uses A-Z, a-z, 0-9, +, /, and = for padding.
 * We need to be careful not to match hex strings or other patterns.
 * Key indicators of base64:
 * - Ends with = or == (padding)
 * - Contains + or / characters (uncommon in hex/decimal)
 * - Long continuous string of valid base64 chars with proper formatting
 */
function looksLikeBase64(input: string): boolean {
    const trimmed = input.trim();

    // Base64 should be at least 4 characters
    if (trimmed.length < 4) {
        return false;
    }

    // Strong indicators: has + or / or ends with =
    const hasBase64Markers = /[+/]/.test(trimmed) || /=+$/.test(trimmed);

    if (!hasBase64Markers) {
        return false;
    }

    // Now check if it's mostly valid base64 characters
    // Remove whitespace first
    const normalized = trimmed.replace(/\s/g, '');

    // Check that 95%+ of characters are valid base64
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Pattern.test(normalized)) {
        return false;
    }

    // Check for proper padding (must be multiple of 4)
    if (normalized.length % 4 !== 0) {
        return false;
    }

    return true;
}

/**
 * Attempt to decode base64 input into bytes.
 * Returns empty array if decoding fails.
 */
function tryDecodeBase64(input: string): number[] {
    try {
        // Remove all whitespace (newlines, spaces, etc.)
        const cleaned = input.trim().replace(/\s/g, '');

        // Check for valid base64 format one more time
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
            return [];
        }

        // Decode base64 string to bytes
        // For Node.js environment
        if (typeof Buffer !== 'undefined') {
            const buffer = Buffer.from(cleaned, 'base64');
            return Array.from(buffer);
        }

        // Fallback for browser environment
        if (typeof window !== 'undefined' && typeof atob !== 'undefined') {
            const binaryString = atob(cleaned);
            const bytes: number[] = [];
            for (let i = 0; i < binaryString.length; i++) {
                bytes.push(binaryString.charCodeAt(i));
            }
            return bytes;
        }

        return [];
    } catch (error) {
        // Decoding failed
        return [];
    }
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
    const onlyValid = normalized.replace(/[^0-9a-fA-F]/g, '');
    const allHexPattern = /^[0-9a-fA-F]+$/;
    const onlyValidHasHexLetters = /[a-fA-F]/.test(onlyValid);

    if (allHexPattern.test(onlyValid) && onlyValidHasHexLetters && onlyValid.length >= 4) {
        // Check if there's a continuous hex sequence in the ORIGINAL input that's long enough (4+ characters)
        // This handles cases where hex is embedded in messy logs or multiple messages separated by newlines
        const continuousHexPattern = /[0-9a-fA-F]{4,}/g;
        const continuousSequences = normalized.match(continuousHexPattern) || [];

        if (continuousSequences.length > 0) {
            // Filter for sequences that actually contain hex letters (a-f, not just 0-9)
            // This distinguishes real hex from pure decimal sequences
            const realHexSequences = continuousSequences.filter(seq => /[a-fA-F]/.test(seq));

            // If we have at least one sequence with hex letters, or multiple sequences (one might be hex), treat as hex
            if (realHexSequences.length > 0 || continuousSequences.length > 1) {
                return parseHexBytes(normalized);
            }
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

    // If we found continuous sequences, extract all of them
    // This handles cases where multiple messages are in the same input (e.g., on separate lines)
    if (sequences.length > 0) {
        // Filter for sequences that actually contain hex letters (a-f, not just 0-9)
        // This distinguishes real hex from pure decimal sequences and prevents
        // parsing of timestamps and device IDs mixed into the logs
        const realHexSequences = sequences.filter(seq => /[a-fA-F]/.test(seq));

        // Use real hex sequences if we have any, otherwise use all sequences
        // (in case the input is purely numeric hex like "00ff00ff")
        const sequencesToUse = realHexSequences.length > 0 ? realHexSequences : sequences;

        // Simply concatenate sequences in the order they appear
        // This preserves the order of multiple messages separated by newlines or other noise
        let hexOnly = sequencesToUse.join('');

        // If we have an odd number of hex characters, it's likely a copy-paste error
        // We'll just process what we have and let the parser handle the incomplete byte
        for (let i = 0; i < hexOnly.length - 1; i += 2) {
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
 * Detected non-message byte pattern
 */
export interface DetectedPattern {
    startIndex: number;
    endIndex: number;
    name: string;
    description: string;
    explanation?: string; // Detailed explanation of what was found
    bytes: number[];
    severity: 'warning' | 'error'; // 'warning' for informational, 'error' for likely wrong format
}

/**
 * Pattern definitions for detection
 */
export interface BytePattern {
    name: string;
    description: string;
    explanation?: string; // Detailed explanation of what was found
    pattern: (bytes: number[], startIndex: number) => boolean;
    length: number; // minimum length to match
    severity: 'warning' | 'error';
}

/**
 * Detect non-message byte patterns in the byte stream.
 * Looks for common patterns like AT+, HTTP methods, TLS handshakes, etc.
 * Only returns patterns that are NOT part of valid messages.
 *
 * @param bytes - The byte array to scan
 * @param messageByteRanges - Set of byte indices that are part of valid messages
 * @returns Array of detected patterns
 */
export function detectNonMessagePatterns(
    bytes: number[],
    messageByteRanges: Set<number> = new Set()
): DetectedPattern[] {
    const patterns = defineBytePatterns();
    const detected: DetectedPattern[] = [];

    // Scan through bytes looking for patterns
    for (let i = 0; i < bytes.length; i++) {
        // Skip if this byte is part of a valid message
        if (messageByteRanges.has(i)) {
            continue;
        }

        // Check each pattern
        for (const patternDef of patterns) {
            if (i + patternDef.length <= bytes.length) {
                if (patternDef.pattern(bytes, i)) {
                    // Found a match
                    // Check if the entire pattern range is outside valid messages
                    let inMessage = false;
                    for (let j = i; j < i + patternDef.length; j++) {
                        if (messageByteRanges.has(j)) {
                            inMessage = true;
                            break;
                        }
                    }

                    if (!inMessage) {
                        detected.push({
                            startIndex: i,
                            endIndex: i + patternDef.length - 1,
                            name: patternDef.name,
                            description: patternDef.description,
                            explanation: patternDef.explanation,
                            bytes: bytes.slice(i, i + patternDef.length),
                            severity: patternDef.severity
                        });

                        // Skip past this pattern to avoid overlapping matches
                        i += patternDef.length - 1;
                    }
                }
            }
        }
    }

    return detected;
}

/**
 * Define all byte patterns to detect
 */
function defineBytePatterns(): BytePattern[] {
    return [
        // AT+ Commands (0x41, 0x54, 0x2B = "AT+")
        {
            name: 'AT+ Command',
            description: 'Looks like an AT modem command (not a Lightbug protocol message)',
            explanation: 'AT+ is the standard prefix for Hayes modem commands. This is used in cellular modems, GPS devices, and other serial communication devices - not Lightbug protocol.',
            pattern: (bytes, i) => bytes[i] === 0x41 && bytes[i + 1] === 0x54 && bytes[i + 2] === 0x2B,
            length: 3,
            severity: 'error'
        },

        // HTTP GET (0x47, 0x45, 0x54 = "GET")
        {
            name: 'HTTP GET',
            description: 'Looks like an HTTP GET request (not a Lightbug protocol message)',
            explanation: 'HTTP GET is the start of an HTTP request to retrieve web resources. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) => bytes[i] === 0x47 && bytes[i + 1] === 0x45 && bytes[i + 2] === 0x54,
            length: 3,
            severity: 'error'
        },

        // HTTP POST (0x50, 0x4F, 0x53, 0x54 = "POST")
        {
            name: 'HTTP POST',
            description: 'Looks like an HTTP POST request (not a Lightbug protocol message)',
            explanation: 'HTTP POST is the start of an HTTP request to submit data to a server. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x50 && bytes[i + 1] === 0x4F && bytes[i + 2] === 0x53 && bytes[i + 3] === 0x54,
            length: 4,
            severity: 'error'
        },

        // HTTP PUT (0x50, 0x55, 0x54 = "PUT")
        {
            name: 'HTTP PUT',
            description: 'Looks like an HTTP PUT request (not a Lightbug protocol message)',
            explanation: 'HTTP PUT is the start of an HTTP request to create or update resources on a server. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) => bytes[i] === 0x50 && bytes[i + 1] === 0x55 && bytes[i + 2] === 0x54,
            length: 3,
            severity: 'error'
        },

        // HTTP HEAD (0x48, 0x45, 0x41, 0x44 = "HEAD")
        {
            name: 'HTTP HEAD',
            description: 'Looks like an HTTP HEAD request (not a Lightbug protocol message)',
            explanation: 'HTTP HEAD is similar to GET but only retrieves headers without the response body. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x48 && bytes[i + 1] === 0x45 && bytes[i + 2] === 0x41 && bytes[i + 3] === 0x44,
            length: 4,
            severity: 'error'
        },

        // HTTP OPTIONS (0x4F, 0x50, 0x54, 0x49, 0x4F, 0x4E, 0x53 = "OPTIONS")
        {
            name: 'HTTP OPTIONS',
            description: 'Looks like an HTTP OPTIONS request (not a Lightbug protocol message)',
            explanation: 'HTTP OPTIONS is used to describe communication options for a resource. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x4F && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x54 && bytes[i + 3] === 0x49 &&
                bytes[i + 4] === 0x4F && bytes[i + 5] === 0x4E && bytes[i + 6] === 0x53,
            length: 7,
            severity: 'error'
        },

        // HTTP PATCH (0x50, 0x41, 0x54, 0x43, 0x48 = "PATCH")
        {
            name: 'HTTP PATCH',
            description: 'Looks like an HTTP PATCH request (not a Lightbug protocol message)',
            explanation: 'HTTP PATCH is used to apply partial modifications to a resource on a server. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x50 && bytes[i + 1] === 0x41 && bytes[i + 2] === 0x54 && bytes[i + 3] === 0x43 &&
                bytes[i + 4] === 0x48,
            length: 5,
            severity: 'error'
        },

        // HTTP DELETE (0x44, 0x45, 0x4C, 0x45, 0x54, 0x45 = "DELETE")
        {
            name: 'HTTP DELETE',
            description: 'Looks like an HTTP DELETE request (not a Lightbug protocol message)',
            explanation: 'HTTP DELETE is used to delete a resource on a server. Your bytes appear to contain web traffic, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x44 && bytes[i + 1] === 0x45 && bytes[i + 2] === 0x4C && bytes[i + 3] === 0x45 &&
                bytes[i + 4] === 0x54 && bytes[i + 5] === 0x45,
            length: 6,
            severity: 'error'
        },

        // HTTP Response (0x48, 0x54, 0x54, 0x50 = "HTTP")
        {
            name: 'HTTP Response',
            description: 'Looks like an HTTP response (not a Lightbug protocol message)',
            explanation: 'HTTP responses start with "HTTP/" followed by a version number. Your bytes appear to contain web traffic or HTTP responses, not Lightbug protocol messages.',
            pattern: (bytes, i) =>
                bytes[i] === 0x48 && bytes[i + 1] === 0x54 && bytes[i + 2] === 0x54 && bytes[i + 3] === 0x50,
            length: 4,
            severity: 'error'
        },

        // TLS/SSL Client Hello (0x16, 0x03, 0x01 = TLS 1.0/1.1/1.2)
        {
            name: 'TLS/SSL Client Hello',
            description: 'Looks like a TLS/SSL Client Hello handshake (encrypted connection, not a protocol message)',
            explanation: 'TLS/SSL connections start with a handshake record (0x16 = Handshake, 0x03 0x01 = TLS 1.0/1.1/1.2). This indicates encrypted traffic, not raw Lightbug protocol messages.',
            pattern: (bytes, i) => bytes[i] === 0x16 && bytes[i + 1] === 0x03 && (bytes[i + 2] === 0x01 || bytes[i + 2] === 0x03),
            length: 3,
            severity: 'warning'
        },

        // IPv4 packet with TCP (0x45, 0x00 at offset 0, 0x06 at offset 9)
        {
            name: 'IPv4 + TCP Packet',
            description: 'Looks like a TCP/IP network packet (not a Lightbug protocol message)',
            explanation: 'Found IPv4 header (0x45 = version 4, 5 word header) with TCP protocol (0x06 at offset 9). This is a network layer packet, not a Lightbug protocol message.',
            pattern: (bytes, i) =>
                bytes[i] === 0x45 && bytes[i + 1] === 0x00 && i + 9 < bytes.length && bytes[i + 9] === 0x06,
            length: 10,
            severity: 'warning'
        },

        // IPv4 packet with UDP (0x45, 0x00 at offset 0, 0x11 at offset 9)
        {
            name: 'IPv4 + UDP Packet',
            description: 'Looks like a UDP/IP network packet (not a Lightbug protocol message)',
            explanation: 'Found IPv4 header (0x45 = version 4, 5 word header) with UDP protocol (0x11 at offset 9). This is a network layer packet, not a Lightbug protocol message.',
            pattern: (bytes, i) =>
                bytes[i] === 0x45 && bytes[i + 1] === 0x00 && i + 9 < bytes.length && bytes[i + 9] === 0x11,
            length: 10,
            severity: 'warning'
        },

        // Ethernet + IPv4 (0x08, 0x00, 0x45 = EtherType IPv4 + IP version)
        {
            name: 'Ethernet + IPv4 Packet',
            description: 'Looks like an Ethernet frame with IPv4 (not a Lightbug protocol message)',
            explanation: 'Found EtherType 0x0800 (IPv4) and IP version/header length 0x45 (IPv4 with 20-byte header). This is the start of an Ethernet frame carrying an IPv4 packet.',
            pattern: (bytes, i) => bytes[i] === 0x08 && bytes[i + 1] === 0x00 && bytes[i + 2] === 0x45,
            length: 3,
            severity: 'warning'
        }
    ];
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
