// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Device IDs
 */
export const MT_DEVICE_IDS = 35;

/**
 * Message type name for Device IDs
 */
export const MT_DEVICE_IDS_NAME = 'Device IDs';

/**
 * Field ID constants
 */
export const MD_DEVICE_IDS_ID = 1;
export const MD_DEVICE_IDS_IMEI = 2;
export const MD_DEVICE_IDS_ICCID = 3;

/**
 * Data interface for Device IDs message
 */
export interface DeviceIDsData {
  /** Unique ID for the device which is used in the cloud API. uint32 or uint64 only */
  id?: number;
  /** IMEI - 15 characters */
  imei?: string;
  /** ICCID - 19 to 22 characters */
  iccid?: string;
}

/**
 * Device IDs
 * Used to GET the various IDs of the device.

 * Group: info
 */
export class DeviceIDs extends ProtocolMessage {
  readonly messageType = MT_DEVICE_IDS;
  readonly messageTypeName = MT_DEVICE_IDS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): DeviceIDs {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_DEVICE_IDS) {
      throw new Error(`Expected message type ${MT_DEVICE_IDS}, got ${raw.messageType}`);
    }
    return new DeviceIDs(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: DeviceIDsData, header?: HeaderData): DeviceIDs {
    const messageData: MessageData = {};

    if (data.id !== undefined) {
      messageData[MD_DEVICE_IDS_ID] = writeTypedData(data.id, 'uint');
    }

    if (data.imei !== undefined) {
      messageData[MD_DEVICE_IDS_IMEI] = writeTypedData(data.imei, 'ascii');
    }

    if (data.iccid !== undefined) {
      messageData[MD_DEVICE_IDS_ICCID] = writeTypedData(data.iccid, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_DEVICE_IDS,
      messageTypeName: MT_DEVICE_IDS_NAME,
      header: header || {},
      data: messageData,
    };

    return new DeviceIDs(raw);
  }

  /**
   * Unique ID for the device which is used in the cloud API. uint32 or uint64 only
   */
  get id(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_IDS_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * IMEI - 15 characters
   */
  get imei(): string | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_IDS_IMEI];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * ICCID - 19 to 22 characters
   */
  get iccid(): string | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_IDS_ICCID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
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
  toObject(): DeviceIDsData {
    return {
      id: this.id,
      imei: this.imei,
      iccid: this.iccid,
    };
  }
}
