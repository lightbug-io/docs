// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for ACK
 */
export const MT_ACK = 5;

/**
 * Message type name for ACK
 */
export const MT_ACK_NAME = 'ACK';

/**
 * Field ID constants
 */
export const MD_ACK_ACK_TYPE = 1;

/**
 * Data interface for ACK message
 */
export interface ACKData {
  /** Type of previous message being ACKed */
  ack_type?: number;
}

/**
 * ACK
 * Used to acknowledge a previously sent message.

Empty ACKs are useless and should not be sent.
Either the Response Message ID field, or the ACK Type field should be populated.
Multiple fields can be populated if desired.
The Header status field can be used to indicate OK, or an error condition.

In the case that a response is being sent immediately, an ACK is not required.
But the response should contain the Response Message ID header field.

If a sender does not receive an ACK or response, it may resend the message.

ACKs should not themselves be ACKed.

 * Group: general
 */
export class ACK extends ProtocolMessage {
  readonly messageType = MT_ACK;
  readonly messageTypeName = MT_ACK_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): ACK {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_ACK) {
      throw new Error(`Expected message type ${MT_ACK}, got ${raw.messageType}`);
    }
    return new ACK(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ACKData, header?: HeaderData): ACK {
    const messageData: MessageData = {};

    if (data.ack_type !== undefined) {
      messageData[MD_ACK_ACK_TYPE] = writeTypedData(data.ack_type, 'uint16');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_ACK,
      messageTypeName: MT_ACK_NAME,
      header: header || {},
      data: messageData,
    };

    return new ACK(raw);
  }

  /**
   * Type of previous message being ACKed
   */
  get ack_type(): number | undefined {
    const raw = this.rawMessage.data[MD_ACK_ACK_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
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
  toObject(): ACKData {
    return {
      ack_type: this.ack_type,
    };
  }
}
