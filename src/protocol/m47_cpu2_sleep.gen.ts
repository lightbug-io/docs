// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for CPU2 Sleep
 */
export const MT_CPU2_SLEEP = 47;

/**
 * Message type name for CPU2 Sleep
 */
export const MT_CPU2_SLEEP_NAME = 'CPU2 Sleep';

/**
 * Field ID constants
 */
export const MD_CPU2_SLEEP_INTERVAL = 1;
export const MD_CPU2_SLEEP_WAKE_ON_EVENT = 2;

/**
 * Data interface for CPU2 Sleep message
 */
export interface CPU2SleepData {
  /** Interval in ms to turn off the CPU2 for, before turning it back on */
  interval?: number;
  /** Should CPU1 wake up CPU2 on new events / messages */
  wake_on_event?: boolean;
}

/**
 * CPU2 Sleep
 * Request CPU2 sleep
 * Group: ungrouped
 */
export class CPU2Sleep extends ProtocolMessage {
  readonly messageType = MT_CPU2_SLEEP;
  readonly messageTypeName = MT_CPU2_SLEEP_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): CPU2Sleep {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CPU2_SLEEP) {
      throw new Error(`Expected message type ${MT_CPU2_SLEEP}, got ${raw.messageType}`);
    }
    return new CPU2Sleep(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: CPU2SleepData, header?: HeaderData): CPU2Sleep {
    const messageData: MessageData = {};

    if (data.interval !== undefined) {
      messageData[MD_CPU2_SLEEP_INTERVAL] = writeTypedData(data.interval, 'uint32');
    }

    if (data.wake_on_event !== undefined) {
      messageData[MD_CPU2_SLEEP_WAKE_ON_EVENT] = writeTypedData(data.wake_on_event, 'bool');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CPU2_SLEEP,
      messageTypeName: MT_CPU2_SLEEP_NAME,
      header: header || {},
      data: messageData,
    };

    return new CPU2Sleep(raw);
  }

  /**
   * Interval in ms to turn off the CPU2 for, before turning it back on
   */
  get interval(): number | undefined {
    const raw = this.rawMessage.data[MD_CPU2_SLEEP_INTERVAL];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Should CPU1 wake up CPU2 on new events / messages
   */
  get wake_on_event(): boolean | undefined {
    const raw = this.rawMessage.data[MD_CPU2_SLEEP_WAKE_ON_EVENT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
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
  toObject(): CPU2SleepData {
    return {
      interval: this.interval,
      wake_on_event: this.wake_on_event,
    };
  }
}
