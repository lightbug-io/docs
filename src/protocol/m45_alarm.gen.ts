// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Alarm
 */
export const MT_ALARM = 45;

/**
 * Message type name for Alarm
 */
export const MT_ALARM_NAME = 'Alarm';

/**
 * Field ID constants
 */
export const MD_ALARM_LEGACY_ALARM_ACTION = 1;
export const MD_ALARM_DURATION = 2;
export const MD_ALARM_BUZZER_PATTERN = 3;
export const MD_ALARM_BUZZER_INTENSITY = 4;
export const MD_ALARM_HAPTICS_PATTERN = 5;
export const MD_ALARM_HAPTICS_INTENSITY = 6;
export const MD_ALARM_STROBE_PATTERN = 7;
export const MD_ALARM_STROBE_INTENSITY = 8;
export const MD_ALARM_PROMPT_MESSAGE = 9;
export const MD_ALARM_PROMPT_TIMEOUT = 10;
export const MD_ALARM_PROMPT_BUTTON_1 = 11;
export const MD_ALARM_PROMPT_BUTTON_2 = 12;

/**
 * Data interface for Alarm message
 */
export interface AlarmData {
  /** 4 bytes of encoded data relating to legacy alarm formats. Can not be used with other options. Note using this field will override Duration header field setting */
  legacy_alarm_action?: number;
  /** Duration of alarm in seconds. Max 127s */
  duration?: number;
  buzzer_pattern?: number;
  buzzer_intensity?: number;
  haptics_pattern?: number;
  haptics_intensity?: number;
  strobe_pattern?: number;
  strobe_intensity?: number;
  prompt_message?: string;
  /** Timeout for the prompt in seconds */
  prompt_timeout?: number;
  prompt_button_1?: string;
  prompt_button_2?: string;
}

/**
 * Alarm
 * Trigger an alarm, using buzzer, haptics, strobe and optional prompt. Use header fields for timing control - Duration = time the alert is played for - Timeout = time the prompt is shown for
 * Group: ungrouped
 */
export class Alarm extends ProtocolMessage {
  readonly messageType = MT_ALARM;
  readonly messageTypeName = MT_ALARM_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): Alarm {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_ALARM) {
      throw new Error(`Expected message type ${MT_ALARM}, got ${raw.messageType}`);
    }
    return new Alarm(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: AlarmData, header?: HeaderData): Alarm {
    const messageData: MessageData = {};

    if (data.legacy_alarm_action !== undefined) {
      messageData[MD_ALARM_LEGACY_ALARM_ACTION] = writeTypedData(data.legacy_alarm_action, 'uint32');
    }

    if (data.duration !== undefined) {
      messageData[MD_ALARM_DURATION] = writeTypedData(data.duration, 'uint8');
    }

    if (data.buzzer_pattern !== undefined) {
      messageData[MD_ALARM_BUZZER_PATTERN] = writeTypedData(data.buzzer_pattern, 'uint8');
    }

    if (data.buzzer_intensity !== undefined) {
      messageData[MD_ALARM_BUZZER_INTENSITY] = writeTypedData(data.buzzer_intensity, 'uint8');
    }

    if (data.haptics_pattern !== undefined) {
      messageData[MD_ALARM_HAPTICS_PATTERN] = writeTypedData(data.haptics_pattern, 'uint8');
    }

    if (data.haptics_intensity !== undefined) {
      messageData[MD_ALARM_HAPTICS_INTENSITY] = writeTypedData(data.haptics_intensity, 'uint8');
    }

    if (data.strobe_pattern !== undefined) {
      messageData[MD_ALARM_STROBE_PATTERN] = writeTypedData(data.strobe_pattern, 'uint8');
    }

    if (data.strobe_intensity !== undefined) {
      messageData[MD_ALARM_STROBE_INTENSITY] = writeTypedData(data.strobe_intensity, 'uint8');
    }

    if (data.prompt_message !== undefined) {
      messageData[MD_ALARM_PROMPT_MESSAGE] = writeTypedData(data.prompt_message, 'ascii');
    }

    if (data.prompt_timeout !== undefined) {
      messageData[MD_ALARM_PROMPT_TIMEOUT] = writeTypedData(data.prompt_timeout, 'uint8');
    }

    if (data.prompt_button_1 !== undefined) {
      messageData[MD_ALARM_PROMPT_BUTTON_1] = writeTypedData(data.prompt_button_1, 'ascii');
    }

    if (data.prompt_button_2 !== undefined) {
      messageData[MD_ALARM_PROMPT_BUTTON_2] = writeTypedData(data.prompt_button_2, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_ALARM,
      messageTypeName: MT_ALARM_NAME,
      header: header || {},
      data: messageData,
    };

    return new Alarm(raw);
  }

  /**
   * 4 bytes of encoded data relating to legacy alarm formats. Can not be used with other options. Note using this field will override Duration header field setting
   */
  get legacy_alarm_action(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_LEGACY_ALARM_ACTION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * Duration of alarm in seconds. Max 127s
   */
  get duration(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_DURATION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Buzzer Pattern
   */
  get buzzer_pattern(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_BUZZER_PATTERN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Buzzer Intensity
   */
  get buzzer_intensity(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_BUZZER_INTENSITY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Haptics Pattern
   */
  get haptics_pattern(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_HAPTICS_PATTERN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Haptics Intensity
   */
  get haptics_intensity(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_HAPTICS_INTENSITY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Strobe Pattern
   */
  get strobe_pattern(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_STROBE_PATTERN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Strobe Intensity
   */
  get strobe_intensity(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_STROBE_INTENSITY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Prompt message
   */
  get prompt_message(): string | undefined {
    const raw = this.rawMessage.data[MD_ALARM_PROMPT_MESSAGE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Timeout for the prompt in seconds
   */
  get prompt_timeout(): number | undefined {
    const raw = this.rawMessage.data[MD_ALARM_PROMPT_TIMEOUT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Prompt button 1
   */
  get prompt_button_1(): string | undefined {
    const raw = this.rawMessage.data[MD_ALARM_PROMPT_BUTTON_1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Prompt button 2
   */
  get prompt_button_2(): string | undefined {
    const raw = this.rawMessage.data[MD_ALARM_PROMPT_BUTTON_2];
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
  toObject(): AlarmData {
    return {
      legacy_alarm_action: this.legacy_alarm_action,
      duration: this.duration,
      buzzer_pattern: this.buzzer_pattern,
      buzzer_intensity: this.buzzer_intensity,
      haptics_pattern: this.haptics_pattern,
      haptics_intensity: this.haptics_intensity,
      strobe_pattern: this.strobe_pattern,
      strobe_intensity: this.strobe_intensity,
      prompt_message: this.prompt_message,
      prompt_timeout: this.prompt_timeout,
      prompt_button_1: this.prompt_button_1,
      prompt_button_2: this.prompt_button_2,
    };
  }
}
