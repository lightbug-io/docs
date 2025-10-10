// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Draw Element
 */
export const MT_DRAW_ELEMENT = 10011;

/**
 * Message type name for Draw Element
 */
export const MT_DRAW_ELEMENT_NAME = 'Draw Element';

/**
 * Field ID constants
 */
export const MD_DRAW_ELEMENT_PAGE_ID = 3;
export const MD_DRAW_ELEMENT_STATUS_BAR_ENABLE = 5;
export const MD_DRAW_ELEMENT_REDRAW_TYPE = 6;
export const MD_DRAW_ELEMENT_X = 7;
export const MD_DRAW_ELEMENT_Y = 8;
export const MD_DRAW_ELEMENT_WIDTH = 9;
export const MD_DRAW_ELEMENT_HEIGHT = 10;
export const MD_DRAW_ELEMENT_TYPE = 11;
export const MD_DRAW_ELEMENT_STYLE = 12;
export const MD_DRAW_ELEMENT_FONTSIZE = 13;
export const MD_DRAW_ELEMENT_TEXTALIGN = 14;
export const MD_DRAW_ELEMENT_LINEWIDTH = 15;
export const MD_DRAW_ELEMENT_PADDING = 16;
export const MD_DRAW_ELEMENT_RADIUS = 17;
export const MD_DRAW_ELEMENT_LINETYPE = 18;
export const MD_DRAW_ELEMENT_X2 = 19;
export const MD_DRAW_ELEMENT_Y2 = 20;
export const MD_DRAW_ELEMENT_BITMAP = 25;
export const MD_DRAW_ELEMENT_TEXT = 100;

/**
 * Redraw Type values
 */
export enum DrawElement_RedrawType {
  AUTO = 0,
  PARTIALREDRAW = 1,
  FULLREDRAW = 2,
  BUFFERONLY = 3,
  FULLREDRAWWITHOUTCLEAR = 4,
  CLEARDONTDRAW = 5
}

export const DrawElement_RedrawTypeNames: Record<number, string> = {
  0: 'Auto',
  1: 'PartialRedraw',
  2: 'FullRedraw',
  3: 'BufferOnly',
  4: 'FullRedrawWithoutClear',
  5: 'ClearDontDraw'
};

/**
 * Type values
 */
export enum DrawElement_Type {
  BOX = 0,
  CIRCLE = 1,
  LINE = 2,
  BITMAP = 3
}

export const DrawElement_TypeNames: Record<number, string> = {
  0: 'Box',
  1: 'Circle',
  2: 'Line',
  3: 'Bitmap'
};

/**
 * Style values
 */
export enum DrawElement_Style {
  BLACKONCLEAR = 0,
  WHITEONBLACK = 1,
  BLACKOUTLINE = 2,
  WHITEOUTLINE = 3
}

export const DrawElement_StyleNames: Record<number, string> = {
  0: 'BlackOnClear',
  1: 'WhiteOnBlack',
  2: 'BlackOutline',
  3: 'WhiteOutline'
};

/**
 * FontSize values
 */
export enum DrawElement_FontSize {
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2
}

export const DrawElement_FontSizeNames: Record<number, string> = {
  0: 'Small',
  1: 'Medium',
  2: 'Large'
};

/**
 * TextAlign values
 */
export enum DrawElement_TextAlign {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export const DrawElement_TextAlignNames: Record<number, string> = {
  0: 'Left',
  1: 'Middle',
  2: 'Right'
};

/**
 * LineType values
 */
export enum DrawElement_LineType {
  SOLID = 0,
  DASHED = 1
}

export const DrawElement_LineTypeNames: Record<number, string> = {
  0: 'Solid',
  1: 'Dashed'
};

/**
 * Data interface for Draw Element message
 */
export interface DrawElementData {
  /** The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.
 */
  page_id?: number;
  /** Show the status bar */
  status_bar_enable?: boolean;
  redraw_type?: number;
  /** X coordinate for the start of the element. If padded, this is the start of the padded area. */
  x?: number;
  /** Y coordinate for the start of the element. If padded, this is the start of the padded area. */
  y?: number;
  /** Width of the element. If padded this does not include the padding. */
  width?: number;
  /** Height of the element. If padded this does not include the padding. */
  height?: number;
  /** Type of element to draw */
  type?: number;
  /** Style of the element to draw. Default is BlackOnClear. */
  style?: number;
  /** Size of the font to use. Default is Medium. */
  fontsize?: number;
  /** Alignment of the text. Default is Middle. */
  textalign?: number;
  /** Default is 1. Max is 8. */
  linewidth?: number;
  /** Padding inside the element (in terms of x and y). Default is 0. */
  padding?: number;
  /** For use with circle, or corner rounding. Default is 0. */
  radius?: number;
  /** Default is Solid. */
  linetype?: number;
  /** Second X coordinate, primarily for lines. Min 0, Max WIDTH -1. */
  x2?: number;
  /** Second Y coordinate, primarily for lines. Min 0, Max HEIGHT -1. */
  y2?: number;
  bitmap?: number[];
  text?: string;
}

/**
 * Draw Element
 * Draw an element
 * Group: screen
 */
export class DrawElement extends ProtocolMessage {
  readonly messageType = MT_DRAW_ELEMENT;
  readonly messageTypeName = MT_DRAW_ELEMENT_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): DrawElement {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_DRAW_ELEMENT) {
      throw new Error(`Expected message type ${MT_DRAW_ELEMENT}, got ${raw.messageType}`);
    }
    return new DrawElement(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: DrawElementData, header?: HeaderData): DrawElement {
    const messageData: MessageData = {};

    if (data.page_id !== undefined) {
      messageData[MD_DRAW_ELEMENT_PAGE_ID] = writeTypedData(data.page_id, 'uint8');
    }

    if (data.status_bar_enable !== undefined) {
      messageData[MD_DRAW_ELEMENT_STATUS_BAR_ENABLE] = writeTypedData(data.status_bar_enable, 'bool');
    }

    if (data.redraw_type !== undefined) {
      messageData[MD_DRAW_ELEMENT_REDRAW_TYPE] = writeTypedData(data.redraw_type, 'uint8');
    }

    if (data.x !== undefined) {
      messageData[MD_DRAW_ELEMENT_X] = writeTypedData(data.x, 'uint');
    }

    if (data.y !== undefined) {
      messageData[MD_DRAW_ELEMENT_Y] = writeTypedData(data.y, 'uint');
    }

    if (data.width !== undefined) {
      messageData[MD_DRAW_ELEMENT_WIDTH] = writeTypedData(data.width, 'uint');
    }

    if (data.height !== undefined) {
      messageData[MD_DRAW_ELEMENT_HEIGHT] = writeTypedData(data.height, 'uint');
    }

    if (data.type !== undefined) {
      messageData[MD_DRAW_ELEMENT_TYPE] = writeTypedData(data.type, 'uint8');
    }

    if (data.style !== undefined) {
      messageData[MD_DRAW_ELEMENT_STYLE] = writeTypedData(data.style, 'uint8');
    }

    if (data.fontsize !== undefined) {
      messageData[MD_DRAW_ELEMENT_FONTSIZE] = writeTypedData(data.fontsize, 'uint8');
    }

    if (data.textalign !== undefined) {
      messageData[MD_DRAW_ELEMENT_TEXTALIGN] = writeTypedData(data.textalign, 'uint8');
    }

    if (data.linewidth !== undefined) {
      messageData[MD_DRAW_ELEMENT_LINEWIDTH] = writeTypedData(data.linewidth, 'uint8');
    }

    if (data.padding !== undefined) {
      messageData[MD_DRAW_ELEMENT_PADDING] = writeTypedData(data.padding, 'uint8');
    }

    if (data.radius !== undefined) {
      messageData[MD_DRAW_ELEMENT_RADIUS] = writeTypedData(data.radius, 'uint8');
    }

    if (data.linetype !== undefined) {
      messageData[MD_DRAW_ELEMENT_LINETYPE] = writeTypedData(data.linetype, 'uint8');
    }

    if (data.x2 !== undefined) {
      messageData[MD_DRAW_ELEMENT_X2] = writeTypedData(data.x2, 'uint');
    }

    if (data.y2 !== undefined) {
      messageData[MD_DRAW_ELEMENT_Y2] = writeTypedData(data.y2, 'uint');
    }

    if (data.bitmap !== undefined) {
      messageData[MD_DRAW_ELEMENT_BITMAP] = writeTypedData(data.bitmap, 'bytes');
    }

    if (data.text !== undefined) {
      messageData[MD_DRAW_ELEMENT_TEXT] = writeTypedData(data.text, 'ascii');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_DRAW_ELEMENT,
      messageTypeName: MT_DRAW_ELEMENT_NAME,
      header: header || {},
      data: messageData,
    };

    return new DrawElement(raw);
  }

  /**
   * The page to draw or update.
Page ids 0-10 are reserved for system use.
If no page id is provided, page id 11 will be assumed.

   */
  get page_id(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_PAGE_ID];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Show the status bar
   */
  get status_bar_enable(): boolean | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_STATUS_BAR_ENABLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
    return value !== null ? value : undefined;
  }

  /**
   * Get Redraw Type
   */
  get redraw_type(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_REDRAW_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_RedrawTypeNames[value] || 'unknown';
  }

  /**
   * Get Redraw Type (raw enum value)
   */
  get redraw_typeRaw(): DrawElement_RedrawType | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_REDRAW_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * X coordinate for the start of the element. If padded, this is the start of the padded area.
   */
  get x(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_X];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Y coordinate for the start of the element. If padded, this is the start of the padded area.
   */
  get y(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_Y];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Width of the element. If padded this does not include the padding.
   */
  get width(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_WIDTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Height of the element. If padded this does not include the padding.
   */
  get height(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_HEIGHT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Type of element to draw
   */
  get type(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_TypeNames[value] || 'unknown';
  }

  /**
   * Get Type (raw enum value)
   */
  get typeRaw(): DrawElement_Type | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_TYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Style of the element to draw. Default is BlackOnClear.
   */
  get style(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_STYLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_StyleNames[value] || 'unknown';
  }

  /**
   * Get Style (raw enum value)
   */
  get styleRaw(): DrawElement_Style | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_STYLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Size of the font to use. Default is Medium.
   */
  get fontsize(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_FONTSIZE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_FontSizeNames[value] || 'unknown';
  }

  /**
   * Get FontSize (raw enum value)
   */
  get fontsizeRaw(): DrawElement_FontSize | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_FONTSIZE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Alignment of the text. Default is Middle.
   */
  get textalign(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_TEXTALIGN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_TextAlignNames[value] || 'unknown';
  }

  /**
   * Get TextAlign (raw enum value)
   */
  get textalignRaw(): DrawElement_TextAlign | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_TEXTALIGN];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Default is 1. Max is 8.
   */
  get linewidth(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_LINEWIDTH];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Padding inside the element (in terms of x and y). Default is 0.
   */
  get padding(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_PADDING];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * For use with circle, or corner rounding. Default is 0.
   */
  get radius(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_RADIUS];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value !== null ? value : undefined;
  }

  /**
   * Default is Solid.
   */
  get linetype(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_LINETYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return DrawElement_LineTypeNames[value] || 'unknown';
  }

  /**
   * Get LineType (raw enum value)
   */
  get linetypeRaw(): DrawElement_LineType | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_LINETYPE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint8');
    return value;
  }

  /**
   * Second X coordinate, primarily for lines. Min 0, Max WIDTH -1.
   */
  get x2(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_X2];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Second Y coordinate, primarily for lines. Min 0, Max HEIGHT -1.
   */
  get y2(): number | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_Y2];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint');
    return value !== null ? value : undefined;
  }

  /**
   * Get Bitmap
   */
  get bitmap(): number[] | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_BITMAP];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bytes');
    return value !== null ? value : undefined;
  }

  /**
   * Get Text
   */
  get text(): string | undefined {
    const raw = this.rawMessage.data[MD_DRAW_ELEMENT_TEXT];
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
  toObject(): DrawElementData {
    return {
      page_id: this.page_id,
      status_bar_enable: this.status_bar_enable,
      redraw_type: this.redraw_typeRaw,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: this.typeRaw,
      style: this.styleRaw,
      fontsize: this.fontsizeRaw,
      textalign: this.textalignRaw,
      linewidth: this.linewidth,
      padding: this.padding,
      radius: this.radius,
      linetype: this.linetypeRaw,
      x2: this.x2,
      y2: this.y2,
      bitmap: this.bitmap,
      text: this.text,
    };
  }
}
