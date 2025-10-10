// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Change SIM settings
 */
export const MT_CHANGE_SIM_SETTINGS = 33;

/**
 * Message type name for Change SIM settings
 */
export const MT_CHANGE_SIM_SETTINGS_NAME = 'Change SIM settings';

/**
 * Field ID constants
 */
export const MD_CHANGE_SIM_SETTINGS_ACTIVE_SIM = 1;
export const MD_CHANGE_SIM_SETTINGS_SIM2_APN = 2;
export const MD_CHANGE_SIM_SETTINGS_SIM2_APN_USERNAME = 3;
export const MD_CHANGE_SIM_SETTINGS_SIM2_APN_PASSWORD = 4;
export const MD_CHANGE_SIM_SETTINGS_SIM2_ICCID = 8;

/**
 * Active SIM values
 */
export enum ChangeSIMsettings_ActiveSIM {
  SIM1 = 0,
  SIM2 = 1
}

export const ChangeSIMsettings_ActiveSIMNames: Record<number, string> = {
  0: 'SIM1',
  1: 'SIM2'
};

/**
 * Data interface for Change SIM settings message
 */
export interface ChangeSIMsettingsData {
  /** Activate the specified SIM */
  active_sim?: number;
  sim2_apn?: string;
  sim2_apn_username?: string;
  sim2_apn_password?: string;
  sim2_iccid?: boolean;
}

/**
 * Change SIM settings
 * For devices that have dual-sim functionality, control which SIM is active and set APN parameters for SIM2
 * Group: gsm
 */
export class ChangeSIMsettings extends ProtocolMessage {
  readonly messageType = MT_CHANGE_SIM_SETTINGS;
  readonly messageTypeName = MT_CHANGE_SIM_SETTINGS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): ChangeSIMsettings {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CHANGE_SIM_SETTINGS) {
      throw new Error(`Expected message type ${MT_CHANGE_SIM_SETTINGS}, got ${raw.messageType}`);
    }
    return new ChangeSIMsettings(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ChangeSIMsettingsData, header?: HeaderData): ChangeSIMsettings {
    const messageData: MessageData = {};

    if (data.active_sim !== undefined) {
      messageData[MD_CHANGE_SIM_SETTINGS_ACTIVE_SIM] = writeTypedData(data.active_sim, 'uint32');
    }

    if (data.sim2_apn !== undefined) {
      messageData[MD_CHANGE_SIM_SETTINGS_SIM2_APN] = writeTypedData(data.sim2_apn, 'ascii');
    }

    if (data.sim2_apn_username !== undefined) {
      messageData[MD_CHANGE_SIM_SETTINGS_SIM2_APN_USERNAME] = writeTypedData(data.sim2_apn_username, 'ascii');
    }

    if (data.sim2_apn_password !== undefined) {
      messageData[MD_CHANGE_SIM_SETTINGS_SIM2_APN_PASSWORD] = writeTypedData(data.sim2_apn_password, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CHANGE_SIM_SETTINGS,
      messageTypeName: MT_CHANGE_SIM_SETTINGS_NAME,
      header: header || {},
      data: messageData,
    };

    return new ChangeSIMsettings(raw);
  }

  /**
   * Activate the specified SIM
   */
  get active_sim(): string | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_ACTIVE_SIM];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return ChangeSIMsettings_ActiveSIMNames[value] || 'unknown';
  }

  /**
   * Get Active SIM (raw enum value)
   */
  get active_simRaw(): ChangeSIMsettings_ActiveSIM | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_ACTIVE_SIM];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Get SIM2 APN
   */
  get sim2_apn(): string | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_SIM2_APN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get SIM2 APN Username
   */
  get sim2_apn_username(): string | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_SIM2_APN_USERNAME];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get SIM2 APN Password
   */
  get sim2_apn_password(): string | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_SIM2_APN_PASSWORD];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get SIM2 ICCID
   */
  get sim2_iccid(): boolean | undefined {
    const raw = this.rawMessage.data[MD_CHANGE_SIM_SETTINGS_SIM2_ICCID];
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
  toObject(): ChangeSIMsettingsData {
    return {
      active_sim: this.active_simRaw,
      sim2_apn: this.sim2_apn,
      sim2_apn_username: this.sim2_apn_username,
      sim2_apn_password: this.sim2_apn_password,
      sim2_iccid: this.sim2_iccid,
    };
  }
}
