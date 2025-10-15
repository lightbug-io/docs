import { describe, it, expect } from '@jest/globals';
import { parseByteString, formatBytes } from './ByteStringParser';

describe('ByteStringParser', () => {
    describe('parseByteString', () => {
        describe('decimal mode', () => {
        it('should parse simple space-separated integers', () => {
            const result = parseByteString('3 14 0 13 0 0 0 1 0 6 1 84 103 57');
            expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
            expect(result[0].hasHex).toBe(false);
        });            it('should parse comma-separated integers', () => {
                const result = parseByteString('3,14,0,13,0,0,0,1,0,6,1,84,103,57');
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should parse mixed separators', () => {
                const result = parseByteString('3, 14, 0 13   0,0 0 1');
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should ignore values > 255', () => {
                const result = parseByteString('3 256 14 1000 255 0');
                expect(result[0].bytes).toEqual([3, 14, 255, 0]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should ignore negative values', () => {
                const result = parseByteString('3 -14 0 -1 255');
                expect(result[0].bytes).toEqual([3, 0, 255]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should handle messy input with random text', () => {
                const result = parseByteString('hello 3 world 14 test 0 foo 13');
                expect(result[0].bytes).toEqual([3, 14, 0, 13]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should handle really messy input with URLs and text', () => {
                const input = 'sjaikfwhttp://sadokjsaodkaskdpsadjoisf 3 14 0 13 0 0 0 1 0 6 1 84 103 57 oisfdao sfolksafsaf';
                const result = parseByteString(input);
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should handle multiple messages with noise', () => {
                const input = 'noise 3 14 0 13 0 0 0 1 0 6 1 84 103 57 more noise 3 14 0 13 0 0 0 1 0 6 1 84 103 57 end';
                const result = parseByteString(input);
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57, 3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should handle empty input', () => {
                const result = parseByteString('');
                expect(result).toEqual([]);
            });

            it('should handle whitespace-only input', () => {
                const result = parseByteString('   \t\n  ');
                expect(result).toEqual([]);
            });

            it('should handle input with no valid bytes', () => {
                const result = parseByteString('hello world foo bar');
                expect(result).toEqual([{bytes: [], hasHex: false}]);
            });

            it('should parse first message from log output', () => {
                const input = '(parse) Received null Response 90: 03 24 00 05 00 02 00 03 04 04 90 00 00 00 01 07 01 00 01 02 30 00 247 143';
                const result = parseByteString(input);
                expect(result[0].bytes).toEqual([90, 3, 24, 0, 5, 0, 2, 0, 3, 4, 4, 90, 0, 0, 0, 1, 7, 1, 0, 1, 2, 30, 0, 247, 143]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should parse second message from log output', () => {
                const input = '(parse) 90 Sent: 03 27 00 30 00 02 00 05 01 01 04 04 90 00 00 00 01 00 02 05 104 101 108 108 111 221 147';
                const result = parseByteString(input);
                expect(result[0].bytes).toEqual([90, 3, 27, 0, 30, 0, 2, 0, 5, 1, 1, 4, 4, 90, 0, 0, 0, 1, 0, 2, 5, 104, 101, 108, 108, 111, 221, 147]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should parse multiple messages from combined log output', () => {
                const input = '(parse) Received null Response 90: 03 24 00 05 00 02 00 03 04 04 90 00 00 00 01 07 01 00 01 02 30 00 247 143\n(parse) 90 Sent: 03 27 00 30 00 02 00 05 01 01 04 04 90 00 00 00 01 00 02 05 104 101 108 108 111 221 147';
                const result = parseByteString(input);
                expect(result).toHaveLength(2);
                expect(result[0].bytes).toEqual([90, 3, 24, 0, 5, 0, 2, 0, 3, 4, 4, 90, 0, 0, 0, 1, 7, 1, 0, 1, 2, 30, 0, 247, 143]);
                expect(result[0].hasHex).toBe(false);
                expect(result[1].bytes).toEqual([90, 3, 27, 0, 30, 0, 2, 0, 5, 1, 1, 4, 4, 90, 0, 0, 0, 1, 0, 2, 5, 104, 101, 108, 108, 111, 221, 147]);
                expect(result[1].hasHex).toBe(false);
            });
        });

        describe('hex mode', () => {
            it('should parse continuous hex string', () => {
                const result = parseByteString('030E000D00000001000601547367');
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 115, 103]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should parse space-separated hex', () => {
                const result = parseByteString('03 0E 00 0D FF');
                expect(result[0].bytes).toEqual([3, 14, 0, 13, 255]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should parse 0x-prefixed hex values', () => {
                const result = parseByteString('0x03 0x0E 0x00 0x0D');
                expect(result[0].bytes).toEqual([3, 14, 0, 13]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should parse mixed 0x and plain hex', () => {
                const result = parseByteString('0x03 0E 0x00 0D');
                // When 0x is present, we're in hex mode - will extract 0x values
                expect(result[0].bytes).toEqual([3, 0]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should handle lowercase and uppercase hex', () => {
                const result = parseByteString('0a 0B fF FF');
                expect(result[0].bytes).toEqual([10, 11, 255, 255]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should handle hex pairs with random text mixed in', () => {
                // When hex pairs are sparse among text, decimal mode is used
                const result = parseByteString('hello 0a world 0B test ff');
                // In decimal mode: 0 is valid, 'a' and 'B' are invalid, ff is invalid
                // So we extract: 0, 0 (from 0a and 0B)
                expect(result[0].bytes).toEqual([0, 0]);
                expect(result[0].hasHex).toBe(false);
            });

            it('should parse clean hex pairs with minimal noise', () => {
                // More hex pairs with less text - should be detected as hex
                const result = parseByteString('0a 0B ff aa bb 03');
                expect(result[0].bytes).toEqual([10, 11, 255, 170, 187, 3]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should parse comma-separated hex from log output', () => {
                // Real-world example: hex bytes in log messages with commas
                const input = '[lb.comms] DEBUG: SEND: Message type: 13 length: 0 id: 1 bytes: 03, 11, 00, 0d, 00, 01, 00, 01, 04, 01, 00, 00, 00, 00, 00, 4a, e7';
                const result = parseByteString(input);
                expect(result[0].bytes).toEqual([3, 17, 0, 13, 0, 1, 0, 1, 4, 1, 0, 0, 0, 0, 0, 74, 231]);
                expect(result[0].hasHex).toBe(true);
            });

            it('should parse multiple messages with mixed separators on separate lines', () => {
                const input = `03 20 00 33 00 02 00 01 05 04 23 00 00 00 01 02 00 00 123 128
03, 2d, 00, 21, 00, 02, 00, 03, 04, 04, 17, 00, 00, 00, 01, 00, 02, 00, 01, 02, 01, 01, 14, 6c, 69, 67, 68, 74, 62, 75, 67, 2e, 74, 65, 6c, 65, 32, 2e, 63, 6f, 6d, 11, c0, dd, 4e`;
                const result = parseByteString(input);
                expect(result).toHaveLength(2);
                expect(result[0].bytes).toEqual([3, 20, 0, 33, 0, 2, 0, 1, 5, 4, 23, 0, 0, 0, 1, 2, 0, 0, 123, 128]);
                expect(result[0].hasHex).toBe(false);
                expect(result[1].bytes).toEqual([3, 45, 0, 33, 0, 2, 0, 3, 4, 4, 23, 0, 0, 0, 1, 0, 2, 0, 1, 2, 1, 1, 20, 108, 105, 103, 104, 116, 98, 117, 103, 46, 116, 101, 108, 101, 50, 46, 99, 111, 109, 17, 192, 221, 78]);
                expect(result[1].hasHex).toBe(true);
            });
        });
    });

    describe('formatBytes', () => {
        const testBytes = [3, 14, 0, 13, 255];

        it('should format as integers', () => {
            const result = formatBytes(testBytes, 'ints');
            expect(result).toBe('314013255');
        });

        it('should format as integers with spaces', () => {
            const result = formatBytes(testBytes, 'ints', { spaces: true });
            expect(result).toBe('3 14 0 13 255');
        });

        it('should format as integers with commas', () => {
            const result = formatBytes(testBytes, 'ints', { commas: true });
            expect(result).toBe('3,14,0,13,255');
        });

        it('should format as integers with spaces and commas', () => {
            const result = formatBytes(testBytes, 'ints', { spaces: true, commas: true });
            expect(result).toBe('3, 14, 0, 13, 255');
        });

        it('should format as hex', () => {
            const result = formatBytes(testBytes, 'hex', { spaces: true });
            expect(result).toBe('03 0E 00 0D FF');
        });

        it('should format as hex with 0x prefix', () => {
            const result = formatBytes(testBytes, 'hex0x', { spaces: true });
            expect(result).toBe('0x03 0x0E 0x00 0x0D 0xFF');
        });

        it('should format as printf style', () => {
            const result = formatBytes(testBytes, 'printf');
            expect(result).toBe("'\\x03''\\x0e''\\x00''\\x0d''\\xff'");
        });

        it('should handle empty array', () => {
            const result = formatBytes([], 'ints', { spaces: true });
            expect(result).toBe('');
        });
    });
});
