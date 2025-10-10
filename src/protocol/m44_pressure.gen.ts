// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Pressure
 */
export const MT_PRESSURE = 44;

/**
 * Message type name for Pressure
 */
export const MT_PRESSURE_NAME = 'Pressure';

/**
 * Field ID constants
 */
export const MD_PRESSURE_PRESSURE = 1;

/**
 * Data interface for Pressure message
 */
export interface PressureData {
  /** Pressure in millibar / hectopascals [hPa] */
  pressure?: number;
}

/**
 * Pressure
 * Pressure information
 * Group: info
 */
export class Pressure extends ProtocolMessage {
  readonly messageType = MT_PRESSURE;
  readonly messageTypeName = MT_PRESSURE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Pressure {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_PRESSURE) {
      throw new Error(`Expected message type ${MT_PRESSURE}, got ${raw.messageType}`);
    }
    return new Pressure(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: PressureData, header?: HeaderData): Pressure {
    const messageData: MessageData = {};

    if (data.pressure !== undefined) {
      messageData[MD_PRESSURE_PRESSURE] = writeTypedData(data.pressure, 'float32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_PRESSURE,
      messageTypeName: MT_PRESSURE_NAME,
      header: header || {},
      data: messageData,
    };

    return new Pressure(raw);
  }

  /**
   * Pressure in millibar / hectopascals
   * Unit: hPa
   */
  get pressure(): number | undefined {
    const raw = this.rawMessage.data[MD_PRESSURE_PRESSURE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32');
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
  toObject(): PressureData {
    return {
      pressure: this.pressure,
    };
  }
}
