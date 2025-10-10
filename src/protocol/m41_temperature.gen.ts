// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Temperature
 */
export const MT_TEMPERATURE = 41;

/**
 * Message type name for Temperature
 */
export const MT_TEMPERATURE_NAME = 'Temperature';

/**
 * Field ID constants
 */
export const MD_TEMPERATURE_TEMPERATURE = 1;

/**
 * Data interface for Temperature message
 */
export interface TemperatureData {
  /** Temperature in Celsius [C] */
  temperature?: number;
}

/**
 * Temperature
 * Temperature information
 * Group: info
 */
export class Temperature extends ProtocolMessage {
  readonly messageType = MT_TEMPERATURE;
  readonly messageTypeName = MT_TEMPERATURE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Temperature {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_TEMPERATURE) {
      throw new Error(`Expected message type ${MT_TEMPERATURE}, got ${raw.messageType}`);
    }
    return new Temperature(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: TemperatureData, header?: HeaderData): Temperature {
    const messageData: MessageData = {};

    if (data.temperature !== undefined) {
      messageData[MD_TEMPERATURE_TEMPERATURE] = writeTypedData(data.temperature, 'float32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_TEMPERATURE,
      messageTypeName: MT_TEMPERATURE_NAME,
      header: header || {},
      data: messageData,
    };

    return new Temperature(raw);
  }

  /**
   * Temperature in Celsius
   * Unit: C
   */
  get temperature(): number | undefined {
    const raw = this.rawMessage.data[MD_TEMPERATURE_TEMPERATURE];
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
  toObject(): TemperatureData {
    return {
      temperature: this.temperature,
    };
  }
}
