// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Buzzer Control
 */
export const MT_BUZZER_CONTROL = 42;

/**
 * Message type name for Buzzer Control
 */
export const MT_BUZZER_CONTROL_NAME = 'Buzzer Control';

/**
 * Field ID constants
 */
export const MD_BUZZER_CONTROL_DURATION = 1;
export const MD_BUZZER_CONTROL_SOUND_TYPE = 2;
export const MD_BUZZER_CONTROL_INTENSITY = 3;
export const MD_BUZZER_CONTROL_RUN_COUNT = 4;
export const MD_BUZZER_CONTROL_FREQUENCY = 5;

/**
 * Sound Type values
 */
export enum BuzzerControl_SoundType {
  SOLID = 0,
  SIREN = 1,
  BEEP_BEEP = 2,
  AMBULANCE = 3,
  FIRETRUCK = 4,
  POSITIVE1 = 5,
  SLOWBEEP = 6,
  ALARM = 7
}

export const BuzzerControl_SoundTypeNames: Record<number, string> = {
  0: 'Solid',
  1: 'Siren',
  2: 'Beep Beep',
  3: 'Ambulance',
  4: 'FireTruck',
  5: 'Positive1',
  6: 'SlowBeep',
  7: 'Alarm'
};

/**
 * Data interface for Buzzer Control message
 */
export interface BuzzerControlData {
  /** Duration of buzzer in milliseconds */
  duration?: number;
  /** A predefined sound type */
  sound_type?: number;
  /** Intensity of buzzer. [0-2]. Work as frequency control for buzzer types (moving towards and away from resonance). */
  intensity?: number;
  /** Number of times to run the buzzer */
  run_count?: number;
  /** Frequency of buzzer of KHz.(if frequency is sent, only duration and frequency parameters will be inside the message) */
  frequency?: number;
}

/**
 * Buzzer Control
 * Control the buzzer. Either pass duration and frequency, Or all fields without frequency.
 * Group: ungrouped
 */
export class BuzzerControl extends ProtocolMessage {
  readonly messageType = MT_BUZZER_CONTROL;
  readonly messageTypeName = MT_BUZZER_CONTROL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): BuzzerControl {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BUZZER_CONTROL) {
      throw new Error(`Expected message type ${MT_BUZZER_CONTROL}, got ${raw.messageType}`);
    }
    return new BuzzerControl(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: BuzzerControlData, header?: HeaderData): BuzzerControl {
    const messageData: MessageData = {};

    if (data.duration !== undefined) {
      messageData[MD_BUZZER_CONTROL_DURATION] = writeTypedData(data.duration, 'uint16');
    }

    if (data.sound_type !== undefined) {
      messageData[MD_BUZZER_CONTROL_SOUND_TYPE] = writeTypedData(data.sound_type, 'uint8');
    }

    if (data.intensity !== undefined) {
      messageData[MD_BUZZER_CONTROL_INTENSITY] = writeTypedData(data.intensity, 'uint8');
    }

    if (data.run_count !== undefined) {
      messageData[MD_BUZZER_CONTROL_RUN_COUNT] = writeTypedData(data.run_count, 'uint8');
    }

    if (data.frequency !== undefined) {
      messageData[MD_BUZZER_CONTROL_FREQUENCY] = writeTypedData(data.frequency, 'float32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BUZZER_CONTROL,
      messageTypeName: MT_BUZZER_CONTROL_NAME,
      header: header || {},
      data: messageData,
    };

    return new BuzzerControl(raw);
  }

  /**
   * Duration of buzzer in milliseconds
   */
  get duration(): number | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_DURATION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * A predefined sound type
   */
  get sound_type(): string | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_SOUND_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return BuzzerControl_SoundTypeNames[value] || 'unknown';
  }

  /**
   * Get Sound Type (raw enum value)
   */
  get sound_typeRaw(): BuzzerControl_SoundType | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_SOUND_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Intensity of buzzer. [0-2]. Work as frequency control for buzzer types (moving towards and away from resonance).
   */
  get intensity(): number | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_INTENSITY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Number of times to run the buzzer
   */
  get run_count(): number | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_RUN_COUNT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Frequency of buzzer of KHz.(if frequency is sent, only duration and frequency parameters will be inside the message)
   */
  get frequency(): number | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_CONTROL_FREQUENCY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32');
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
  toObject(): BuzzerControlData {
    return {
      duration: this.duration,
      sound_type: this.sound_typeRaw,
      intensity: this.intensity,
      run_count: this.run_count,
      frequency: this.frequency,
    };
  }
}
