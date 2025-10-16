import { describe, it, expect } from '@jest/globals';
import { parseByteString, formatBytes } from './ByteStringParser';

describe('ByteStringParser', () => {
    describe('parseByteString', () => {
        describe('decimal mode', () => {
            it('should parse simple space-separated integers', () => {
                const result = parseByteString('3 14 0 13 0 0 0 1 0 6 1 84 103 57');
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result.hasHex).toBe(false);
            });

            it('should parse comma-separated integers', () => {
                const result = parseByteString('3,14,0,13,0,0,0,1,0,6,1,84,103,57');
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result.hasHex).toBe(false);
            });

            it('should parse mixed separators', () => {
                const result = parseByteString('3, 14, 0 13   0,0 0 1');
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1]);
                expect(result.hasHex).toBe(false);
            });

            it('should ignore values > 255', () => {
                const result = parseByteString('3 256 14 1000 255 0');
                expect(result.bytes).toEqual([3, 14, 255, 0]);
                expect(result.hasHex).toBe(false);
            });

            it('should ignore negative values', () => {
                const result = parseByteString('3 -14 0 -1 255');
                expect(result.bytes).toEqual([3, 0, 255]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle messy input with random text', () => {
                const result = parseByteString('hello 3 world 14 test 0 foo 13');
                expect(result.bytes).toEqual([3, 14, 0, 13]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle really messy input with URLs and text', () => {
                const input = 'sjaikfwhttp://sadokjsaodkaskdpsadjoisf 3 14 0 13 0 0 0 1 0 6 1 84 103 57 oisfdao sfolksafsaf';
                const result = parseByteString(input);
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle multiple messages with noise (no longer split)', () => {
                const input = 'noise 3 14 0 13 0 0 0 1 0 6 1 84 103 57 more noise 3 14 0 13 0 0 0 1 0 6 1 84 103 57 end';
                const result = parseByteString(input);
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57, 3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 103, 57]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle newlines as just another separator', () => {
                const result = parseByteString('255\n255');
                expect(result.bytes).toEqual([255, 255]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle multiline messages', () => {
                const input = '3 14 0 13\n0 0 0 1\n0 6 1 84';
                const result = parseByteString(input);
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84]);
                expect(result.hasHex).toBe(false);
            });

            it('should handle empty input', () => {
                const result = parseByteString('');
                expect(result.bytes).toEqual([]);
            });

            it('should handle whitespace-only input', () => {
                const result = parseByteString('   \t\n  ');
                expect(result.bytes).toEqual([]);
            });

            it('should handle input with no valid bytes', () => {
                const result = parseByteString('hello world foo bar');
                expect(result.bytes).toEqual([]);
                expect(result.hasHex).toBe(false);
            });

            it('should ignore (parse) markers as noise', () => {
                const input = '(parse) Received null Response 90: 03 24 00 05 00 02 00 03 04 04 90 00 00 00 01 07 01 00 01 02 30 00 247 143';
                const result = parseByteString(input);
                expect(result.bytes).toEqual([90, 3, 24, 0, 5, 0, 2, 0, 3, 4, 4, 90, 0, 0, 0, 1, 7, 1, 0, 1, 2, 30, 0, 247, 143]);
                expect(result.hasHex).toBe(false);
            });

            it('should treat multiple messages on different lines as one continuous stream', () => {
                const input = '(parse) Received null Response 90: 03 24 00 05 00 02 00 03 04 04 90 00 00 00 01 07 01 00 01 02 30 00 247 143\n(parse) 90 Sent: 03 27 00 30 00 02 00 05 01 01 04 04 90 00 00 00 01 00 02 05 104 101 108 108 111 221 147';
                const result = parseByteString(input);
                // All bytes from both messages combined
                expect(result.bytes).toEqual([90, 3, 24, 0, 5, 0, 2, 0, 3, 4, 4, 90, 0, 0, 0, 1, 7, 1, 0, 1, 2, 30, 0, 247, 143, 90, 3, 27, 0, 30, 0, 2, 0, 5, 1, 1, 4, 4, 90, 0, 0, 0, 1, 0, 2, 5, 104, 101, 108, 108, 111, 221, 147]);
                expect(result.hasHex).toBe(false);
            });
        });

        describe('hex mode', () => {
            it('should parse continuous hex string', () => {
                const result = parseByteString('030E000D00000001000601547367');
                expect(result.bytes).toEqual([3, 14, 0, 13, 0, 0, 0, 1, 0, 6, 1, 84, 115, 103]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse continuous hex with noise in middle', () => {
                const result = parseByteString('ff foolala ff');
                expect(result.bytes).toEqual([255, 255]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse ffff as two bytes 255 255', () => {
                const result = parseByteString('ffff');
                expect(result.bytes).toEqual([255, 255]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse 0xff0xff as two bytes', () => {
                const result = parseByteString('0xff0xff');
                expect(result.bytes).toEqual([255, 255]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse space-separated hex', () => {
                const result = parseByteString('03 0E 00 0D FF');
                expect(result.bytes).toEqual([3, 14, 0, 13, 255]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse 0x-prefixed hex values', () => {
                const result = parseByteString('0x03 0x0E 0x00 0x0D');
                expect(result.bytes).toEqual([3, 14, 0, 13]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse continuous 0x notation', () => {
                const result = parseByteString('0x030x0E0x000x0D');
                expect(result.bytes).toEqual([3, 14, 0, 13]);
                expect(result.hasHex).toBe(true);
            });

            it('should handle lowercase and uppercase hex', () => {
                const result = parseByteString('0a 0B fF FF');
                expect(result.bytes).toEqual([10, 11, 255, 255]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse clean hex pairs with minimal noise', () => {
                const result = parseByteString('0a 0B ff aa bb 03');
                expect(result.bytes).toEqual([10, 11, 255, 170, 187, 3]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse comma-separated hex from log output', () => {
                const input = '[lb.comms] DEBUG: SEND: Message type: 13 length: 0 id: 1 bytes: 03, 11, 00, 0d, 00, 01, 00, 01, 04, 01, 00, 00, 00, 00, 00, 4a, e7';
                const result = parseByteString(input);
                expect(result.bytes).toEqual([3, 17, 0, 13, 0, 1, 0, 1, 4, 1, 0, 0, 0, 0, 0, 74, 231]);
                expect(result.hasHex).toBe(true);
            });

            it('should parse verbose log output with 0x notation and newlines', () => {
                const input = `02> Verbose: --- Message type 33 len 65
02> 0x03 0x41 0x00 0x21 0x00 0x02 0x00 0x03 0x04 0x04 0x17 0x00 0x00 0x00 0x01 0x00 0x03 0x00 0x01 0x02 0x08 0x01 0x01 0x12 0x6C 0x69 0x67 0x68 0x74 0x62 0x75 0x67 0x2E 0x74 0x65 0x6C 0x65 0x32 0x2E 0x63 0x6F 0x6D 0x14 0x38 0x39 0x34 0x36 0x32 0x30 0x33 0x38 0x30 0x37 0x36 0x30 0x30 0x36 0x37 0x31 0x34 0x30 0x36 0x39 0x22 0xB1
02> Verbose: ---`;
                const result = parseByteString(input);
                // The 02 and numbers like 33, 65 might be parsed but they're valid bytes so that's OK
                // The important part is we get the 0x bytes correctly
                expect(result.bytes).toContain(0x03);
                expect(result.bytes).toContain(0x41);
                expect(result.bytes).toContain(0xB1);
                expect(result.hasHex).toBe(true);
                // Check the exact expected bytes (ignoring the 02, 33, 65 that might appear)
                const expectedBytes = [0x03, 0x41, 0x00, 0x21, 0x00, 0x02, 0x00, 0x03, 0x04, 0x04, 0x17, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x00, 0x01, 0x02, 0x08, 0x01, 0x01, 0x12, 0x6C, 0x69, 0x67, 0x68, 0x74, 0x62, 0x75, 0x67, 0x2E, 0x74, 0x65, 0x6C, 0x65, 0x32, 0x2E, 0x63, 0x6F, 0x6D, 0x14, 0x38, 0x39, 0x34, 0x36, 0x32, 0x30, 0x33, 0x38, 0x30, 0x37, 0x36, 0x30, 0x30, 0x36, 0x37, 0x31, 0x34, 0x30, 0x36, 0x39, 0x22, 0xB1];
                // The result should contain all these bytes in sequence (might have extras from text)
                let foundIndex = 0;
                for (let i = 0; i < result.bytes.length && foundIndex < expectedBytes.length; i++) {
                    if (result.bytes[i] === expectedBytes[foundIndex]) {
                        foundIndex++;
                    }
                }
                expect(foundIndex).toBe(expectedBytes.length);
            });
        });

        describe('mixed and edge cases', () => {
            it('should handle multiline hex with noise', () => {
                const input = `noise
ff aa
more noise
bb cc`;
                const result = parseByteString(input);
                expect(result.bytes).toEqual([255, 170, 187, 204]);
                expect(result.hasHex).toBe(true);
            });

            it('should treat all non-valid chars as noise', () => {
                const result = parseByteString('!@#$%^&*()ff-+=[]{}|;:\'",.<>?/~`aa');
                expect(result.bytes).toEqual([255, 170]);
                expect(result.hasHex).toBe(true);
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
