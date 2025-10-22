import { parseIdeDebugCsv } from './IdeDebugParser';

describe('parseIdeDebugCsv', () => {
    it('should parse a simple char[5] array', () => {
        const csv = `Level,Expression,Value,Location,Refresh,Access
0,"(char[5])buffer","\\0\\1",0x1000,"Off",
1,"[0]","0 ('\\0')",0x1000,"Off",
1,"[1]","1 ('\\001')",0x1001,"Off",
1,"[2]","255 ('ÿ')",0x1002,"Off",
1,"[3]","-1 ('ÿ')",0x1003,"Off",
1,"[4]","42 ('*')",0x1004,"Off",`;

        const result = parseIdeDebugCsv(csv);
        expect(result).toBe('0x00 0x01 0xff 0xff 0x2a');
    });

    it('should handle negative byte values correctly', () => {
        const csv = `Level,Expression,Value,Location,Refresh,Access
0,"(char[3])data",0,0x1000,"Off",
1,"[0]","-16 ('ð')",0x1000,"Off",
1,"[1]","-1 ('ÿ')",0x1001,"Off",
1,"[2]","18 ('\\018')",0x1002,"Off",`;

        const result = parseIdeDebugCsv(csv);
        expect(result).toBe('0xf0 0xff 0x12');
    });

    it('should ignore outofscope entries', () => {
        const csv = `Level,Expression,Value,Location,Refresh,Access
0,"(char[2])buffer",,"<outofscope>","Off",
0,"(char[3])data",0,0x1000,"Off",
1,"[0]","10 ('\\n')",0x1000,"Off",
1,"[1]","20 ('\\024')",0x1001,"Off",
1,"[2]","30 ('\\036')",0x1002,"Off",`;

        const result = parseIdeDebugCsv(csv);
        expect(result).toBe('0x0a 0x14 0x1e');
    });

    it('should return null for non-IDE-debug CSV', () => {
        const csv = `Name,Age,Email
John,30,john@example.com
Jane,25,jane@example.com`;

        const result = parseIdeDebugCsv(csv);
        expect(result).toBeNull();
    });

    it('should return null for empty input', () => {
        const result = parseIdeDebugCsv('');
        expect(result).toBeNull();
    });

    it('should extract multiple char arrays from one file', () => {
        const csv = `Level,Expression,Value,Location,Refresh,Access
0,"(char[2])buffer1",0,0x1000,"Off",
1,"[0]","1 ('\\001')",0x1000,"Off",
1,"[1]","2 ('\\002')",0x1001,"Off",
0,"(char[3])buffer2",0,0x2000,"Off",
1,"[0]","10 ('\\n')",0x2000,"Off",
1,"[1]","20 ('\\024')",0x2001,"Off",
1,"[2]","30 ('\\036')",0x2002,"Off",`;

        const result = parseIdeDebugCsv(csv);
        expect(result).toBe('0x01 0x02 0x0a 0x14 0x1e');
    });
});
