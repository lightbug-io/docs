// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Heartbeat
 */
export const MT_HEARTBEAT = 13;

/**
 * Message type name for Heartbeat
 */
export const MT_HEARTBEAT_NAME = 'Heartbeat';

/**
 * Field ID constants
 */
export const MD_HEARTBEAT_BATTERY_PERCENT = 6;

/**
 * Data interface for Heartbeat message
 */
export interface HeartbeatData {
  /** Devices send battery percentage in heartbeats */
  battery_percent?: number;
}

/**
 * Heartbeat
 * A message sent to let the receiver know the sender is still active/alive.
Can also be used to check if a connection is still active, as the message should be ACKed.

Devices currently default to sending a heartbeat every 15 seconds on open links.
Arbitrary fields can be added in fields payload 200+

 * Group: general
 */
export class Heartbeat extends ProtocolMessage {
  readonly messageType = MT_HEARTBEAT;
  readonly messageTypeName = MT_HEARTBEAT_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Heartbeat {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_HEARTBEAT) {
      throw new Error(`Expected message type ${MT_HEARTBEAT}, got ${raw.messageType}`);
    }
    return new Heartbeat(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: HeartbeatData, header?: HeaderData): Heartbeat {
    const messageData: MessageData = {};

    if (data.battery_percent !== undefined) {
      messageData[MD_HEARTBEAT_BATTERY_PERCENT] = writeTypedData(data.battery_percent, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_HEARTBEAT,
      messageTypeName: MT_HEARTBEAT_NAME,
      header: header || {},
      data: messageData,
    };

    return new Heartbeat(raw);
  }

  /**
   * Devices send battery percentage in heartbeats
   */
  get battery_percent(): number | undefined {
    const raw = this.rawMessage.data[MD_HEARTBEAT_BATTERY_PERCENT];
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
  toObject(): HeartbeatData {
    return {
      battery_percent: this.battery_percent,
    };
  }
}
