// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Open
 */
export const MT_OPEN = 11;

/**
 * Message type name for Open
 */
export const MT_OPEN_NAME = 'Open';

/**
 * Field ID constants
 */
export const MD_OPEN_DEVICE_TYPE = 10;

/**
 * Data interface for Open message
 */
export interface OpenData {
  /** Type of device, relates to the SN prefix */
  device_type?: number;
}

/**
 * Open
 * Explicit indicator for the start of a connection
 * Group: general
 */
export class Open extends ProtocolMessage {
  readonly messageType = MT_OPEN;
  readonly messageTypeName = MT_OPEN_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Open {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_OPEN) {
      throw new Error(`Expected message type ${MT_OPEN}, got ${raw.messageType}`);
    }
    return new Open(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: OpenData, header?: HeaderData): Open {
    const messageData: MessageData = {};

    if (data.device_type !== undefined) {
      messageData[MD_OPEN_DEVICE_TYPE] = writeTypedData(data.device_type, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_OPEN,
      messageTypeName: MT_OPEN_NAME,
      header: header || {},
      data: messageData,
    };

    return new Open(raw);
  }

  /**
   * Type of device, relates to the SN prefix
   */
  get device_type(): number | undefined {
    const raw = this.rawMessage.data[MD_OPEN_DEVICE_TYPE];
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
  toObject(): OpenData {
    return {
      device_type: this.device_type,
    };
  }
}
