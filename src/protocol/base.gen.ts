// Auto-generated base types for protocol messages
// DO NOT EDIT - This file is generated from the protocol spec

/**
 * Base interface for all protocol messages
 */
export interface V3Message {
  /** Protocol version (always 3) */
  protocolVersion: number;
  /** Message length in bytes */
  length: number;
  /** Message type ID */
  messageType: number;
  /** Message type name */
  messageTypeName: string;
  /** Header data */
  header: HeaderData;
  /** Payload data */
  data: MessageData;
}

/**
 * Header field data
 */
export interface HeaderData {
  [fieldId: number]: number[] | undefined;
}

/**
 * Message payload data
 */
export interface MessageData {
  [fieldId: number]: number[] | undefined;
}

/**
 * Base class for protocol message encoding/decoding
 */
export abstract class ProtocolMessage {
  abstract readonly messageType: number;
  abstract readonly messageTypeName: string;
}

/**
 * Parse raw message structure from byte array
 */
export function parseRawMessage(bytes: number[]): V3Message {
  let index = 0;

  // Check for optional LB prefix
  if (bytes.length > 2 && bytes[0] === 0x4c && bytes[1] === 0x42) {
    index = 2;
  }

  if (bytes.length <= index) {
    throw new Error('Insufficient bytes for message');
  }

  const protocolVersion = bytes[index++];
  const length = readUint16LE(bytes, index);
  index += 2;
  const messageType = readUint16LE(bytes, index);
  index += 2;

  // Number of header fields
  const numHeaderFields = readUint16LE(bytes, index);
  index += 2;

  // Header field types
  const headerFieldTypes: number[] = [];
  for (let i = 0; i < numHeaderFields; i++) {
    headerFieldTypes.push(bytes[index++]);
  }

  // Header field data
  const header: HeaderData = {};
  for (let i = 0; i < numHeaderFields; i++) {
    const fieldType = headerFieldTypes[i];
    const dataLength = bytes[index++];
    const data = bytes.slice(index, index + dataLength);
    index += dataLength;
    header[fieldType] = data;
  }

  // Number of payload fields
  const numPayloadFields = readUint16LE(bytes, index);
  index += 2;

  // Payload field types
  const payloadFieldTypes: number[] = [];
  for (let i = 0; i < numPayloadFields; i++) {
    payloadFieldTypes.push(bytes[index++]);
  }

  // Payload field data
  const data: MessageData = {};
  for (let i = 0; i < numPayloadFields; i++) {
    const fieldType = payloadFieldTypes[i];
    const dataLength = bytes[index++];
    const fieldData = bytes.slice(index, index + dataLength);
    index += dataLength;
    data[fieldType] = fieldData;
  }

  // Checksum (last 2 bytes)
  const checksum = readUint16LE(bytes, index);
  index += 2;

  return {
    protocolVersion,
    length,
    messageType,
    messageTypeName: '', // Will be set by specific message class
    header,
    data,
  };
}

/**
 * Convert message to byte array
 */
export function messageToBytesHelper(msg: {
  messageType: number;
  header?: HeaderData;
  data?: MessageData;
  includePrefix?: boolean;
}): number[] {
  const bytes: number[] = [];

  // Protocol version
  bytes.push(3);

  // Placeholder for length (will be filled in later)
  bytes.push(0, 0);

  // Message type
  bytes.push(...writeUint16LE(msg.messageType));

  const header = msg.header || {};
  const data = msg.data || {};

  // Number of header fields
  const headerFieldTypes = Object.keys(header).map(Number).sort((a, b) => a - b);
  bytes.push(...writeUint16LE(headerFieldTypes.length));

  // Header field types
  for (const fieldType of headerFieldTypes) {
    bytes.push(fieldType);
  }

  // Header field data
  for (const fieldType of headerFieldTypes) {
    const fieldData = header[fieldType] || [];
    bytes.push(fieldData.length);
    bytes.push(...fieldData);
  }

  // Number of payload fields
  const payloadFieldTypes = Object.keys(data).map(Number).sort((a, b) => a - b);
  bytes.push(...writeUint16LE(payloadFieldTypes.length));

  // Payload field types
  for (const fieldType of payloadFieldTypes) {
    bytes.push(fieldType);
  }

  // Payload field data
  for (const fieldType of payloadFieldTypes) {
    const fieldData = data[fieldType] || [];
    bytes.push(fieldData.length);
    bytes.push(...fieldData);
  }

  // Update length
  const length = bytes.length + 2; // +2 for checksum
  bytes[1] = length & 0xff;
  bytes[2] = (length >> 8) & 0xff;

  // Calculate and append checksum
  const checksum = calculateCRC16XMODEM(bytes);
  bytes.push(...writeUint16LE(checksum));

  // Add prefix if requested
  if (msg.includePrefix) {
    return [0x4c, 0x42, ...bytes];
  }

  return bytes;
}

/**
 * Helper functions for byte manipulation
 */

export function readUint8(bytes: number[], offset: number): number {
  return bytes[offset];
}

export function readUint16LE(bytes: number[], offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

export function readUint32LE(bytes: number[], offset: number): number {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  ) >>> 0;
}

export function readUint64LE(bytes: number[], offset: number): bigint {
  const low = readUint32LE(bytes, offset);
  const high = readUint32LE(bytes, offset + 4);
  return (BigInt(high) << 32n) | BigInt(low);
}

export function readInt32LE(bytes: number[], offset: number): number {
  const value = readUint32LE(bytes, offset);
  return value > 0x7fffffff ? value - 0x100000000 : value;
}

export function readFloat32LE(bytes: number[], offset: number): number {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  for (let i = 0; i < 4; i++) {
    view.setUint8(i, bytes[offset + i]);
  }
  return view.getFloat32(0, true);
}

export function readAscii(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}

export function writeUint8(value: number): number[] {
  return [value & 0xff];
}

export function writeUint16LE(value: number): number[] {
  return [value & 0xff, (value >> 8) & 0xff];
}

export function writeUint32LE(value: number): number[] {
  return [
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff,
  ];
}

export function writeUint64LE(value: bigint): number[] {
  const low = Number(value & 0xffffffffn);
  const high = Number((value >> 32n) & 0xffffffffn);
  return [...writeUint32LE(low), ...writeUint32LE(high)];
}

export function writeInt32LE(value: number): number[] {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, value, true);
  return [view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)];
}

export function writeFloat32LE(value: number): number[] {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, value, true);
  return [view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)];
}

export function writeAscii(value: string): number[] {
  return Array.from(value).map(c => c.charCodeAt(0));
}

/**
 * CRC16-XMODEM calculation
 */
export function calculateCRC16XMODEM(bytes: number[]): number {
  let crc = 0;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
    crc &= 0xffff;
  }
  return crc;
}

/**
 * Read typed data from byte array
 */
export function readTypedData(bytes: number[], type: string): any {
  if (bytes.length === 0) return null;

  switch (type.toLowerCase()) {
    case 'uint8':
      return readUint8(bytes, 0);
    case 'uint16':
      return readUint16LE(bytes, 0);
    case 'uint32':
      return readUint32LE(bytes, 0);
    case 'uint64':
      return readUint64LE(bytes, 0);
    case 'int32':
      return readInt32LE(bytes, 0);
    case 'float32':
      return readFloat32LE(bytes, 0);
    case 'ascii':
    case 'string':
      return readAscii(bytes);
    case '[]uint8':
    case 'bytes':
      return bytes;
    case 'uint':
    case 'int':
      // Variable length integer
      let result = 0;
      for (let i = 0; i < bytes.length; i++) {
        result |= bytes[i] << (8 * i);
      }
      return result;
    default:
      return bytes;
  }
}

/**
 * Write typed data to byte array
 */
export function writeTypedData(value: any, type: string): number[] {
  switch (type.toLowerCase()) {
    case 'uint8':
      return writeUint8(value);
    case 'uint16':
      return writeUint16LE(value);
    case 'uint32':
      return writeUint32LE(value);
    case 'uint64':
      return writeUint64LE(BigInt(value));
    case 'int32':
      return writeInt32LE(value);
    case 'float32':
      return writeFloat32LE(value);
    case 'ascii':
    case 'string':
      return writeAscii(value);
    case '[]uint8':
    case 'bytes':
      return Array.isArray(value) ? value : [];
    case 'uint':
    case 'int':
      // For variable length, use uint32 as default
      return writeUint32LE(value);
    default:
      return Array.isArray(value) ? value : [];
  }
}
