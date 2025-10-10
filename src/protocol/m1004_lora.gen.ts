// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for LORA
 */
export const MT_LORA = 1004;

/**
 * Message type name for LORA
 */
export const MT_LORA_NAME = 'LORA';

/**
 * Field ID constants
 */
export const MD_LORA_PAYLOAD = 2;
export const MD_LORA_SPREAD_FACTOR = 4;
export const MD_LORA_CODING_RATE = 5;
export const MD_LORA_BANDWIDTH = 6;
export const MD_LORA_CENTER_FREQUENCY = 7;
export const MD_LORA_TX_POWER = 8;
export const MD_LORA_PREAMBLE_LENGTH = 9;
export const MD_LORA_RECEIVE_MS = 10;
export const MD_LORA_SLEEP = 11;
export const MD_LORA_STATE = 12;

/**
 * Data interface for LORA message
 */
export interface LORAData {
  payload?: number[];
  /** 8-12 */
  spread_factor?: number;
  /** 1-4. [1: 4/5, 2: 4/6, 3: 4/7, 4: 4/8] */
  coding_rate?: number;
  /** 0-2. [0: 125 kHz, 1: 250 kHz, 2: 500 kHz] */
  bandwidth?: number;
  /** 860000000-925000000. value in hz */
  center_frequency?: number;
  /** 0-22 */
  tx_power?: number;
  /** 4-128 */
  preamble_length?: number;
  /** How long to listen for after a transmit, in ms */
  receive_ms?: number;
  /** True will tell the LORA to stop all activity now */
  sleep?: boolean;
  state?: number;
}

/**
 * LORA
 * Interaction with LORA.
Used to interact with LORA on the device.

 * Group: ungrouped
 */
export class LORA extends ProtocolMessage {
  readonly messageType = MT_LORA;
  readonly messageTypeName = MT_LORA_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): LORA {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_LORA) {
      throw new Error(`Expected message type ${MT_LORA}, got ${raw.messageType}`);
    }
    return new LORA(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: LORAData, header?: HeaderData): LORA {
    const messageData: MessageData = {};

    if (data.payload !== undefined) {
      messageData[MD_LORA_PAYLOAD] = writeTypedData(data.payload, 'bytes');
    }

    if (data.spread_factor !== undefined) {
      messageData[MD_LORA_SPREAD_FACTOR] = writeTypedData(data.spread_factor, 'uint8');
    }

    if (data.coding_rate !== undefined) {
      messageData[MD_LORA_CODING_RATE] = writeTypedData(data.coding_rate, 'uint8');
    }

    if (data.bandwidth !== undefined) {
      messageData[MD_LORA_BANDWIDTH] = writeTypedData(data.bandwidth, 'uint8');
    }

    if (data.center_frequency !== undefined) {
      messageData[MD_LORA_CENTER_FREQUENCY] = writeTypedData(data.center_frequency, 'uint32');
    }

    if (data.tx_power !== undefined) {
      messageData[MD_LORA_TX_POWER] = writeTypedData(data.tx_power, 'uint8');
    }

    if (data.preamble_length !== undefined) {
      messageData[MD_LORA_PREAMBLE_LENGTH] = writeTypedData(data.preamble_length, 'uint8');
    }

    if (data.receive_ms !== undefined) {
      messageData[MD_LORA_RECEIVE_MS] = writeTypedData(data.receive_ms, 'uint32');
    }

    if (data.sleep !== undefined) {
      messageData[MD_LORA_SLEEP] = writeTypedData(data.sleep, 'bool');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_LORA,
      messageTypeName: MT_LORA_NAME,
      header: header || {},
      data: messageData,
    };

    return new LORA(raw);
  }

  /**
   * Get Payload
   */
  get payload(): number[] | undefined {
    const raw = this.rawMessage.data[MD_LORA_PAYLOAD];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * 8-12
   */
  get spread_factor(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_SPREAD_FACTOR];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * 1-4. [1: 4/5, 2: 4/6, 3: 4/7, 4: 4/8]
   */
  get coding_rate(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_CODING_RATE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * 0-2. [0: 125 kHz, 1: 250 kHz, 2: 500 kHz]
   */
  get bandwidth(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_BANDWIDTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * 860000000-925000000. value in hz
   */
  get center_frequency(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_CENTER_FREQUENCY];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * 0-22
   */
  get tx_power(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_TX_POWER];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * 4-128
   */
  get preamble_length(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_PREAMBLE_LENGTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * How long to listen for after a transmit, in ms
   */
  get receive_ms(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_RECEIVE_MS];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
    return value !== null ? value : undefined;
  }

  /**
   * True will tell the LORA to stop all activity now
   */
  get sleep(): boolean | undefined {
    const raw = this.rawMessage.data[MD_LORA_SLEEP];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Get State
   */
  get state(): number | undefined {
    const raw = this.rawMessage.data[MD_LORA_STATE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
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
  toObject(): LORAData {
    return {
      payload: this.payload,
      spread_factor: this.spread_factor,
      coding_rate: this.coding_rate,
      bandwidth: this.bandwidth,
      center_frequency: this.center_frequency,
      tx_power: this.tx_power,
      preamble_length: this.preamble_length,
      receive_ms: this.receive_ms,
      sleep: this.sleep,
      state: this.state,
    };
  }
}
