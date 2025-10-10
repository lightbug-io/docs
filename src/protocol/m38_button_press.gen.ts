// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Button Press
 */
export const MT_BUTTON_PRESS = 38;

/**
 * Message type name for Button Press
 */
export const MT_BUTTON_PRESS_NAME = 'Button Press';

/**
 * Field ID constants
 */
export const MD_BUTTON_PRESS_BUTTON_ID = 1;
export const MD_BUTTON_PRESS_DURATION = 2;

/**
 * Data interface for Button Press message
 */
export interface ButtonPressData {
  /** ID of the button, 0 indexed. Check device spec for button numbering */
  button_id?: number;
  /** Duration of the button press in ms */
  duration?: number;
}

/**
 * Button Press
 * Press of a device button
 * Group: ungrouped
 */
export class ButtonPress extends ProtocolMessage {
  readonly messageType = MT_BUTTON_PRESS;
  readonly messageTypeName = MT_BUTTON_PRESS_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): ButtonPress {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BUTTON_PRESS) {
      throw new Error(`Expected message type ${MT_BUTTON_PRESS}, got ${raw.messageType}`);
    }
    return new ButtonPress(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: ButtonPressData, header?: HeaderData): ButtonPress {
    const messageData: MessageData = {};

    if (data.button_id !== undefined) {
      messageData[MD_BUTTON_PRESS_BUTTON_ID] = writeTypedData(data.button_id, 'uint8');
    }

    if (data.duration !== undefined) {
      messageData[MD_BUTTON_PRESS_DURATION] = writeTypedData(data.duration, 'uint32');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BUTTON_PRESS,
      messageTypeName: MT_BUTTON_PRESS_NAME,
      header: header || {},
      data: messageData,
    };

    return new ButtonPress(raw);
  }

  /**
   * ID of the button, 0 indexed. Check device spec for button numbering
   */
  get button_id(): number | undefined {
    const raw = this.rawMessage.data[MD_BUTTON_PRESS_BUTTON_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Duration of the button press in ms
   */
  get duration(): number | undefined {
    const raw = this.rawMessage.data[MD_BUTTON_PRESS_DURATION];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint32');
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
  toObject(): ButtonPressData {
    return {
      button_id: this.button_id,
      duration: this.duration,
    };
  }
}
