// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Menu Page
 */
export const MT_MENU_PAGE = 10010;

/**
 * Message type name for Menu Page
 */
export const MT_MENU_PAGE_NAME = 'Menu Page';

/**
 * Field ID constants
 */
export const MD_MENU_PAGE_PAGE_ID = 3;
export const MD_MENU_PAGE_PAGE_TITLE = 4;
export const MD_MENU_PAGE_ITEM_COUNT = 30;
export const MD_MENU_PAGE_SELECTED_ITEM = 31;
export const MD_MENU_PAGE_ITEM_1 = 100;
export const MD_MENU_PAGE_ITEM_2 = 101;
export const MD_MENU_PAGE_ITEM_3 = 102;
export const MD_MENU_PAGE_ITEM_4 = 103;
export const MD_MENU_PAGE_ITEM_5 = 104;
export const MD_MENU_PAGE_ITEM_6 = 105;
export const MD_MENU_PAGE_ITEM_7 = 106;
export const MD_MENU_PAGE_ITEM_8 = 107;
export const MD_MENU_PAGE_ITEM_9 = 108;
export const MD_MENU_PAGE_ITEM_10 = 109;
export const MD_MENU_PAGE_ITEM_11 = 110;
export const MD_MENU_PAGE_ITEM_12 = 111;
export const MD_MENU_PAGE_ITEM_13 = 112;
export const MD_MENU_PAGE_ITEM_14 = 113;
export const MD_MENU_PAGE_ITEM_15 = 114;
export const MD_MENU_PAGE_ITEM_16 = 115;
export const MD_MENU_PAGE_ITEM_17 = 116;
export const MD_MENU_PAGE_ITEM_18 = 117;
export const MD_MENU_PAGE_ITEM_19 = 118;
export const MD_MENU_PAGE_ITEM_20 = 119;

/**
 * Data interface for Menu Page message
 */
export interface MenuPageData {
  /** The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.
 */
  page_id?: number;
  page_title?: string;
  item_count?: number;
  /** Optionally select a specific item, else the first will be used */
  selected_item?: number;
  item_1?: string;
  item_2?: string;
  item_3?: string;
  item_4?: string;
  item_5?: string;
  item_6?: string;
  item_7?: string;
  item_8?: string;
  item_9?: string;
  item_10?: string;
  item_11?: string;
  item_12?: string;
  item_13?: string;
  item_14?: string;
  item_15?: string;
  item_16?: string;
  item_17?: string;
  item_18?: string;
  item_19?: string;
  item_20?: string;
}

/**
 * Menu Page
 * Draw or change a menu.
Display or alter a menu page on the device screen.

 * Group: screen
 */
export class MenuPage extends ProtocolMessage {
  readonly messageType = MT_MENU_PAGE;
  readonly messageTypeName = MT_MENU_PAGE_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): MenuPage {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_MENU_PAGE) {
      throw new Error(`Expected message type ${MT_MENU_PAGE}, got ${raw.messageType}`);
    }
    return new MenuPage(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: MenuPageData, header?: HeaderData): MenuPage {
    const messageData: MessageData = {};

    if (data.page_id !== undefined) {
      messageData[MD_MENU_PAGE_PAGE_ID] = writeTypedData(data.page_id, 'uint8');
    }

    if (data.page_title !== undefined) {
      messageData[MD_MENU_PAGE_PAGE_TITLE] = writeTypedData(data.page_title, 'ascii');
    }

    if (data.item_count !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_COUNT] = writeTypedData(data.item_count, 'uint8');
    }

    if (data.selected_item !== undefined) {
      messageData[MD_MENU_PAGE_SELECTED_ITEM] = writeTypedData(data.selected_item, 'uint8');
    }

    if (data.item_1 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_1] = writeTypedData(data.item_1, 'ascii');
    }

    if (data.item_2 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_2] = writeTypedData(data.item_2, 'ascii');
    }

    if (data.item_3 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_3] = writeTypedData(data.item_3, 'ascii');
    }

    if (data.item_4 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_4] = writeTypedData(data.item_4, 'ascii');
    }

    if (data.item_5 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_5] = writeTypedData(data.item_5, 'ascii');
    }

    if (data.item_6 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_6] = writeTypedData(data.item_6, 'ascii');
    }

    if (data.item_7 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_7] = writeTypedData(data.item_7, 'ascii');
    }

    if (data.item_8 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_8] = writeTypedData(data.item_8, 'ascii');
    }

    if (data.item_9 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_9] = writeTypedData(data.item_9, 'ascii');
    }

    if (data.item_10 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_10] = writeTypedData(data.item_10, 'ascii');
    }

    if (data.item_11 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_11] = writeTypedData(data.item_11, 'ascii');
    }

    if (data.item_12 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_12] = writeTypedData(data.item_12, 'ascii');
    }

    if (data.item_13 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_13] = writeTypedData(data.item_13, 'ascii');
    }

    if (data.item_14 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_14] = writeTypedData(data.item_14, 'ascii');
    }

    if (data.item_15 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_15] = writeTypedData(data.item_15, 'ascii');
    }

    if (data.item_16 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_16] = writeTypedData(data.item_16, 'ascii');
    }

    if (data.item_17 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_17] = writeTypedData(data.item_17, 'ascii');
    }

    if (data.item_18 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_18] = writeTypedData(data.item_18, 'ascii');
    }

    if (data.item_19 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_19] = writeTypedData(data.item_19, 'ascii');
    }

    if (data.item_20 !== undefined) {
      messageData[MD_MENU_PAGE_ITEM_20] = writeTypedData(data.item_20, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_MENU_PAGE,
      messageTypeName: MT_MENU_PAGE_NAME,
      header: header || {},
      data: messageData,
    };

    return new MenuPage(raw);
  }

  /**
   * The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.

   */
  get page_id(): number | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_PAGE_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Page Title
   */
  get page_title(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_PAGE_TITLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item count
   */
  get item_count(): number | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_COUNT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Optionally select a specific item, else the first will be used
   */
  get selected_item(): number | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_SELECTED_ITEM];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 1
   */
  get item_1(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_1];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 2
   */
  get item_2(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_2];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 3
   */
  get item_3(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_3];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 4
   */
  get item_4(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_4];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 5
   */
  get item_5(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_5];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 6
   */
  get item_6(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_6];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 7
   */
  get item_7(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_7];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 8
   */
  get item_8(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_8];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 9
   */
  get item_9(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_9];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 10
   */
  get item_10(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_10];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 11
   */
  get item_11(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_11];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 12
   */
  get item_12(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_12];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 13
   */
  get item_13(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_13];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 14
   */
  get item_14(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_14];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 15
   */
  get item_15(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_15];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 16
   */
  get item_16(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_16];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 17
   */
  get item_17(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_17];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 18
   */
  get item_18(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_18];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 19
   */
  get item_19(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_19];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * Get Item 20
   */
  get item_20(): string | undefined {
    const raw = this.rawMessage.data[MD_MENU_PAGE_ITEM_20];
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
  toObject(): MenuPageData {
    return {
      page_id: this.page_id,
      page_title: this.page_title,
      item_count: this.item_count,
      selected_item: this.selected_item,
      item_1: this.item_1,
      item_2: this.item_2,
      item_3: this.item_3,
      item_4: this.item_4,
      item_5: this.item_5,
      item_6: this.item_6,
      item_7: this.item_7,
      item_8: this.item_8,
      item_9: this.item_9,
      item_10: this.item_10,
      item_11: this.item_11,
      item_12: this.item_12,
      item_13: this.item_13,
      item_14: this.item_14,
      item_15: this.item_15,
      item_16: this.item_16,
      item_17: this.item_17,
      item_18: this.item_18,
      item_19: this.item_19,
      item_20: this.item_20,
    };
  }
}
