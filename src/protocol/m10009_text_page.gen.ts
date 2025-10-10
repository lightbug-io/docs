// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Text Page
 */
export const MT_TEXT_PAGE = 10009;

/**
 * Message type name for Text Page
 */
export const MT_TEXT_PAGE_NAME = 'Text Page';

/**
 * Field ID constants
 */
export const MD_TEXT_PAGE_PAGE_ID = 3;
export const MD_TEXT_PAGE_PAGE_TITLE = 4;
export const MD_TEXT_PAGE_STATUS_BAR_ENABLE = 5;
export const MD_TEXT_PAGE_REDRAW_TYPE = 6;
export const MD_TEXT_PAGE_LINE_1 = 100;
export const MD_TEXT_PAGE_LINE_2 = 101;
export const MD_TEXT_PAGE_LINE_3 = 102;
export const MD_TEXT_PAGE_LINE_4 = 103;

/**
 * Redraw Type values
 */
export enum TextPage_RedrawType {
  AUTO = 0,
  PARTIALREDRAW = 1,
  FULLREDRAW = 2,
  BUFFERONLY = 3,
  FULLREDRAWWITHOUTCLEAR = 4,
  CLEARDONTDRAW = 5
}

export const TextPage_RedrawTypeNames: Record<number, string> = {
  0: 'Auto',
  1: 'PartialRedraw',
  2: 'FullRedraw',
  3: 'BufferOnly',
  4: 'FullRedrawWithoutClear',
  5: 'ClearDontDraw'
};

/**
 * Data interface for Text Page message
 */
export interface TextPageData {
  /** The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.
 */
  page_id?: number;
  /** Title of the page */
  page_title?: string;
  /** Show the status bar */
  status_bar_enable?: boolean;
  redraw_type?: number;
  line_1?: string;
  line_2?: string;
  line_3?: string;
  line_4?: string;
}

/**
 * Text Page
 * Display or alter a text page on the device screen, with up to 5 lines of text.
A text page can have a title, and an optional status bar.

 * Group: screen
 */
export class TextPage extends ProtocolMessage {
  readonly messageType = MT_TEXT_PAGE;
  readonly messageTypeName = MT_TEXT_PAGE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): TextPage {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_TEXT_PAGE) {
      throw new Error(`Expected message type ${MT_TEXT_PAGE}, got ${raw.messageType}`);
    }
    return new TextPage(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: TextPageData, header?: HeaderData): TextPage {
    const messageData: MessageData = {};

    if (data.page_id !== undefined) {
      messageData[MD_TEXT_PAGE_PAGE_ID] = writeTypedData(data.page_id, 'uint8');
    }

    if (data.page_title !== undefined) {
      messageData[MD_TEXT_PAGE_PAGE_TITLE] = writeTypedData(data.page_title, 'ascii');
    }

    if (data.status_bar_enable !== undefined) {
      messageData[MD_TEXT_PAGE_STATUS_BAR_ENABLE] = writeTypedData(data.status_bar_enable, 'bool');
    }

    if (data.redraw_type !== undefined) {
      messageData[MD_TEXT_PAGE_REDRAW_TYPE] = writeTypedData(data.redraw_type, 'uint8');
    }

    if (data.line_1 !== undefined) {
      messageData[MD_TEXT_PAGE_LINE_1] = writeTypedData(data.line_1, 'ascii');
    }

    if (data.line_2 !== undefined) {
      messageData[MD_TEXT_PAGE_LINE_2] = writeTypedData(data.line_2, 'ascii');
    }

    if (data.line_3 !== undefined) {
      messageData[MD_TEXT_PAGE_LINE_3] = writeTypedData(data.line_3, 'ascii');
    }

    if (data.line_4 !== undefined) {
      messageData[MD_TEXT_PAGE_LINE_4] = writeTypedData(data.line_4, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_TEXT_PAGE,
      messageTypeName: MT_TEXT_PAGE_NAME,
      header: header || {},
      data: messageData,
    };

    return new TextPage(raw);
  }

  /**
   * The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.

   */
  get page_id(): number | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_PAGE_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Title of the page
   */
  get page_title(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_PAGE_TITLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Show the status bar
   */
  get status_bar_enable(): boolean | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_STATUS_BAR_ENABLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Get Redraw Type
   */
  get redraw_type(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_REDRAW_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return TextPage_RedrawTypeNames[value] || 'unknown';
  }

  /**
   * Get Redraw Type (raw enum value)
   */
  get redraw_typeRaw(): TextPage_RedrawType | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_REDRAW_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Get Line 1
   */
  get line_1(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_LINE_1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Line 2
   */
  get line_2(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_LINE_2];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Line 3
   */
  get line_3(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_LINE_3];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Line 4
   */
  get line_4(): string | undefined {
    const raw = this.rawMessage.data[MD_TEXT_PAGE_LINE_4];
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
  toObject(): TextPageData {
    return {
      page_id: this.page_id,
      page_title: this.page_title,
      status_bar_enable: this.status_bar_enable,
      redraw_type: this.redraw_typeRaw,
      line_1: this.line_1,
      line_2: this.line_2,
      line_3: this.line_3,
      line_4: this.line_4,
    };
  }
}
