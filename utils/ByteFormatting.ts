/**
 * Utilities for formatting bytes and array values for display in the Message component
 */

/**
 * Format array values for display
 * @param bytes - Array of byte values
 * @param arrayType - The element type (e.g., 'uint8', 'int16')
 * @returns Formatted string like "Length: 3, Value: 1,2,3"
 */
export function formatArrayValue(bytes: number[], arrayType: string = 'uint8'): string {
    if (bytes.length === 0) {
        return 'Length: 0, Value: (empty)';
    }

    const valueString = bytes.join(',');
    return `Length: ${bytes.length}, Value: ${valueString}`;
}

/**
 * Check if a type string is an array type (e.g., uint8[], int16[])
 * @param type - The type string
 * @returns true if it's an array type
 */
export function isArrayType(type: string): boolean {
    return type.includes('[]');
}

/**
 * Get the base element type from an array type
 * @param type - The array type string (e.g., 'uint8[]')
 * @returns The element type (e.g., 'uint8')
 */
export function getArrayElementType(type: string): string {
    if (!isArrayType(type)) return type;
    return type.replace(/\[\]$/, '').trim();
}

/**
 * Get the expected byte size of a single element
 * @param type - The element type
 * @returns The size in bytes, or null if variable length
 */
export function getElementByteSize(type: string): number | null {
    switch (type.toLowerCase()) {
        case 'uint8':
        case 'int8':
            return 1;
        case 'uint16':
        case 'int16':
            return 2;
        case 'uint32':
        case 'int32':
        case 'float32':
            return 4;
        case 'uint64':
        case 'int64':
        case 'float64':
            return 8;
        default:
            return null; // Variable length
    }
}

/**
 * Get the expected byte size for a complete type (including arrays)
 * @param type - The type string
 * @returns The size in bytes, or null if variable length
 */
export function getExpectedByteSize(type: string): number | null {
    // Array types are variable length
    if (isArrayType(type)) {
        return null;
    }

    switch (type.toLowerCase()) {
        case 'uint8':
        case 'int8':
            return 1;
        case 'uint16':
        case 'int16':
            return 2;
        case 'uint32':
        case 'int32':
        case 'float32':
            return 4;
        case 'uint64':
        case 'int64':
        case 'float64':
            return 8;
        case 'uint':
        case 'int':
        case 'bytes':
        case 'ascii':
        case 'string':
            return null; // Variable length
        default:
            return null;
    }
}

/**
 * Parse array values from a user input string
 * @param input - User input string (e.g., "1 2 3" or "0x01,0x02,0x03")
 * @returns Array of byte values
 */
export function parseArrayInput(input: string): number[] {
    if (!input || input.trim() === '') {
        return [];
    }

    const parts = input.split(/[\s,]+/).filter(p => p.trim());
    const bytes: number[] = [];

    for (const part of parts) {
        let byte: number;
        if (part.startsWith('0x') || part.startsWith('0X')) {
            byte = parseInt(part, 16);
        } else {
            byte = parseInt(part, 10);
        }

        if (!isNaN(byte) && byte >= 0 && byte <= 255) {
            bytes.push(byte);
        }
    }

    return bytes;
}

/**
 * Format array values for input field display
 * @param bytes - Array of byte values
 * @returns Formatted string for display in input field (space-separated)
 */
export function formatArrayForInput(bytes: number[] | string): string {
    if (typeof bytes === 'string') {
        return bytes;
    }
    if (Array.isArray(bytes)) {
        return bytes.join(' ');
    }
    return '';
}
