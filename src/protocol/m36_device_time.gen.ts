// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Device Time
 */
export const MT_DEVICE_TIME = 36;

/**
 * Message type name for Device Time
 */
export const MT_DEVICE_TIME_NAME = 'Device Time';

/**
 * Field ID constants
 */
export const MD_DEVICE_TIME_UNIX_TIME = 1;
export const MD_DEVICE_TIME_YEAR = 2;
export const MD_DEVICE_TIME_MONTH = 3;
export const MD_DEVICE_TIME_DATE = 4;
export const MD_DEVICE_TIME_WEEKDAY = 5;
export const MD_DEVICE_TIME_HOUR = 6;
export const MD_DEVICE_TIME_MINUTE = 7;
export const MD_DEVICE_TIME_SECOND = 8;

/**
 * Data interface for Device Time message
 */
export interface DeviceTimeData {
  /** Unix time */
  unix_time?: number;
  /** Year */
  year?: number;
  /** Month */
  month?: number;
  /** Date in month */
  date?: number;
  /** Weekday (0 = sunday, 1 = monday etc) */
  weekday?: number;
  /** Hour */
  hour?: number;
  /** Minute */
  minute?: number;
  /** Second */
  second?: number;
}

/**
 * Device Time
 * Device time information, if known
 * Group: info
 */
export class DeviceTime extends ProtocolMessage {
  readonly messageType = MT_DEVICE_TIME;
  readonly messageTypeName = MT_DEVICE_TIME_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): DeviceTime {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_DEVICE_TIME) {
      throw new Error(`Expected message type ${MT_DEVICE_TIME}, got ${raw.messageType}`);
    }
    return new DeviceTime(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: DeviceTimeData, header?: HeaderData): DeviceTime {
    const messageData: MessageData = {};

    if (data.unix_time !== undefined) {
      messageData[MD_DEVICE_TIME_UNIX_TIME] = writeTypedData(data.unix_time, 'uint32');
    }

    if (data.year !== undefined) {
      messageData[MD_DEVICE_TIME_YEAR] = writeTypedData(data.year, 'uint16');
    }

    if (data.month !== undefined) {
      messageData[MD_DEVICE_TIME_MONTH] = writeTypedData(data.month, 'uint8');
    }

    if (data.date !== undefined) {
      messageData[MD_DEVICE_TIME_DATE] = writeTypedData(data.date, 'uint8');
    }

    if (data.weekday !== undefined) {
      messageData[MD_DEVICE_TIME_WEEKDAY] = writeTypedData(data.weekday, 'uint8');
    }

    if (data.hour !== undefined) {
      messageData[MD_DEVICE_TIME_HOUR] = writeTypedData(data.hour, 'uint8');
    }

    if (data.minute !== undefined) {
      messageData[MD_DEVICE_TIME_MINUTE] = writeTypedData(data.minute, 'uint8');
    }

    if (data.second !== undefined) {
      messageData[MD_DEVICE_TIME_SECOND] = writeTypedData(data.second, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_DEVICE_TIME,
      messageTypeName: MT_DEVICE_TIME_NAME,
      header: header || {},
      data: messageData,
    };

    return new DeviceTime(raw);
  }

  /**
   * Unix time
   */
  get unix_time(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_UNIX_TIME];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Year
   */
  get year(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_YEAR];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Month
   */
  get month(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_MONTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Date in month
   */
  get date(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_DATE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Weekday (0 = sunday, 1 = monday etc)
   */
  get weekday(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_WEEKDAY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Hour
   */
  get hour(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_HOUR];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Minute
   */
  get minute(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_MINUTE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Second
   */
  get second(): number | undefined {
    const raw = this.rawMessage.data[MD_DEVICE_TIME_SECOND];
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
  toObject(): DeviceTimeData {
    return {
      unix_time: this.unix_time,
      year: this.year,
      month: this.month,
      date: this.date,
      weekday: this.weekday,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
    };
  }
}
