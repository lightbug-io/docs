// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for GSM Control
 */
export const MT_GSM_CONTROL = 31;

/**
 * Message type name for GSM Control
 */
export const MT_GSM_CONTROL_NAME = 'GSM Control';

/**
 * Field ID constants
 */
export const MD_GSM_CONTROL_ENABLE_FLIGHT_MODE = 1;
export const MD_GSM_CONTROL_DURATION = 2;
export const MD_GSM_CONTROL_IS_GSM_ACTIVE = 3;
export const MD_GSM_CONTROL_REQUEST_CONTROL = 4;

/**
 * Data interface for GSM Control message
 */
export interface GSMControlData {
  enable_flight_mode?: boolean;
  duration?: number;
  is_gsm_active?: boolean;
  /** Note this will always be true when GETting state in flight mode (as control has been taken). */
  request_control?: boolean;
}

/**
 * GSM Control
 * Group: gsm
 */
export class GSMControl extends ProtocolMessage {
  readonly messageType = MT_GSM_CONTROL;
  readonly messageTypeName = MT_GSM_CONTROL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): GSMControl {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_GSM_CONTROL) {
      throw new Error(`Expected message type ${MT_GSM_CONTROL}, got ${raw.messageType}`);
    }
    return new GSMControl(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: GSMControlData, header?: HeaderData): GSMControl {
    const messageData: MessageData = {};

    if (data.enable_flight_mode !== undefined) {
      messageData[MD_GSM_CONTROL_ENABLE_FLIGHT_MODE] = writeTypedData(data.enable_flight_mode, 'bool');
    }

    if (data.duration !== undefined) {
      messageData[MD_GSM_CONTROL_DURATION] = writeTypedData(data.duration, 'uint32');
    }

    if (data.request_control !== undefined) {
      messageData[MD_GSM_CONTROL_REQUEST_CONTROL] = writeTypedData(data.request_control, 'bool');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_GSM_CONTROL,
      messageTypeName: MT_GSM_CONTROL_NAME,
      header: header || {},
      data: messageData,
    };

    return new GSMControl(raw);
  }

  /**
   * Get Enable Flight mode
   */
  get enable_flight_mode(): boolean | undefined {
    const raw = this.rawMessage.data[MD_GSM_CONTROL_ENABLE_FLIGHT_MODE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Get Duration
   * Unit: minutes
   */
  get duration(): number | undefined {
    const raw = this.rawMessage.data[MD_GSM_CONTROL_DURATION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Get Is GSM Active
   */
  get is_gsm_active(): boolean | undefined {
    const raw = this.rawMessage.data[MD_GSM_CONTROL_IS_GSM_ACTIVE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Note this will always be true when GETting state in flight mode (as control has been taken).
   */
  get request_control(): boolean | undefined {
    const raw = this.rawMessage.data[MD_GSM_CONTROL_REQUEST_CONTROL];
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
  toObject(): GSMControlData {
    return {
      enable_flight_mode: this.enable_flight_mode,
      duration: this.duration,
      is_gsm_active: this.is_gsm_active,
      request_control: this.request_control,
    };
  }
}
