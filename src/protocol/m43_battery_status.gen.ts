// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Battery Status
 */
export const MT_BATTERY_STATUS = 43;

/**
 * Message type name for Battery Status
 */
export const MT_BATTERY_STATUS_NAME = 'Battery Status';

/**
 * Field ID constants
 */
export const MD_BATTERY_STATUS_VOLTAGE = 1;
export const MD_BATTERY_STATUS_PERCENT = 2;

/**
 * Data interface for Battery Status message
 */
export interface BatteryStatusData {
  /** Current battery voltage [V] */
  voltage?: number;
  /** Current battery percent [%] */
  percent?: number;
}

/**
 * Battery Status
 * Get the battery status of a device

 * Group: info
 */
export class BatteryStatus extends ProtocolMessage {
  readonly messageType = MT_BATTERY_STATUS;
  readonly messageTypeName = MT_BATTERY_STATUS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): BatteryStatus {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BATTERY_STATUS) {
      throw new Error(`Expected message type ${MT_BATTERY_STATUS}, got ${raw.messageType}`);
    }
    return new BatteryStatus(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: BatteryStatusData, header?: HeaderData): BatteryStatus {
    const messageData: MessageData = {};

    if (data.voltage !== undefined) {
      messageData[MD_BATTERY_STATUS_VOLTAGE] = writeTypedData(data.voltage, 'float32');
    }

    if (data.percent !== undefined) {
      messageData[MD_BATTERY_STATUS_PERCENT] = writeTypedData(data.percent, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BATTERY_STATUS,
      messageTypeName: MT_BATTERY_STATUS_NAME,
      header: header || {},
      data: messageData,
    };

    return new BatteryStatus(raw);
  }

  /**
   * Current battery voltage
   * Unit: V
   */
  get voltage(): number | undefined {
    const raw = this.rawMessage.data[MD_BATTERY_STATUS_VOLTAGE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32');
    return value !== null ? value : undefined;
  }

  /**
   * Current battery percent
   * Unit: %
   */
  get percent(): number | undefined {
    const raw = this.rawMessage.data[MD_BATTERY_STATUS_PERCENT];
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
  toObject(): BatteryStatusData {
    return {
      voltage: this.voltage,
      percent: this.percent,
    };
  }
}
