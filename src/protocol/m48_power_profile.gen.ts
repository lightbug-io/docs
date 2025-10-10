// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Power Profile
 */
export const MT_POWER_PROFILE = 48;

/**
 * Message type name for Power Profile
 */
export const MT_POWER_PROFILE_NAME = 'Power Profile';

/**
 * Field ID constants
 */
export const MD_POWER_PROFILE_TOTAL_POWER = 3;
export const MD_POWER_PROFILE_CURRENT = 4;

/**
 * Data interface for Power Profile message
 */
export interface PowerProfileData {
  /** Total power used in mAH since the subscription was started (or the device was turned on, if only using GET) [mAh] */
  total_power?: number;
  /** Instantaneous Current power usage [mA] */
  current?: number;
}

/**
 * Power Profile
 * See how much power is being used by the device. Total power is reset to zero when a new subscription is requested.
 * Group: ungrouped
 */
export class PowerProfile extends ProtocolMessage {
  readonly messageType = MT_POWER_PROFILE;
  readonly messageTypeName = MT_POWER_PROFILE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): PowerProfile {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_POWER_PROFILE) {
      throw new Error(`Expected message type ${MT_POWER_PROFILE}, got ${raw.messageType}`);
    }
    return new PowerProfile(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: PowerProfileData, header?: HeaderData): PowerProfile {
    const messageData: MessageData = {};

    if (data.total_power !== undefined) {
      messageData[MD_POWER_PROFILE_TOTAL_POWER] = writeTypedData(data.total_power, 'float32');
    }

    if (data.current !== undefined) {
      messageData[MD_POWER_PROFILE_CURRENT] = writeTypedData(data.current, 'float32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_POWER_PROFILE,
      messageTypeName: MT_POWER_PROFILE_NAME,
      header: header || {},
      data: messageData,
    };

    return new PowerProfile(raw);
  }

  /**
   * Total power used in mAH since the subscription was started (or the device was turned on, if only using GET)
   * Unit: mAh
   */
  get total_power(): number | undefined {
    const raw = this.rawMessage.data[MD_POWER_PROFILE_TOTAL_POWER];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32');
    return value !== null ? value : undefined;
  }

  /**
   * Instantaneous Current power usage
   * Unit: mA
   */
  get current(): number | undefined {
    const raw = this.rawMessage.data[MD_POWER_PROFILE_CURRENT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32');
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
  toObject(): PowerProfileData {
    return {
      total_power: this.total_power,
      current: this.current,
    };
  }
}
