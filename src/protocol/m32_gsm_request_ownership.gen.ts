// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for GSM Request Ownership
 */
export const MT_GSM_REQUEST_OWNERSHIP = 32;

/**
 * Message type name for GSM Request Ownership
 */
export const MT_GSM_REQUEST_OWNERSHIP_NAME = 'GSM Request Ownership';

/**
 * Field ID constants
 */
export const MD_GSM_REQUEST_OWNERSHIP_DURATION = 2;
export const MD_GSM_REQUEST_OWNERSHIP_REQUEST_CONTROL = 4;

/**
 * Data interface for GSM Request Ownership message
 */
export interface GSMRequestOwnershipData {
  /** in mins */
  duration?: number;
  request_control?: boolean;
}

/**
 * GSM Request Ownership
 * Only available for implant modules that expose modem control over usb to a host directly
 * Group: gsm
 */
export class GSMRequestOwnership extends ProtocolMessage {
  readonly messageType = MT_GSM_REQUEST_OWNERSHIP;
  readonly messageTypeName = MT_GSM_REQUEST_OWNERSHIP_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): GSMRequestOwnership {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_GSM_REQUEST_OWNERSHIP) {
      throw new Error(`Expected message type ${MT_GSM_REQUEST_OWNERSHIP}, got ${raw.messageType}`);
    }
    return new GSMRequestOwnership(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: GSMRequestOwnershipData, header?: HeaderData): GSMRequestOwnership {
    const messageData: MessageData = {};

    if (data.duration !== undefined) {
      messageData[MD_GSM_REQUEST_OWNERSHIP_DURATION] = writeTypedData(data.duration, 'uint32');
    }

    if (data.request_control !== undefined) {
      messageData[MD_GSM_REQUEST_OWNERSHIP_REQUEST_CONTROL] = writeTypedData(data.request_control, 'bool');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_GSM_REQUEST_OWNERSHIP,
      messageTypeName: MT_GSM_REQUEST_OWNERSHIP_NAME,
      header: header || {},
      data: messageData,
    };

    return new GSMRequestOwnership(raw);
  }

  /**
   * in mins
   */
  get duration(): number | undefined {
    const raw = this.rawMessage.data[MD_GSM_REQUEST_OWNERSHIP_DURATION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Get Request Control
   */
  get request_control(): boolean | undefined {
    const raw = this.rawMessage.data[MD_GSM_REQUEST_OWNERSHIP_REQUEST_CONTROL];
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
  toObject(): GSMRequestOwnershipData {
    return {
      duration: this.duration,
      request_control: this.request_control,
    };
  }
}
