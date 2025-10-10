// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Config
 */
export const MT_CONFIG = 14;

/**
 * Message type name for Config
 */
export const MT_CONFIG_NAME = 'Config';

/**
 * Field ID constants
 */
export const MD_CONFIG_KEY = 7;
export const MD_CONFIG_PAYLOAD = 9;

/**
 * Payload values
 */
export enum Config_Payload {
  RTKMINUSABLESATDB = 19,
  RTKMINELEVATION = 20
}

export const Config_PayloadNames: Record<number, string> = {
  19: 'RtkMinUsableSatDb',
  20: 'RtkMinElevation'
};

/**
 * Data interface for Config message
 */
export interface ConfigData {
  key?: number;
  /** Payload for the config */
  payload?: number[];
}

/**
 * Config
 * Group: ungrouped
 */
export class Config extends ProtocolMessage {
  readonly messageType = MT_CONFIG;
  readonly messageTypeName = MT_CONFIG_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Config {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CONFIG) {
      throw new Error(`Expected message type ${MT_CONFIG}, got ${raw.messageType}`);
    }
    return new Config(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ConfigData, header?: HeaderData): Config {
    const messageData: MessageData = {};

    if (data.key !== undefined) {
      messageData[MD_CONFIG_KEY] = writeTypedData(data.key, 'uint16');
    }

    if (data.payload !== undefined) {
      messageData[MD_CONFIG_PAYLOAD] = writeTypedData(data.payload, 'bytes');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CONFIG,
      messageTypeName: MT_CONFIG_NAME,
      header: header || {},
      data: messageData,
    };

    return new Config(raw);
  }

  /**
   * Get Key
   */
  get key(): number | undefined {
    const raw = this.rawMessage.data[MD_CONFIG_KEY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Payload for the config
   */
  get payload(): string | undefined {
    const raw = this.rawMessage.data[MD_CONFIG_PAYLOAD];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return Config_PayloadNames[value] || 'unknown';
  }

  /**
   * Get Payload (raw enum value)
   */
  get payloadRaw(): Config_Payload | undefined {
    const raw = this.rawMessage.data[MD_CONFIG_PAYLOAD];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
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
  toObject(): ConfigData {
    return {
      key: this.key,
      payload: this.payloadRaw,
    };
  }
}
