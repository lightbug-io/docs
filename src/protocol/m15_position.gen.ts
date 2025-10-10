// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Position
 */
export const MT_POSITION = 15;

/**
 * Message type name for Position
 */
export const MT_POSITION_NAME = 'Position';

/**
 * Field ID constants
 */
export const MD_POSITION_TIMESTAMP = 1;
export const MD_POSITION_LATITUDE = 2;
export const MD_POSITION_LONGITUDE = 3;
export const MD_POSITION_ALTITUDE = 4;
export const MD_POSITION_ACCURACY = 5;
export const MD_POSITION_COURSE = 6;
export const MD_POSITION_SPEED = 7;
export const MD_POSITION_SATELLITES = 8;
export const MD_POSITION_CN0 = 9;
export const MD_POSITION_TYPE = 10;
export const MD_POSITION_SOURCE = 11;
export const MD_POSITION_CORRECTION_AGE = 12;

/**
 * Type values
 */
export enum Position_Type {
  INVALID = 0,
  FIXED = 1,
  RESERVED = 2,
  STANDALONE_3D_FIX = 3,
  RTK_FLOAT = 4,
  RTK_FIX = 5
}

export const Position_TypeNames: Record<number, string> = {
  0: 'invalid',
  1: 'fixed',
  2: 'reserved',
  3: 'standalone 3d fix',
  4: 'rtk-float',
  5: 'rtk-fix'
};

/**
 * Source values
 */
export enum Position_Source {
  GPS = 0,
  RTK = 1
}

export const Position_SourceNames: Record<number, string> = {
  0: 'gps',
  1: 'rtk'
};

/**
 * Data interface for Position message
 */
export interface PositionData {
  /** Timestamp of when the position was taken, may be invalid if the GPS has not locked in yet (Type will be set to 'invalid' in this scenario) [ms since epoch] */
  timestamp?: bigint;
  latitude?: number;
  longitude?: number;
  /** Altitude [meter] */
  altitude?: number;
  /** Accuracy [meter] */
  accuracy?: number;
  /** Course over ground [degree] */
  course?: number;
  /** Speed [km/h] */
  speed?: number;
  satellites?: number;
  /** Average CN0. Carrier to noise density. Higher is better. [dB-Hz] */
  cn0?: number;
  /** Position type */
  type?: number;
  /** Position source */
  source?: number;
  /** Age of the correction data (RTK or DGNSS) from NMEA GGA sentence [seconds] */
  correction_age?: number;
}

/**
 * Position
 * Group: location
 */
export class Position extends ProtocolMessage {
  readonly messageType = MT_POSITION;
  readonly messageTypeName = MT_POSITION_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Position {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_POSITION) {
      throw new Error(`Expected message type ${MT_POSITION}, got ${raw.messageType}`);
    }
    return new Position(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: PositionData, header?: HeaderData): Position {
    const messageData: MessageData = {};

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_POSITION,
      messageTypeName: MT_POSITION_NAME,
      header: header || {},
      data: messageData,
    };

    return new Position(raw);
  }

  /**
   * Timestamp of when the position was taken, may be invalid if the GPS has not locked in yet (Type will be set to 'invalid' in this scenario)
   * Unit: ms since epoch
   */
  get timestamp(): bigint | undefined {
    const raw = this.rawMessage.data[MD_POSITION_TIMESTAMP];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint64');
    return value !== null ? value : undefined;
  }

  /**
   * Get Latitude
   * Unit: degree
   */
  get latitude(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_LATITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value / 1e7 : undefined;
  }

  /**
   * Get Latitude (raw value before conversion)
   */
  get latitudeRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_LATITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value : undefined;
  }

  /**
   * Get Longitude
   * Unit: degree
   */
  get longitude(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_LONGITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value / 1e7 : undefined;
  }

  /**
   * Get Longitude (raw value before conversion)
   */
  get longitudeRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_LONGITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value : undefined;
  }

  /**
   * Altitude
   * Unit: meter
   */
  get altitude(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_ALTITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value / 1e3 : undefined;
  }

  /**
   * Get Altitude (raw value before conversion)
   */
  get altitudeRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_ALTITUDE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int32');
    return value !== null ? value : undefined;
  }

  /**
   * Accuracy
   * Unit: meter
   */
  get accuracy(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_ACCURACY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value / 1e2 : undefined;
  }

  /**
   * Get Accuracy (raw value before conversion)
   */
  get accuracyRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_ACCURACY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Course over ground
   * Unit: degree
   */
  get course(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_COURSE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value / 1e2 : undefined;
  }

  /**
   * Get Course (raw value before conversion)
   */
  get courseRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_COURSE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Speed
   * Unit: km/h
   */
  get speed(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_SPEED];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value / 1e2 : undefined;
  }

  /**
   * Get Speed (raw value before conversion)
   */
  get speedRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_SPEED];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Get Satellites
   * Unit: count
   */
  get satellites(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_SATELLITES];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Average CN0. Carrier to noise density. Higher is better.
   * Unit: dB-Hz
   */
  get cn0(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_CN0];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Position type
   */
  get type(): string | undefined {
    const raw = this.rawMessage.data[MD_POSITION_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return Position_TypeNames[value] || 'unknown';
  }

  /**
   * Get Type (raw enum value)
   */
  get typeRaw(): Position_Type | undefined {
    const raw = this.rawMessage.data[MD_POSITION_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Position source
   */
  get source(): string | undefined {
    const raw = this.rawMessage.data[MD_POSITION_SOURCE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return Position_SourceNames[value] || 'unknown';
  }

  /**
   * Get Source (raw enum value)
   */
  get sourceRaw(): Position_Source | undefined {
    const raw = this.rawMessage.data[MD_POSITION_SOURCE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Age of the correction data (RTK or DGNSS) from NMEA GGA sentence
   * Unit: seconds
   */
  get correction_age(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_CORRECTION_AGE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value / 10 : undefined;
  }

  /**
   * Get Correction Age (raw value before conversion)
   */
  get correction_ageRaw(): number | undefined {
    const raw = this.rawMessage.data[MD_POSITION_CORRECTION_AGE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
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
  toObject(): PositionData {
    return {
      timestamp: this.timestamp,
      latitude: this.latitude,
      longitude: this.longitude,
      altitude: this.altitude,
      accuracy: this.accuracy,
      course: this.course,
      speed: this.speed,
      satellites: this.satellites,
      cn0: this.cn0,
      type: this.typeRaw,
      source: this.sourceRaw,
      correction_age: this.correction_age,
    };
  }
}
