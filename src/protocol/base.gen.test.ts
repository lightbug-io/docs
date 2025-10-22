import {
    isArrayType,
    getArrayElementType,
    getElementByteSize,
    readTypedData,
    readArrayData,
    writeTypedData,
    writeArrayData
} from './base.gen';

describe('base.gen array type functions', () => {
    describe('isArrayType', () => {
        it('should recognize array types', () => {
            expect(isArrayType('uint8[]')).toBe(true);
            expect(isArrayType('int16[]')).toBe(true);
            expect(isArrayType('float32[]')).toBe(true);
        });

        it('should not recognize non-array types', () => {
            expect(isArrayType('uint8')).toBe(false);
            expect(isArrayType('bytes')).toBe(false);
            expect(isArrayType('string')).toBe(false);
        });
    });

    describe('getArrayElementType', () => {
        it('should extract element type from array type', () => {
            expect(getArrayElementType('uint8[]')).toBe('uint8');
            expect(getArrayElementType('int16[]')).toBe('int16');
            expect(getArrayElementType('float32[]')).toBe('float32');
        });

        it('should return type as-is if not array', () => {
            expect(getArrayElementType('uint8')).toBe('uint8');
        });
    });

    describe('readTypedData with array types', () => {
        it('should return bytes array for uint8[]', () => {
            const bytes = [1, 2, 3, 4, 5];
            const result = readTypedData(bytes, 'uint8[]');
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it('should parse single uint8 values from uint8[] bytes', () => {
            const bytes = [42, 100, 255];
            const result = readTypedData(bytes, 'uint8[]');
            expect(result).toEqual([42, 100, 255]);
        });

        it('should return null for empty bytes', () => {
            const result = readTypedData([], 'uint8[]');
            expect(result).toBeNull();
        });

        it('should handle uint16[] (2 bytes per element)', () => {
            // Two 16-bit values: 0x0102 and 0x0304 (little-endian)
            const bytes = [0x02, 0x01, 0x04, 0x03];
            const result = readTypedData(bytes, 'uint16[]');
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('readArrayData', () => {
        it('should parse uint8[] correctly', () => {
            const bytes = [10, 20, 30];
            const result = readArrayData(bytes, 'uint8');
            expect(result).toEqual([10, 20, 30]);
        });

        it('should handle empty array', () => {
            const bytes: number[] = [];
            const result = readArrayData(bytes, 'uint8');
            expect(result).toEqual([]);
        });

        it('should parse partial data for fixed-size elements', () => {
            const bytes = [10, 20, 30]; // 3 bytes - partial uint16
            const result = readArrayData(bytes, 'uint16');
            expect(result.length).toBe(1); // Should only parse complete elements
        });
    });

    describe('writeTypedData with array types', () => {
        it('should accept string input for uint8[]', () => {
            const result = writeTypedData('1 2 3', 'uint8[]');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should accept array input for uint8[]', () => {
            const result = writeTypedData([1, 2, 3], 'uint8[]');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should parse hex values in string', () => {
            const result = writeTypedData('0x01 0x02 0x03', 'uint8[]');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should parse comma-separated values', () => {
            const result = writeTypedData('1,2,3', 'uint8[]');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should return empty array for empty input', () => {
            expect(writeTypedData('', 'uint8[]')).toEqual([]);
            expect(writeTypedData([], 'uint8[]')).toEqual([]);
        });

        it('should filter out-of-range values', () => {
            const result = writeTypedData('1 256 3', 'uint8[]');
            expect(result).toEqual([1, 3]);
        });
    });

    describe('writeArrayData', () => {
        it('should convert string to bytes', () => {
            const result = writeArrayData('1 2 3', 'uint8');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should handle already parsed array', () => {
            const result = writeArrayData([1, 2, 3], 'uint8');
            expect(result).toEqual([1, 2, 3]);
        });

        it('should return empty array for empty string', () => {
            expect(writeArrayData('', 'uint8')).toEqual([]);
        });

        it('should parse hex notation', () => {
            const result = writeArrayData('0xFF 0x80 0x00', 'uint8');
            expect(result).toEqual([255, 128, 0]);
        });
    });

    describe('getElementByteSize', () => {
        it('should return correct sizes', () => {
            expect(getElementByteSize('uint8')).toBe(1);
            expect(getElementByteSize('uint16')).toBe(2);
            expect(getElementByteSize('uint32')).toBe(4);
            expect(getElementByteSize('uint64')).toBe(8);
            expect(getElementByteSize('float32')).toBe(4);
        });

        it('should return null for variable-length types', () => {
            expect(getElementByteSize('ascii')).toBeNull();
            expect(getElementByteSize('bytes')).toBeNull();
        });
    });

    describe('Integration: Parse and write array data', () => {
        it('should round-trip uint8[] data', () => {
            const original = [10, 20, 30];
            const written = writeTypedData(original, 'uint8[]');
            const read = readTypedData(written, 'uint8[]');
            expect(read).toEqual(original);
        });

        it('should round-trip string-formatted array', () => {
            const original = '1 2 3';
            const written = writeTypedData(original, 'uint8[]');
            const read = readTypedData(written, 'uint8[]');
            expect(read).toEqual([1, 2, 3]);
        });
    });
});
