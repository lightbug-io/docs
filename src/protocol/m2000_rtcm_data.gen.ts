// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for RTCM Data
 */
export const MT_RTCM_DATA = 2000;

/**
 * Message type name for RTCM Data
 */
export const MT_RTCM_DATA_NAME = 'RTCM Data';

/**
 * Field ID constants
 */
export const MD_RTCM_DATA_DATA = 1;

/**
 * Data interface for RTCM Data message
 */
export interface RTCMDataData {
  /** RTCM v3 message data as complete frames (including D3 header, length, payload, and CRC) or raw payload bytes. Can be chunked and split across multiple fields in a message with incrementing field numbers. */
  data?: number[];
}

/**
 * RTCM Data
 * Data relating to RTCM (Radio Technical Commission for Maritime Services) correction data for high-precision GNSS positioning.
 * Group:
 */
export class RTCMData extends ProtocolMessage {
  readonly messageType = MT_RTCM_DATA;
  readonly messageTypeName = MT_RTCM_DATA_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): RTCMData {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_RTCM_DATA) {
      throw new Error(`Expected message type ${MT_RTCM_DATA}, got ${raw.messageType}`);
    }
    return new RTCMData(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: RTCMDataData, header?: HeaderData): RTCMData {
    const messageData: MessageData = {};

    if (data.data !== undefined) {
      messageData[MD_RTCM_DATA_DATA] = writeTypedData(data.data, 'bytes');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_RTCM_DATA,
      messageTypeName: MT_RTCM_DATA_NAME,
      header: header || {},
      data: messageData,
    };

    return new RTCMData(raw);
  }

  /**
   * RTCM v3 message data as complete frames (including D3 header, length, payload, and CRC) or raw payload bytes. Can be chunked and split across multiple fields in a message with incrementing field numbers.
   */
  get data(): number[] | undefined {
    const raw = this.rawMessage.data[MD_RTCM_DATA_DATA];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
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
  toObject(): RTCMDataData {
    return {
      data: this.data,
    };
  }
}
