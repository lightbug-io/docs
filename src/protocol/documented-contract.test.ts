import fs from 'node:fs';
import path from 'node:path';
const yaml = require('js-yaml');
import { messageToBytesHelper, parseRawMessage, calculateCRC16XMODEM } from './base.gen';

const spec = yaml.load(fs.readFileSync(path.join(process.cwd(), 'public/files/protocol-v3.yaml'), 'utf8')) as any;

describe('documented protocol contract', () => {
  it('documents conditional power fields without exposing internal WiFi controls', () => {
    const fields = spec.messages[48].data;
    expect(fields[1]).toBeUndefined();
    expect(fields[2]).toBeUndefined();
    for (const id of [6, 7, 8, 9]) expect(fields[id].type).toBe('float32');
    expect(fields[6].unit).toBe('V');
    expect(fields[7].unit).toBe('mAh');
    expect(fields[8].unit).toBe('mA');
    expect(fields[9].unit).toBe('mA');
    expect(fields[10].type).toBe('uint16');
    expect(fields[10].unit).toBe('mA');
  });

  it('keeps message-box state CRC distinct from its extended-length payload', () => {
    expect(spec.messages[58].data[1].type).toBe('uint16');
    expect(spec.messages[58].data[129].type).toBe('bytes');
    expect(spec.messages[58].header).toContain(5);
    expect(spec.messages[58].methods).toHaveProperty('GET');
    expect(spec.messages[58].methods).not.toHaveProperty('SET');
  });

  it.each([3, 61, 256, 1024])('round-trips a %i-byte field 129 with a two-byte length', size => {
    const payload = Array.from({ length: size }, (_, i) => (i + 1) & 255);
    const bytes = messageToBytesHelper({ messageType: 58, data: { 1: [0x34, 0x12], 129: payload } });
    const decoded = parseRawMessage(bytes);
    expect(decoded.length).toBe(bytes.length);
    expect(decoded.data[129]).toEqual(payload);
    // Header count is zero; two payload IDs, field 1 length/value precede field 129 length.
    expect(bytes.slice(14, 16)).toEqual([size & 255, size >> 8]);
    expect(bytes.slice(-2)).toEqual([calculateCRC16XMODEM(bytes.slice(0, -2)) & 255, calculateCRC16XMODEM(bytes.slice(0, -2)) >> 8]);
  });

  it('publishes a valid synthetic GET example, rather than a SET or hardware claim', () => {
    const example = spec.messages[58].examples[0];
    expect(example.name).toContain('Synthetic');
    expect(example.real).toBeUndefined();
    const bytes = example.bytes.split(/\s+/).map(Number);
    const msg = parseRawMessage(bytes);
    expect(msg.messageType).toBe(58);
    expect(msg.header[5]).toEqual([2]);
    expect(msg.length).toBe(bytes.length);
    expect(bytes).toEqual(messageToBytesHelper({ messageType: 58, header: msg.header, data: msg.data }));
  });
});
