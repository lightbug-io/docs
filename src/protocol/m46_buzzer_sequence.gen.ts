// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Buzzer Sequence
 */
export const MT_BUZZER_SEQUENCE = 46;

/**
 * Message type name for Buzzer Sequence
 */
export const MT_BUZZER_SEQUENCE_NAME = 'Buzzer Sequence';

/**
 * Field ID constants
 */
export const MD_BUZZER_SEQUENCE_FREQUENCIES = 6;
export const MD_BUZZER_SEQUENCE_TIMINGS = 7;

/**
 * Data interface for Buzzer Sequence message
 */
export interface BuzzerSequenceData {
  /** Array of frequencies in Hz as floats */
  frequencies?: number[];
  /** Array of timings in ms as uint16 */
  timings?: number[];
}

/**
 * Buzzer Sequence
 * Play a sequence of buzzer sounds
 * Group: ungrouped
 */
export class BuzzerSequence extends ProtocolMessage {
  readonly messageType = MT_BUZZER_SEQUENCE;
  readonly messageTypeName = MT_BUZZER_SEQUENCE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): BuzzerSequence {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BUZZER_SEQUENCE) {
      throw new Error(`Expected message type ${MT_BUZZER_SEQUENCE}, got ${raw.messageType}`);
    }
    return new BuzzerSequence(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: BuzzerSequenceData, header?: HeaderData): BuzzerSequence {
    const messageData: MessageData = {};

    if (data.frequencies !== undefined) {
      messageData[MD_BUZZER_SEQUENCE_FREQUENCIES] = writeTypedData(data.frequencies, 'float32[]');
    }

    if (data.timings !== undefined) {
      messageData[MD_BUZZER_SEQUENCE_TIMINGS] = writeTypedData(data.timings, 'uint16[]');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BUZZER_SEQUENCE,
      messageTypeName: MT_BUZZER_SEQUENCE_NAME,
      header: header || {},
      data: messageData,
    };

    return new BuzzerSequence(raw);
  }

  /**
   * Array of frequencies in Hz as floats
   */
  get frequencies(): number[] | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_SEQUENCE_FREQUENCIES];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'float32[]');
    return value !== null ? value : undefined;
  }

  /**
   * Array of timings in ms as uint16
   */
  get timings(): number[] | undefined {
    const raw = this.rawMessage.data[MD_BUZZER_SEQUENCE_TIMINGS];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16[]');
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
  toObject(): BuzzerSequenceData {
    return {
      frequencies: this.frequencies,
      timings: this.timings,
    };
  }
}
