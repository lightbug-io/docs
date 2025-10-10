// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Base Page
 */
export const MT_BASE_PAGE = 10008;

/**
 * Message type name for Base Page
 */
export const MT_BASE_PAGE_NAME = 'Base Page';

/**
 * Field ID constants
 */
export const MD_BASE_PAGE_PAGE_ID = 3;
export const MD_BASE_PAGE_STATUS_BAR_ENABLE = 5;
export const MD_BASE_PAGE_REDRAW_TYPE = 6;

/**
 * Redraw Type values
 */
export enum BasePage_RedrawType {
  AUTO = 0,
  PARTIALREDRAW = 1,
  FULLREDRAW = 2,
  BUFFERONLY = 3,
  FULLREDRAWWITHOUTCLEAR = 4,
  CLEARDONTDRAW = 5
}

export const BasePage_RedrawTypeNames: Record<number, string> = {
  0: 'Auto',
  1: 'PartialRedraw',
  2: 'FullRedraw',
  3: 'BufferOnly',
  4: 'FullRedrawWithoutClear',
  5: 'ClearDontDraw'
};

/**
 * Data interface for Base Page message
 */
export interface BasePageData {
  /** The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.
 */
  page_id?: number;
  /** Show the status bar */
  status_bar_enable?: boolean;
  redraw_type?: number;
}

/**
 * Base Page
 * Draw a base page.
Displays a preset page that is hardcoded in the device.
Currently there is only a single home page programmed per device.

 * Group: screen
 */
export class BasePage extends ProtocolMessage {
  readonly messageType = MT_BASE_PAGE;
  readonly messageTypeName = MT_BASE_PAGE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): BasePage {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_BASE_PAGE) {
      throw new Error(`Expected message type ${MT_BASE_PAGE}, got ${raw.messageType}`);
    }
    return new BasePage(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: BasePageData, header?: HeaderData): BasePage {
    const messageData: MessageData = {};

    if (data.page_id !== undefined) {
      messageData[MD_BASE_PAGE_PAGE_ID] = writeTypedData(data.page_id, 'uint8');
    }

    if (data.status_bar_enable !== undefined) {
      messageData[MD_BASE_PAGE_STATUS_BAR_ENABLE] = writeTypedData(data.status_bar_enable, 'bool');
    }

    if (data.redraw_type !== undefined) {
      messageData[MD_BASE_PAGE_REDRAW_TYPE] = writeTypedData(data.redraw_type, 'uint8');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_BASE_PAGE,
      messageTypeName: MT_BASE_PAGE_NAME,
      header: header || {},
      data: messageData,
    };

    return new BasePage(raw);
  }

  /**
   * The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.

   */
  get page_id(): number | undefined {
    const raw = this.rawMessage.data[MD_BASE_PAGE_PAGE_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Show the status bar
   */
  get status_bar_enable(): boolean | undefined {
    const raw = this.rawMessage.data[MD_BASE_PAGE_STATUS_BAR_ENABLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Get Redraw Type
   */
  get redraw_type(): string | undefined {
    const raw = this.rawMessage.data[MD_BASE_PAGE_REDRAW_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return BasePage_RedrawTypeNames[value] || 'unknown';
  }

  /**
   * Get Redraw Type (raw enum value)
   */
  get redraw_typeRaw(): BasePage_RedrawType | undefined {
    const raw = this.rawMessage.data[MD_BASE_PAGE_REDRAW_TYPE];
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
  toObject(): BasePageData {
    return {
      page_id: this.page_id,
      status_bar_enable: this.status_bar_enable,
      redraw_type: this.redraw_typeRaw,
    };
  }
}
