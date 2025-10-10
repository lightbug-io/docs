// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Device Status
 */
export const MT_DEVICE_STATUS = 34;

/**
 * Message type name for Device Status
 */
export const MT_DEVICE_STATUS_NAME = 'Device Status';

/**
 * Field ID constants
 */
export const MD_DEVICE_STATUS_BATTERY = 1;
export const MD_DEVICE_STATUS_SIGNAL_STRENGTH = 2;
export const MD_DEVICE_STATUS_MODE = 3;
export const MD_DEVICE_STATUS_NETWORK_TYPE = 4;
export const MD_DEVICE_STATUS_NETWORK_MNC = 5;
export const MD_DEVICE_STATUS_NETWORK_MCC = 6;
export const MD_DEVICE_STATUS_FIRMWARE_VERSION = 7;
export const MD_DEVICE_STATUS_DEVICE_TYPE = 10;

/**
 * Mode values
 */
export enum DeviceStatus_Mode {
  SLEEP = 0,
  AWAKE = 1
}

export const DeviceStatus_ModeNames: Record<number, string> = {
  0: 'Sleep',
  1: 'Awake'
};

/**
 * Network type values
 */
export enum DeviceStatus_Networktype {
  NO_NETWORK = 0,
  GSM = 2,
  WCDMA = 3,
  LTE = 4
}

export const DeviceStatus_NetworktypeNames: Record<number, string> = {
  0: 'No network',
  2: 'GSM (2G)',
  3: 'WCDMA (3G)',
  4: 'LTE (4G)'
};

/**
 * Data interface for Device Status message
 */
export interface DeviceStatusData {
  /** Battery level [%] */
  battery?: number;
  /** Signal strength [%] */
  signal_strength?: number;
  /** Device mode */
  mode?: number;
  network_type?: number;
  network_mnc?: number;
  network_mcc?: number;
  firmware_version?: number;
  /** Type of device, relates to the SN prefix */
  device_type?: number;
}

/**
 * Device Status
 * Used to GET the general status of the device.

 * Group: info
 */
export class DeviceStatus extends ProtocolMessage {
  readonly messageType = MT_DEVICE_STATUS;
  readonly messageTypeName = MT_DEVICE_STATUS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): DeviceStatus {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_DEVICE_STATUS) {
      throw new Error(`Expected message type ${MT_DEVICE_STATUS}, got ${raw.messageType}`);
    }
    return new DeviceStatus(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: DeviceStatusData, header?: HeaderData): DeviceStatus {
    const messageData: MessageData = {};

    if (data.battery !== undefined) {
      messageData[MD_DEVICE_STATUS_BATTERY] = writeTypedData(data.battery, 'uint8');
    }

    if (data.signal_strength !== undefined) {
      messageData[MD_DEVICE_STATUS_SIGNAL_STRENGTH] = writeTypedData(data.signal_strength, 'uint8');
    }

    if (data.mode !== undefined) {
      messageData[MD_DEVICE_STATUS_MODE] = writeTypedData(data.mode, 'uint8');
    }

    if (data.network_type !== undefined) {
      messageData[MD_DEVICE_STATUS_NETWORK_TYPE] = writeTypedData(data.network_type, 'uint8');
    }

    if (data.network_mnc !== undefined) {
      messageData[MD_DEVICE_STATUS_NETWORK_MNC] = writeTypedData(data.network_mnc, 'uint16');
    }

    if (data.network_mcc !== undefined) {
      messageData[MD_DEVICE_STATUS_NETWORK_MCC] = writeTypedData(data.network_mcc, 'uint16');
    }

    if (data.firmware_version !== undefined) {
      messageData[MD_DEVICE_STATUS_FIRMWARE_VERSION] = writeTypedData(data.firmware_version, 'uint32');
    }

    if (data.device_type !== undefined) {
      messageData[MD_DEVICE_STATUS_DEVICE_TYPE] = writeTypedData(data.device_type, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_DEVICE_STATUS,
      messageTypeName: MT_DEVICE_STATUS_NAME,
      header: header || {},
      data: messageData,
    };

    return new DeviceStatus(raw);
  }

  /**
   * Battery level
   * Unit: %
   */
  get battery(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_BATTERY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Signal strength
   * Unit: %
   */
  get signal_strength(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_SIGNAL_STRENGTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Device mode
   */
  get mode(): string | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_MODE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DeviceStatus_ModeNames[value] || 'unknown';
  }

  /**
   * Get Mode (raw enum value)
   */
  get modeRaw(): DeviceStatus_Mode | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_MODE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Get Network type
   */
  get network_type(): string | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_NETWORK_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DeviceStatus_NetworktypeNames[value] || 'unknown';
  }

  /**
   * Get Network type (raw enum value)
   */
  get network_typeRaw(): DeviceStatus_Networktype | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_NETWORK_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Get Network MNC
   */
  get network_mnc(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_NETWORK_MNC];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Get Network MCC
   */
  get network_mcc(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_NETWORK_MCC];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Get Firmware Version
   */
  get firmware_version(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_FIRMWARE_VERSION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Type of device, relates to the SN prefix
   */
  get device_type(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_STATUS_DEVICE_TYPE];
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
  toObject(): DeviceStatusData {
    return {
      battery: this.battery,
      signal_strength: this.signal_strength,
      mode: this.modeRaw,
      network_type: this.network_typeRaw,
      network_mnc: this.network_mnc,
      network_mcc: this.network_mcc,
      firmware_version: this.firmware_version,
      device_type: this.device_type,
    };
  }
}
