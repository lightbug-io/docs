// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Charger Settings
 */
export const MT_CHARGER_SETTINGS = 54;

/**
 * Message type name for Charger Settings
 */
export const MT_CHARGER_SETTINGS_NAME = 'Charger Settings';

/**
 * Field ID constants
 */
export const MD_CHARGER_SETTINGS_INPUT_CURRENT_LIMIT = 1;
export const MD_CHARGER_SETTINGS_CHARGE_CURRENT_LIMIT = 2;
export const MD_CHARGER_SETTINGS_CHARGE_TERMINATION_VOLGATE = 3;

/**
 * Data interface for Charger Settings message
 */
export interface ChargerSettingsData {
  /** Maximum power draw allowed from Vin. Typically higher than Charge Current Limit (additional current is used to power device operation whilst charging) [mA] */
  input_current_limit?: number;
  /** Maximum charge rate for the battery. Recommended value is 0.5C (where C is the battery capacity) [mA] */
  charge_current_limit?: number;
  /** Target charge voltage for the battery. Typically 4.25V for lithium ion batteries. [mV] */
  charge_termination_volgate?: number;
}

/**
 * Charger Settings
 * For products with configurable charge settings (notably NOT Vehicle RTK), get and define charging parameters
 * Group: location
 */
export class ChargerSettings extends ProtocolMessage {
  readonly messageType = MT_CHARGER_SETTINGS;
  readonly messageTypeName = MT_CHARGER_SETTINGS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): ChargerSettings {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_CHARGER_SETTINGS) {
      throw new Error(`Expected message type ${MT_CHARGER_SETTINGS}, got ${raw.messageType}`);
    }
    return new ChargerSettings(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ChargerSettingsData, header?: HeaderData): ChargerSettings {
    const messageData: MessageData = {};

    if (data.input_current_limit !== undefined) {
      messageData[MD_CHARGER_SETTINGS_INPUT_CURRENT_LIMIT] = writeTypedData(data.input_current_limit, 'uint16');
    }

    if (data.charge_current_limit !== undefined) {
      messageData[MD_CHARGER_SETTINGS_CHARGE_CURRENT_LIMIT] = writeTypedData(data.charge_current_limit, 'uint16');
    }

    if (data.charge_termination_volgate !== undefined) {
      messageData[MD_CHARGER_SETTINGS_CHARGE_TERMINATION_VOLGATE] = writeTypedData(data.charge_termination_volgate, 'uint16');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_CHARGER_SETTINGS,
      messageTypeName: MT_CHARGER_SETTINGS_NAME,
      header: header || {},
      data: messageData,
    };

    return new ChargerSettings(raw);
  }

  /**
   * Maximum power draw allowed from Vin. Typically higher than Charge Current Limit (additional current is used to power device operation whilst charging)
   * Unit: mA
   */
  get input_current_limit(): number | undefined {
    const raw = this.rawMessage.data[MD_CHARGER_SETTINGS_INPUT_CURRENT_LIMIT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Maximum charge rate for the battery. Recommended value is 0.5C (where C is the battery capacity)
   * Unit: mA
   */
  get charge_current_limit(): number | undefined {
    const raw = this.rawMessage.data[MD_CHARGER_SETTINGS_CHARGE_CURRENT_LIMIT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Target charge voltage for the battery. Typically 4.25V for lithium ion batteries.
   * Unit: mV
   */
  get charge_termination_volgate(): number | undefined {
    const raw = this.rawMessage.data[MD_CHARGER_SETTINGS_CHARGE_TERMINATION_VOLGATE];
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
  toObject(): ChargerSettingsData {
    return {
      input_current_limit: this.input_current_limit,
      charge_current_limit: this.charge_current_limit,
      charge_termination_volgate: this.charge_termination_volgate,
    };
  }
}
