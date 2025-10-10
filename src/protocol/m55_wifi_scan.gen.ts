// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for WiFi Scan
 */
export const MT_WIFI_SCAN = 55;

/**
 * Message type name for WiFi Scan
 */
export const MT_WIFI_SCAN_NAME = 'WiFi Scan';

/**
 * Field ID constants
 */
export const MD_WIFI_SCAN_SSID = 1;
export const MD_WIFI_SCAN_MAC = 2;
export const MD_WIFI_SCAN_RSSI = 3;
export const MD_WIFI_SCAN_CHANNEL = 4;

/**
 * Data interface for WiFi Scan message
 */
export interface WiFiScanData {
  /** SSID of the access point */
  ssid?: string;
  /** MAC Address of the access point, as 6 bytes */
  mac?: number[];
  /** Signal strength of the access point */
  rssi?: number;
  /** WiFi channel of the access point */
  channel?: number;
}

/**
 * WiFi Scan
 * Group: scan
 */
export class WiFiScan extends ProtocolMessage {
  readonly messageType = MT_WIFI_SCAN;
  readonly messageTypeName = MT_WIFI_SCAN_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): WiFiScan {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_WIFI_SCAN) {
      throw new Error(`Expected message type ${MT_WIFI_SCAN}, got ${raw.messageType}`);
    }
    return new WiFiScan(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: WiFiScanData, header?: HeaderData): WiFiScan {
    const messageData: MessageData = {};

    if (data.ssid !== undefined) {
      messageData[MD_WIFI_SCAN_SSID] = writeTypedData(data.ssid, 'ascii');
    }

    if (data.mac !== undefined) {
      messageData[MD_WIFI_SCAN_MAC] = writeTypedData(data.mac, 'bytes');
    }

    if (data.rssi !== undefined) {
      messageData[MD_WIFI_SCAN_RSSI] = writeTypedData(data.rssi, 'int8');
    }

    if (data.channel !== undefined) {
      messageData[MD_WIFI_SCAN_CHANNEL] = writeTypedData(data.channel, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_WIFI_SCAN,
      messageTypeName: MT_WIFI_SCAN_NAME,
      header: header || {},
      data: messageData,
    };

    return new WiFiScan(raw);
  }

  /**
   * SSID of the access point
   */
  get ssid(): string | undefined {
    const raw = this.rawMessage.data[MD_WIFI_SCAN_SSID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * MAC Address of the access point, as 6 bytes
   */
  get mac(): number[] | undefined {
    const raw = this.rawMessage.data[MD_WIFI_SCAN_MAC];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Signal strength of the access point
   */
  get rssi(): number | undefined {
    const raw = this.rawMessage.data[MD_WIFI_SCAN_RSSI];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'int8');
    return value !== null ? value : undefined;
  }

  /**
   * WiFi channel of the access point
   */
  get channel(): number | undefined {
    const raw = this.rawMessage.data[MD_WIFI_SCAN_CHANNEL];
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
  toObject(): WiFiScanData {
    return {
      ssid: this.ssid,
      mac: this.mac,
      rssi: this.rssi,
      channel: this.channel,
    };
  }
}
