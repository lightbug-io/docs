// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for GPS Control
 */
export const MT_GPS_CONTROL = 39;

/**
 * Message type name for GPS Control
 */
export const MT_GPS_CONTROL_NAME = 'GPS Control';

/**
 * Field ID constants
 */
export const MD_GPS_CONTROL_GPS_IS_ON = 1;
export const MD_GPS_CONTROL_CORRECTIONS_ENABLED = 2;
export const MD_GPS_CONTROL_START_MODE = 3;

/**
 * Corrections Enabled values
 */
export enum GPSControl_CorrectionsEnabled {
  DISABLED = 0,
  FULL_RTCM_STREAM = 1
}

export const GPSControl_CorrectionsEnabledNames: Record<number, string> = {
  0: 'Disabled',
  1: 'Full RTCM stream'
};

/**
 * Start Mode values
 */
export enum GPSControl_StartMode {
  NORMAL = 1,
  COLD = 2,
  WARM = 3,
  HOT = 4
}

export const GPSControl_StartModeNames: Record<number, string> = {
  1: 'Normal',
  2: 'Cold',
  3: 'Warm',
  4: 'Hot'
};

/**
 * Data interface for GPS Control message
 */
export interface GPSControlData {
  /** Status of the GPS, is it on? */
  gps_is_on?: boolean;
  /** Request and apply correction data to the GPS, such as RTK. */
  corrections_enabled?: number;
  /** Start mode of the GPS module. */
  start_mode?: number;
}

/**
 * GPS Control
 * Used to interact with the device GPS service.
Currently only accessible from Viper devices.

 * Group: location
 */
export class GPSControl extends ProtocolMessage {
  readonly messageType = MT_GPS_CONTROL;
  readonly messageTypeName = MT_GPS_CONTROL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): GPSControl {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_GPS_CONTROL) {
      throw new Error(`Expected message type ${MT_GPS_CONTROL}, got ${raw.messageType}`);
    }
    return new GPSControl(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: GPSControlData, header?: HeaderData): GPSControl {
    const messageData: MessageData = {};

    if (data.corrections_enabled !== undefined) {
      messageData[MD_GPS_CONTROL_CORRECTIONS_ENABLED] = writeTypedData(data.corrections_enabled, 'uint8');
    }

    if (data.start_mode !== undefined) {
      messageData[MD_GPS_CONTROL_START_MODE] = writeTypedData(data.start_mode, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_GPS_CONTROL,
      messageTypeName: MT_GPS_CONTROL_NAME,
      header: header || {},
      data: messageData,
    };

    return new GPSControl(raw);
  }

  /**
   * Status of the GPS, is it on?
   */
  get gps_is_on(): boolean | undefined {
    const raw = this.rawMessage.data[MD_GPS_CONTROL_GPS_IS_ON];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Request and apply correction data to the GPS, such as RTK.
   */
  get corrections_enabled(): string | undefined {
    const raw = this.rawMessage.data[MD_GPS_CONTROL_CORRECTIONS_ENABLED];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return GPSControl_CorrectionsEnabledNames[value] || 'unknown';
  }

  /**
   * Get Corrections Enabled (raw enum value)
   */
  get corrections_enabledRaw(): GPSControl_CorrectionsEnabled | undefined {
    const raw = this.rawMessage.data[MD_GPS_CONTROL_CORRECTIONS_ENABLED];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Start mode of the GPS module.
   */
  get start_mode(): string | undefined {
    const raw = this.rawMessage.data[MD_GPS_CONTROL_START_MODE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return GPSControl_StartModeNames[value] || 'unknown';
  }

  /**
   * Get Start Mode (raw enum value)
   */
  get start_modeRaw(): GPSControl_StartMode | undefined {
    const raw = this.rawMessage.data[MD_GPS_CONTROL_START_MODE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
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
  toObject(): GPSControlData {
    return {
      gps_is_on: this.gps_is_on,
      corrections_enabled: this.corrections_enabledRaw,
      start_mode: this.start_modeRaw,
    };
  }
}
