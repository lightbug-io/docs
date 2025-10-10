// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Satellite Data
 */
export const MT_SATELLITE_DATA = 16;

/**
 * Message type name for Satellite Data
 */
export const MT_SATELLITE_DATA_NAME = 'Satellite Data';

/**
 * Field ID constants
 */
export const MD_SATELLITE_DATA_SNR_AVERAGE = 1;
export const MD_SATELLITE_DATA_SNR_MINIMUM = 2;
export const MD_SATELLITE_DATA_SNR_MAXIMUM = 3;
export const MD_SATELLITE_DATA_TOTAL_SATELLITES = 4;
export const MD_SATELLITE_DATA_GOOD_SATELLITES = 5;
export const MD_SATELLITE_DATA_GPS_L1 = 10;
export const MD_SATELLITE_DATA_GPS_LX = 11;
export const MD_SATELLITE_DATA_GLONASS_L1 = 12;
export const MD_SATELLITE_DATA_GLONASS_LX = 13;
export const MD_SATELLITE_DATA_BEIDOU_L1 = 14;
export const MD_SATELLITE_DATA_BEIDOU_LX = 15;
export const MD_SATELLITE_DATA_GALILEO_L1 = 16;
export const MD_SATELLITE_DATA_GALILEO_LX = 17;

/**
 * Data interface for Satellite Data message
 */
export interface SatelliteDataData {
  /** Average signal-to-noise ratio across all satellites */
  snr_average?: number;
  /** Minimum signal-to-noise ratio among all satellites */
  snr_minimum?: number;
  /** Maximum signal-to-noise ratio among all satellites */
  snr_maximum?: number;
  /** Total number of satellites in view */
  total_satellites?: number;
  /** Heuristic for signal quality (defined as satellites with SNR>=38dBm. This number should be higher than 8 for a good RTK fix, typically) */
  good_satellites?: number;
  /** Summary data for GPS L1 satellites */
  gps_l1?: number[];
  /** Summary data for GPS L2 or L5 satellite signals (depending on hardware) */
  gps_lx?: number[];
  /** Summary data for GLONASS L1 satellite signals */
  glonass_l1?: number[];
  /** Summary data for GLONASS L2 or L5 satellite signals (depending on hardware) */
  glonass_lx?: number[];
  /** Summary data for Beidou L1 satellite signals */
  beidou_l1?: number[];
  /** Summary data for Beidou L2 or L5 satellite signals (depending on hardware) */
  beidou_lx?: number[];
  /** Summary data for Galileo L1 satellite signals */
  galileo_l1?: number[];
  /** Summary data for Galileo L2 or L5 satellite signals (depending on hardware) */
  galileo_lx?: number[];
}

/**
 * Satellite Data
 * Group: location
 */
export class SatelliteData extends ProtocolMessage {
  readonly messageType = MT_SATELLITE_DATA;
  readonly messageTypeName = MT_SATELLITE_DATA_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): SatelliteData {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_SATELLITE_DATA) {
      throw new Error(`Expected message type ${MT_SATELLITE_DATA}, got ${raw.messageType}`);
    }
    return new SatelliteData(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: SatelliteDataData, header?: HeaderData): SatelliteData {
    const messageData: MessageData = {};

    if (data.snr_average !== undefined) {
      messageData[MD_SATELLITE_DATA_SNR_AVERAGE] = writeTypedData(data.snr_average, 'uint8');
    }

    if (data.snr_minimum !== undefined) {
      messageData[MD_SATELLITE_DATA_SNR_MINIMUM] = writeTypedData(data.snr_minimum, 'uint8');
    }

    if (data.snr_maximum !== undefined) {
      messageData[MD_SATELLITE_DATA_SNR_MAXIMUM] = writeTypedData(data.snr_maximum, 'uint8');
    }

    if (data.total_satellites !== undefined) {
      messageData[MD_SATELLITE_DATA_TOTAL_SATELLITES] = writeTypedData(data.total_satellites, 'uint8');
    }

    if (data.good_satellites !== undefined) {
      messageData[MD_SATELLITE_DATA_GOOD_SATELLITES] = writeTypedData(data.good_satellites, 'uint8');
    }

    if (data.gps_l1 !== undefined) {
      messageData[MD_SATELLITE_DATA_GPS_L1] = writeTypedData(data.gps_l1, 'bytes');
    }

    if (data.gps_lx !== undefined) {
      messageData[MD_SATELLITE_DATA_GPS_LX] = writeTypedData(data.gps_lx, 'bytes');
    }

    if (data.glonass_l1 !== undefined) {
      messageData[MD_SATELLITE_DATA_GLONASS_L1] = writeTypedData(data.glonass_l1, 'bytes');
    }

    if (data.glonass_lx !== undefined) {
      messageData[MD_SATELLITE_DATA_GLONASS_LX] = writeTypedData(data.glonass_lx, 'bytes');
    }

    if (data.beidou_l1 !== undefined) {
      messageData[MD_SATELLITE_DATA_BEIDOU_L1] = writeTypedData(data.beidou_l1, 'bytes');
    }

    if (data.beidou_lx !== undefined) {
      messageData[MD_SATELLITE_DATA_BEIDOU_LX] = writeTypedData(data.beidou_lx, 'bytes');
    }

    if (data.galileo_l1 !== undefined) {
      messageData[MD_SATELLITE_DATA_GALILEO_L1] = writeTypedData(data.galileo_l1, 'bytes');
    }

    if (data.galileo_lx !== undefined) {
      messageData[MD_SATELLITE_DATA_GALILEO_LX] = writeTypedData(data.galileo_lx, 'bytes');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_SATELLITE_DATA,
      messageTypeName: MT_SATELLITE_DATA_NAME,
      header: header || {},
      data: messageData,
    };

    return new SatelliteData(raw);
  }

  /**
   * Average signal-to-noise ratio across all satellites
   */
  get snr_average(): number | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_SNR_AVERAGE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Minimum signal-to-noise ratio among all satellites
   */
  get snr_minimum(): number | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_SNR_MINIMUM];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Maximum signal-to-noise ratio among all satellites
   */
  get snr_maximum(): number | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_SNR_MAXIMUM];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Total number of satellites in view
   */
  get total_satellites(): number | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_TOTAL_SATELLITES];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Heuristic for signal quality (defined as satellites with SNR>=38dBm. This number should be higher than 8 for a good RTK fix, typically)
   */
  get good_satellites(): number | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GOOD_SATELLITES];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for GPS L1 satellites
   */
  get gps_l1(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GPS_L1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for GPS L2 or L5 satellite signals (depending on hardware)
   */
  get gps_lx(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GPS_LX];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for GLONASS L1 satellite signals
   */
  get glonass_l1(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GLONASS_L1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for GLONASS L2 or L5 satellite signals (depending on hardware)
   */
  get glonass_lx(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GLONASS_LX];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for Beidou L1 satellite signals
   */
  get beidou_l1(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_BEIDOU_L1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for Beidou L2 or L5 satellite signals (depending on hardware)
   */
  get beidou_lx(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_BEIDOU_LX];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for Galileo L1 satellite signals
   */
  get galileo_l1(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GALILEO_L1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Summary data for Galileo L2 or L5 satellite signals (depending on hardware)
   */
  get galileo_lx(): number[] | undefined {
    const raw = this.rawMessage.data[MD_SATELLITE_DATA_GALILEO_LX];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
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
  toObject(): SatelliteDataData {
    return {
      snr_average: this.snr_average,
      snr_minimum: this.snr_minimum,
      snr_maximum: this.snr_maximum,
      total_satellites: this.total_satellites,
      good_satellites: this.good_satellites,
      gps_l1: this.gps_l1,
      gps_lx: this.gps_lx,
      glonass_l1: this.glonass_l1,
      glonass_lx: this.glonass_lx,
      beidou_l1: this.beidou_l1,
      beidou_lx: this.beidou_lx,
      galileo_l1: this.galileo_l1,
      galileo_lx: this.galileo_lx,
    };
  }
}
