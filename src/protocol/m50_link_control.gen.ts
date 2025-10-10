// Auto-generated class for protocol message
// DO NOT EDIT - This file is generated from the protocol spec

import { ProtocolMessage, V3Message, MessageData, HeaderData, readTypedData, writeTypedData, parseRawMessage, messageToBytesHelper } from './base.gen';

/**
 * Message type ID for Link Control
 */
export const MT_LINK_CONTROL = 50;

/**
 * Message type name for Link Control
 */
export const MT_LINK_CONTROL_NAME = 'Link Control';

/**
 * Field ID constants
 */
export const MD_LINK_CONTROL_IP_ADDRESS = 1;
export const MD_LINK_CONTROL_PORT = 2;
export const MD_LINK_CONTROL_ENABLE = 3;

/**
 * Data interface for Link Control message
 */
export interface LinkControlData {
  /** IP Address of the link */
  ip_address?: string;
  /** UDP Port for the link */
  port?: number;
  /** Enable or disable the link */
  enable?: boolean;
}

/**
 * Link Control
 * Control a link to the internet to send and receive messages.
Used to control a remote device link, such as connecting to a UDP server, and using the V3 messaging protocol to communicate with it.
Once initiated, messages can be forwarded to the link directly using the forwarding headers.

 * Group: gsm
 */
export class LinkControl extends ProtocolMessage {
  readonly messageType = MT_LINK_CONTROL;
  readonly messageTypeName = MT_LINK_CONTROL_NAME;

  constructor(
    private rawMessage: V3Message,
  ) {
    super();
  }

  /**
   * Parse message from byte array
   */
  static fromBytes(bytes: number[]): LinkControl {
    const raw = parseRawMessage(bytes);
    if (raw.messageType !== MT_LINK_CONTROL) {
      throw new Error(`Expected message type ${MT_LINK_CONTROL}, got ${raw.messageType}`);
    }
    return new LinkControl(raw);
  }

  /**
   * Create message from data object
   */
  static fromData(data: LinkControlData, header?: HeaderData): LinkControl {
    const messageData: MessageData = {};

    if (data.ip_address !== undefined) {
      messageData[MD_LINK_CONTROL_IP_ADDRESS] = writeTypedData(data.ip_address, 'ascii');
    }

    if (data.port !== undefined) {
      messageData[MD_LINK_CONTROL_PORT] = writeTypedData(data.port, 'uint16');
    }

    if (data.enable !== undefined) {
      messageData[MD_LINK_CONTROL_ENABLE] = writeTypedData(data.enable, 'bool');
    }

    const raw: V3Message = {
      protocolVersion: 3,
      length: 0, // Will be calculated
      messageType: MT_LINK_CONTROL,
      messageTypeName: MT_LINK_CONTROL_NAME,
      header: header || {},
      data: messageData,
    };

    return new LinkControl(raw);
  }

  /**
   * IP Address of the link
   */
  get ip_address(): string | undefined {
    const raw = this.rawMessage.data[MD_LINK_CONTROL_IP_ADDRESS];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'ascii');
    return value !== null ? value : undefined;
  }

  /**
   * UDP Port for the link
   */
  get port(): number | undefined {
    const raw = this.rawMessage.data[MD_LINK_CONTROL_PORT];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'uint16');
    return value !== null ? value : undefined;
  }

  /**
   * Enable or disable the link
   */
  get enable(): boolean | undefined {
    const raw = this.rawMessage.data[MD_LINK_CONTROL_ENABLE];
    if (!raw) return undefined;
    const value = readTypedData(raw, 'bool');
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
  toObject(): LinkControlData {
    return {
      ip_address: this.ip_address,
      port: this.port,
      enable: this.enable,
    };
  }
}
