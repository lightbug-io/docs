// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Transmit Now
 */
export const MT_TRANSMIT_NOW = 30;

/**
 * Message type name for Transmit Now
 */
export const MT_TRANSMIT_NOW_NAME = 'Transmit Now';

/**
 * Field ID constants
 */
export const MD_TRANSMIT_NOW_GPS_SEARCH = 1;
export const MD_TRANSMIT_NOW_PAYLOAD = 2;
export const MD_TRANSMIT_NOW_RETRIES = 3;
export const MD_TRANSMIT_NOW_PRIORITY = 4;

/**
 * Data interface for Transmit Now message
 */
export interface TransmitNowData {
  /** 0 = no gps fix required
1 = wait for GPS lock (or timeout) before send
 */
  gps_search?: boolean;
  /** Data to send, can be up to 200 bytes */
  payload?: number[];
  /** Number of retries [0-10]. Exponential backoff (10 = 25h) */
  retries?: number;
  /** 0 - 1 */
  priority?: number;
}

/**
 * Transmit Now
 * Send arbitrary data over GSM to the Lightbug cloud as a sensorReading of type `uart_blob`.

The message will initially be ACKed indicating the device has received the message.
When the data is sent to the cloud, or the send fails, a response will be sent with the status 1 (OK), 2 (NOT OK).

 * Group: gsm
 */
export class TransmitNow extends ProtocolMessage {
  readonly messageType = MT_TRANSMIT_NOW;
  readonly messageTypeName = MT_TRANSMIT_NOW_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): TransmitNow {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_TRANSMIT_NOW) {
      throw new Error(`Expected message type ${MT_TRANSMIT_NOW}, got ${raw.messageType}`);
    }
    return new TransmitNow(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: TransmitNowData, header?: HeaderData): TransmitNow {
    const messageData: MessageData = {};

    if (data.gps_search !== undefined) {
      messageData[MD_TRANSMIT_NOW_GPS_SEARCH] = writeTypedData(data.gps_search, 'bool');
    }

    if (data.payload !== undefined) {
      messageData[MD_TRANSMIT_NOW_PAYLOAD] = writeTypedData(data.payload, 'bytes');
    }

    if (data.retries !== undefined) {
      messageData[MD_TRANSMIT_NOW_RETRIES] = writeTypedData(data.retries, 'uint8');
    }

    if (data.priority !== undefined) {
      messageData[MD_TRANSMIT_NOW_PRIORITY] = writeTypedData(data.priority, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_TRANSMIT_NOW,
      messageTypeName: MT_TRANSMIT_NOW_NAME,
      header: header || {},
      data: messageData,
    };

    return new TransmitNow(raw);
  }

  /**
   * 0 = no gps fix required
1 = wait for GPS lock (or timeout) before send

   */
  get gps_search(): boolean | undefined {
    const raw = this.rawMessage.data[MD_TRANSMIT_NOW_GPS_SEARCH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Data to send, can be up to 200 bytes
   */
  get payload(): number[] | undefined {
    const raw = this.rawMessage.data[MD_TRANSMIT_NOW_PAYLOAD];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Number of retries [0-10]. Exponential backoff (10 = 25h)
   */
  get retries(): number | undefined {
    const raw = this.rawMessage.data[MD_TRANSMIT_NOW_RETRIES];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * 0 - 1
   */
  get priority(): number | undefined {
    const raw = this.rawMessage.data[MD_TRANSMIT_NOW_PRIORITY];
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
  toObject(): TransmitNowData {
    return {
      gps_search: this.gps_search,
      payload: this.payload,
      retries: this.retries,
      priority: this.priority,
    };
  }
}
