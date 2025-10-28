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

export function readInt8(bytes: number[], offset: number): number {
  const value = bytes[offset];
  return value > 0x7f ? value - 0x100 : value;
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

export function writeInt8(value: number): number[] {
  const buffer = new ArrayBuffer(1);
  const view = new DataView(buffer);
  view.setInt8(0, value);
  return [view.getUint8(0)];
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
 * Check if a type is an array type (e.g., uint8[], int16[])
 */
export function isArrayType(type: string): boolean {
  return type.includes('[]');
}

/**
 * Get the base element type of an array type (e.g., uint8 from uint8[])
 */
export function getArrayElementType(type: string): string {
  if (!isArrayType(type)) return type;
  return type.replace(/\[\]$/, '').trim();
}

/**
 * Read typed data from byte array
 */
export function readTypedData(bytes: number[], type: string): any {
  if (bytes.length === 0) return null;

  const normalizedType = type.toLowerCase();

  // Handle array types
  if (isArrayType(normalizedType)) {
    const elementType = getArrayElementType(normalizedType);
    return readArrayData(bytes, elementType);
  }

  switch (normalizedType) {
    case 'uint8':
      return readUint8(bytes, 0);
    case 'int8':
      return readInt8(bytes, 0);
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
    case 'bool':
      // Boolean: 0 = false, 1 = true
      return bytes[0] === 1;
    default:
      return bytes;
  }
}

/**
 * Read array data from bytes
 */
export function readArrayData(bytes: number[], elementType: string): number[] {
  const elementSize = getElementByteSize(elementType);
  if (elementSize === null) {
    // For variable-length elements, we can't reliably split, return raw bytes
    return bytes;
  }

  const result: number[] = [];
  for (let i = 0; i < bytes.length; i += elementSize) {
    if (i + elementSize <= bytes.length) {
      const elementBytes = bytes.slice(i, i + elementSize);
      const value = readTypedData(elementBytes, elementType);
      result.push(typeof value === 'number' ? value : value.toString().charCodeAt(0));
    }
  }
  return result;
}

/**
 * Get the byte size of a single element of a type (not array size)
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
 * Write typed data to byte array
 */
export function writeTypedData(value: any, type: string): number[] {
  const normalizedType = type.toLowerCase();

  // Handle array types
  if (isArrayType(normalizedType)) {
    const elementType = getArrayElementType(normalizedType);
    return writeArrayData(value, elementType);
  }

  switch (normalizedType) {
    case 'uint8':
      return writeUint8(value);
    case 'int8':
      return writeInt8(value);
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
    case 'bytes':
      return Array.isArray(value) ? value : [];
    case 'uint':
    case 'int':
      // For variable length, use uint32 as default
      return writeUint32LE(value);
    case 'bool':
      // Boolean: 0 = false, 1 = true
      return writeUint8(value ? 1 : 0);
    default:
      return Array.isArray(value) ? value : [];
  }
}

/**
 * Write array data to bytes
 */
export function writeArrayData(value: any, elementType: string): number[] {
  // If value is already an array of numbers, treat as direct bytes
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
    return value;
  }

  // If it's a string, parse as space or comma-separated values
  if (typeof value === 'string') {
    const parts = value.trim().split(/[\s,]+/).filter(p => p.trim());
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

  return Array.isArray(value) ? value : [];
}
