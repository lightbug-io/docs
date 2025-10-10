// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for CPU1 Reset
 */
export const MT_CPU1_RESET = 49;

/**
 * Message type name for CPU1 Reset
 */
export const MT_CPU1_RESET_NAME = 'CPU1 Reset';

/**
 * Data interface for CPU1 Reset message
 */
export interface CPU1ResetData {
}

/**
 * CPU1 Reset
 * Group: ungrouped
 */
export class CPU1Reset extends ProtocolMessage {
  readonly messageType = MT_CPU1_RESET;
  readonly messageTypeName = MT_CPU1_RESET_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): CPU1Reset {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CPU1_RESET) {
      throw new Error(`Expected message type ${MT_CPU1_RESET}, got ${raw.messageType}`);
    }
    return new CPU1Reset(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: CPU1ResetData, header?: HeaderData): CPU1Reset {
    const messageData: MessageData = {};

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CPU1_RESET,
      messageTypeName: MT_CPU1_RESET_NAME,
      header: header || {},
      data: messageData,
    };

    return new CPU1Reset(raw);
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
  toObject(): CPU1ResetData {
    return {
    };
  }
}
