import Float32Utils from './Float32Utils';

describe('Float32Utils', () => {
    it('should convert float32 to little-endian bytes and back', () => {
        const value = 123.45600128173828;
        const bytes = Float32Utils.float32ToBytesLE(value);
        const result = Float32Utils.bytesLEToFloat32(bytes);
        expect(result).toBe(value);
    });

    it('should convert float32 to string', () => {
        const value = 123.45600128173828;
        const result = Float32Utils.float32ToString(value);
        expect(result).toBe(value.toString());
    });

    it('should handle edge cases for float32 to little-endian bytes and back', () => {
        const values = [0, -0, Infinity, -Infinity, NaN];
        values.forEach(value => {
            const bytes = Float32Utils.float32ToBytesLE(value);
            const result = Float32Utils.bytesLEToFloat32(bytes);
            if (isNaN(value)) {
                expect(isNaN(result)).toBe(true);
            } else {
                expect(result).toBe(value);
            }
        });
    });

    it('should convert bytes 0 0 0 63 to float32 0.5', () => {
        const bytes = [0, 0, 0, 63];
        const result = Float32Utils.bytesLEToFloat32(bytes);
        expect(result).toBe(0.5);
    });

    it('should convert float32 0.5 to bytes 0 0 0 63', () => {
        const value = 0.5;
        const bytes = Float32Utils.float32ToBytesLE(value);
        expect(bytes).toEqual([0, 0, 0, 63]);
    });
});
