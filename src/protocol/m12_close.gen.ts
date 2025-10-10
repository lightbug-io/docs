// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Close
 */
export const MT_CLOSE = 12;

/**
 * Message type name for Close
 */
export const MT_CLOSE_NAME = 'Close';

/**
 * Data interface for Close message
 */
export interface CloseData {
}

/**
 * Close
 * Explicit indicator for a connection about to close. Can be used to differentiate between deliberate and accidental disconnections.
 * Group: general
 */
export class Close extends ProtocolMessage {
  readonly messageType = MT_CLOSE;
  readonly messageTypeName = MT_CLOSE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Close {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CLOSE) {
      throw new Error(`Expected message type ${MT_CLOSE}, got ${raw.messageType}`);
    }
    return new Close(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: CloseData, header?: HeaderData): Close {
    const messageData: MessageData = {};

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CLOSE,
      messageTypeName: MT_CLOSE_NAME,
      header: header || {},
      data: messageData,
    };

    return new Close(raw);
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
  toObject(): CloseData {
    return {
    };
  }
}
