// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Protection Level
 */
export const MT_PROTECTION_LEVEL = 53;

/**
 * Message type name for Protection Level
 */
export const MT_PROTECTION_LEVEL_NAME = 'Protection Level';

/**
 * Field ID constants
 */
export const MD_PROTECTION_LEVEL_VALID = 1;
export const MD_PROTECTION_LEVEL_LATITUDE = 2;
export const MD_PROTECTION_LEVEL_LONGITUDE = 3;
export const MD_PROTECTION_LEVEL_ALTITUDE = 4;

/**
 * Data interface for Protection Level message
 */
export interface ProtectionLevelData {
  /** Indicates if the protection level data is valid */
  valid?: number;
  /** Protection level in the Lat direction (North South) [mm] */
  latitude?: number;
  /** Protection level in the Lon direction (East West) [mm] */
  longitude?: number;
  /** Protection level in the Z direction [mm] */
  altitude?: number;
}

/**
 * Protection Level
 * Get information about the protection level - i.e. 95% confidence accuracy ellipse. Only supported on RTK enabled products.
Used to retrieve ublox protection level information, on devices that have it.

 * Group: location
 */
export class ProtectionLevel extends ProtocolMessage {
  readonly messageType = MT_PROTECTION_LEVEL;
  readonly messageTypeName = MT_PROTECTION_LEVEL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): ProtectionLevel {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_PROTECTION_LEVEL) {
      throw new Error(`Expected message type ${MT_PROTECTION_LEVEL}, got ${raw.messageType}`);
    }
    return new ProtectionLevel(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ProtectionLevelData, header?: HeaderData): ProtectionLevel {
    const messageData: MessageData = {};

    if (data.valid !== undefined) {
      messageData[MD_PROTECTION_LEVEL_VALID] = writeTypedData(data.valid, 'uint8');
    }

    if (data.latitude !== undefined) {
      messageData[MD_PROTECTION_LEVEL_LATITUDE] = writeTypedData(data.latitude, 'uint32');
    }

    if (data.longitude !== undefined) {
      messageData[MD_PROTECTION_LEVEL_LONGITUDE] = writeTypedData(data.longitude, 'uint32');
    }

    if (data.altitude !== undefined) {
      messageData[MD_PROTECTION_LEVEL_ALTITUDE] = writeTypedData(data.altitude, 'uint32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_PROTECTION_LEVEL,
      messageTypeName: MT_PROTECTION_LEVEL_NAME,
      header: header || {},
      data: messageData,
    };

    return new ProtectionLevel(raw);
  }

  /**
   * Indicates if the protection level data is valid
   */
  get valid(): number | undefined {
    const raw = this.rawMessage.data[MD_PROTECTION_LEVEL_VALID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Protection level in the Lat direction (North South)
   * Unit: mm
   */
  get latitude(): number | undefined {
    const raw = this.rawMessage.data[MD_PROTECTION_LEVEL_LATITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Protection level in the Lon direction (East West)
   * Unit: mm
   */
  get longitude(): number | undefined {
    const raw = this.rawMessage.data[MD_PROTECTION_LEVEL_LONGITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Protection level in the Z direction
   * Unit: mm
   */
  get altitude(): number | undefined {
    const raw = this.rawMessage.data[MD_PROTECTION_LEVEL_ALTITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Convert message to byte array
   */
  toBytes(includePrefix = false): number[] {
    return messageToBytesHelper({
      messageType: this.messageType,
      header: this.rawMessage.header,
      data: this.rawMessage.data,
      includePrefix,
    });
  }

  /**
   * Convert message to plain object
   */
  toObject(): ProtectionLevelData {
    return {
      valid: this.valid,
      latitude: this.latitude,
      longitude: this.longitude,
      altitude: this.altitude,
    };
  }
}
