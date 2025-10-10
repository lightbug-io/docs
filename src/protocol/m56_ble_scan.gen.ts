// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for BLE Scan
 */
export const MT_BLE_SCAN = 56;

/**
 * Message type name for BLE Scan
 */
export const MT_BLE_SCAN_NAME = 'BLE Scan';

/**
 * Field ID constants
 */
export const MD_BLE_SCAN_ADVERTISING_DATA = 1;
export const MD_BLE_SCAN_MAC = 2;
export const MD_BLE_SCAN_RSSI = 3;

/**
 * Data interface for BLE Scan message
 */
export interface BLEScanData {
  advertising_data?: number[];
  /** MAC Address of the access point, as 6 bytes */
  mac?: number[];
  /** Signal strength */
  rssi?: number;
}

/**
 * BLE Scan
 * Group: scan
 */
export class BLEScan extends ProtocolMessage {
  readonly messageType = MT_BLE_SCAN;
  readonly messageTypeName = MT_BLE_SCAN_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): BLEScan {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BLE_SCAN) {
      throw new Error(`Expected message type ${MT_BLE_SCAN}, got ${raw.messageType}`);
    }
    return new BLEScan(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: BLEScanData, header?: HeaderData): BLEScan {
    const messageData: MessageData = {};

    if (data.advertising_data !== undefined) {
      messageData[MD_BLE_SCAN_ADVERTISING_DATA] = writeTypedData(data.advertising_data, 'bytes');
    }

    if (data.mac !== undefined) {
      messageData[MD_BLE_SCAN_MAC] = writeTypedData(data.mac, 'bytes');
    }

    if (data.rssi !== undefined) {
      messageData[MD_BLE_SCAN_RSSI] = writeTypedData(data.rssi, 'int8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BLE_SCAN,
      messageTypeName: MT_BLE_SCAN_NAME,
      header: header || {},
      data: messageData,
    };

    return new BLEScan(raw);
  }

  /**
   * Get Advertising Data
   */
  get advertising_data(): number[] | undefined {
    const raw = this.rawMessage.data[MD_BLE_SCAN_ADVERTISING_DATA];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * MAC Address of the access point, as 6 bytes
   */
  get mac(): number[] | undefined {
    const raw = this.rawMessage.data[MD_BLE_SCAN_MAC];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Signal strength
   */
  get rssi(): number | undefined {
    const raw = this.rawMessage.data[MD_BLE_SCAN_RSSI];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int8');
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
  toObject(): BLEScanData {
    return {
      advertising_data: this.advertising_data,
      mac: this.mac,
      rssi: this.rssi,
    };
  }
}
