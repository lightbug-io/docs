// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Haptics Control
 */
export const MT_HAPTICS_CONTROL = 40;

/**
 * Message type name for Haptics Control
 */
export const MT_HAPTICS_CONTROL_NAME = 'Haptics Control';

/**
 * Field ID constants
 */
export const MD_HAPTICS_CONTROL_PATTERN = 1;
export const MD_HAPTICS_CONTROL_INTENSITY = 2;

/**
 * Pattern values
 */
export enum HapticsControl_Pattern {
  FADE = 1,
  PULSE = 2,
  DROP = 3
}

export const HapticsControl_PatternNames: Record<number, string> = {
  1: 'Fade',
  2: 'Pulse',
  3: 'Drop'
};

/**
 * Intensity values
 */
export enum HapticsControl_Intensity {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2
}

export const HapticsControl_IntensityNames: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High'
};

/**
 * Data interface for Haptics Control message
 */
export interface HapticsControlData {
  /** Pattern of haptics [1-3] */
  pattern?: number;
  /** Intensity of haptics [0-2] */
  intensity?: number;
}

/**
 * Haptics Control
 * Control the haptics
 * Group: ungrouped
 */
export class HapticsControl extends ProtocolMessage {
  readonly messageType = MT_HAPTICS_CONTROL;
  readonly messageTypeName = MT_HAPTICS_CONTROL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): HapticsControl {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_HAPTICS_CONTROL) {
      throw new Error(`Expected message type ${MT_HAPTICS_CONTROL}, got ${raw.messageType}`);
    }
    return new HapticsControl(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: HapticsControlData, header?: HeaderData): HapticsControl {
    const messageData: MessageData = {};

    if (data.pattern !== undefined) {
      messageData[MD_HAPTICS_CONTROL_PATTERN] = writeTypedData(data.pattern, 'uint8');
    }

    if (data.intensity !== undefined) {
      messageData[MD_HAPTICS_CONTROL_INTENSITY] = writeTypedData(data.intensity, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_HAPTICS_CONTROL,
      messageTypeName: MT_HAPTICS_CONTROL_NAME,
      header: header || {},
      data: messageData,
    };

    return new HapticsControl(raw);
  }

  /**
   * Pattern of haptics [1-3]
   */
  get pattern(): string | undefined {
    const raw = this.rawMessage.data[MD_HAPTICS_CONTROL_PATTERN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return HapticsControl_PatternNames[value] || 'unknown';
  }

  /**
   * Get Pattern (raw enum value)
   */
  get patternRaw(): HapticsControl_Pattern | undefined {
    const raw = this.rawMessage.data[MD_HAPTICS_CONTROL_PATTERN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Intensity of haptics [0-2]
   */
  get intensity(): string | undefined {
    const raw = this.rawMessage.data[MD_HAPTICS_CONTROL_INTENSITY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return HapticsControl_IntensityNames[value] || 'unknown';
  }

  /**
   * Get Intensity (raw enum value)
   */
  get intensityRaw(): HapticsControl_Intensity | undefined {
    const raw = this.rawMessage.data[MD_HAPTICS_CONTROL_INTENSITY];
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
  toObject(): HapticsControlData {
    return {
      pattern: this.patternRaw,
      intensity: this.intensityRaw,
    };
  }
}
