import {
    formatArrayValue,
    isArrayType,
    getArrayElementType,
    getElementByteSize,
    getExpectedByteSize,
    parseArrayInput,
    formatArrayForInput
} from './ByteFormatting';

describe('ByteFormatting utilities', () => {
    describe('formatArrayValue', () => {
        it('should format non-empty array with correct length and comma-separated values', () => {
            const result = formatArrayValue([1, 2, 3]);
            expect(result).toBe('Length: 3, Value: 1,2,3');
        });

        it('should format empty array', () => {
            const result = formatArrayValue([]);
            expect(result).toBe('Length: 0, Value: (empty)');
        });

        it('should format single element array', () => {
            const result = formatArrayValue([42]);
            expect(result).toBe('Length: 1, Value: 42');
        });

        it('should format large values correctly', () => {
            const result = formatArrayValue([255, 128, 0]);
            expect(result).toBe('Length: 3, Value: 255,128,0');
        });

        it('should handle array type parameter', () => {
            const result = formatArrayValue([1, 2, 3], 'int16');
            expect(result).toBe('Length: 3, Value: 1,2,3');
        });
    });

    describe('isArrayType', () => {
        it('should return true for uint8[]', () => {
            expect(isArrayType('uint8[]')).toBe(true);
        });

        it('should return true for int16[]', () => {
            expect(isArrayType('int16[]')).toBe(true);
        });

        it('should return true for float32[]', () => {
            expect(isArrayType('float32[]')).toBe(true);
        });

        it('should return false for uint8', () => {
            expect(isArrayType('uint8')).toBe(false);
        });

        it('should return false for bytes', () => {
            expect(isArrayType('bytes')).toBe(false);
        });

        it('should return false for string', () => {
            expect(isArrayType('string')).toBe(false);
        });
    });

    describe('getArrayElementType', () => {
        it('should extract uint8 from uint8[]', () => {
            expect(getArrayElementType('uint8[]')).toBe('uint8');
        });

        it('should extract int16 from int16[]', () => {
            expect(getArrayElementType('int16[]')).toBe('int16');
        });

        it('should return the type if not an array', () => {
            expect(getArrayElementType('uint8')).toBe('uint8');
        });

        it('should handle whitespace', () => {
            expect(getArrayElementType('uint8 []')).toBe('uint8');
        });
    });

    describe('getElementByteSize', () => {
        it('should return 1 for uint8', () => {
            expect(getElementByteSize('uint8')).toBe(1);
        });

        it('should return 2 for uint16', () => {
            expect(getElementByteSize('uint16')).toBe(2);
        });

        it('should return 4 for uint32', () => {
            expect(getElementByteSize('uint32')).toBe(4);
        });

        it('should return 4 for float32', () => {
            expect(getElementByteSize('float32')).toBe(4);
        });

        it('should return 8 for uint64', () => {
            expect(getElementByteSize('uint64')).toBe(8);
        });

        it('should return null for variable length types', () => {
            expect(getElementByteSize('ascii')).toBeNull();
        });

        it('should be case-insensitive', () => {
            expect(getElementByteSize('UINT8')).toBe(1);
            expect(getElementByteSize('UInt16')).toBe(2);
        });
    });

    describe('getExpectedByteSize', () => {
        it('should return null for array types', () => {
            expect(getExpectedByteSize('uint8[]')).toBeNull();
            expect(getExpectedByteSize('int16[]')).toBeNull();
        });

        it('should return correct size for scalar types', () => {
            expect(getExpectedByteSize('uint8')).toBe(1);
            expect(getExpectedByteSize('uint16')).toBe(2);
            expect(getExpectedByteSize('uint32')).toBe(4);
            expect(getExpectedByteSize('uint64')).toBe(8);
        });

        it('should return null for variable-length types', () => {
            expect(getExpectedByteSize('bytes')).toBeNull();
            expect(getExpectedByteSize('ascii')).toBeNull();
            expect(getExpectedByteSize('string')).toBeNull();
            expect(getExpectedByteSize('uint')).toBeNull();
            expect(getExpectedByteSize('int')).toBeNull();
        });
    });

    describe('parseArrayInput', () => {
        it('should parse space-separated numbers', () => {
            const result = parseArrayInput('1 2 3');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should parse comma-separated numbers', () => {
            const result = parseArrayInput('1,2,3');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should parse hex values with 0x prefix', () => {
            const result = parseArrayInput('0x01 0x02 0x03');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should parse mixed hex and decimal', () => {
            const result = parseArrayInput('0x01 2 0x03');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should ignore invalid values', () => {
            const result = parseArrayInput('1 abc 2');
            expect(result).toEqual([1, 2]);
        });

        it('should filter out-of-range values', () => {
            const result = parseArrayInput('1 256 3');
            expect(result).toEqual([1, 3]);
        });

        it('should handle empty string', () => {
            expect(parseArrayInput('')).toEqual([]);
        });

        it('should handle whitespace only', () => {
            expect(parseArrayInput('   ')).toEqual([]);
        });

        it('should handle mixed separators', () => {
            const result = parseArrayInput('1, 2 3,4');
            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('should handle uppercase 0X prefix', () => {
            const result = parseArrayInput('0X0A 0X0B');
            expect(result).toEqual([10, 11]);
        });
    });

    describe('formatArrayForInput', () => {
        it('should format array as space-separated string', () => {
            const result = formatArrayForInput([1, 2, 3]);
            expect(result).toBe('1 2 3');
        });

        it('should format empty array', () => {
            const result = formatArrayForInput([]);
            expect(result).toBe('');
        });

        it('should return string as-is', () => {
            const result = formatArrayForInput('1 2 3');
            expect(result).toBe('1 2 3');
        });

        it('should handle large values', () => {
            const result = formatArrayForInput([255, 128, 0]);
            expect(result).toBe('255 128 0');
        });
    });
});
