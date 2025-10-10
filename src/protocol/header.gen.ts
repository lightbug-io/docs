// Auto-generated header field types
// DO NOT EDIT - This file is generated from the protocol spec

/**
 * Header field type constants
 */
export enum HeaderFieldType {
  MESSAGE_ID = 1,
  CLIENT_ID = 2,
  RESPONSE_TO = 3,
  STATUS = 4,
  METHOD = 5,
  INTERVAL = 6,
  DURATION = 7,
  TIMEOUT = 8,
  FORWARD_FOR_TYPE = 9,
  FORWARDED_FOR = 10,
  FORWARDED_RSSI = 11,
  FORWARDED_SNR = 12,
  FORWARDING_TO_TYPE = 13,
  FORWARD_TO = 14,
  STORAGE_LEVEL = 15,
  MESSAGE_LEVEL = 16,
  RECEIVED_TIME = 100
}

/**
 * Status values
 */
export enum Status {
  OK = 0,
  GENERIC_ERROR = 1,
  MISSING_PAYLOAD_PARAMETER = 2,
  METHOD_NOT_SUPPORTED = 3,
  INVALID_PAYLOAD_PARAMETER = 4,
  INVALID_STATE = 5,
  NO_DATA = 6,
  NOT_SUPPORTED = 7,
  FAILED_WILL_RETRY = 8,
  FAILED_PERMANENTLY = 9,
  ABANDONED = 10,
  EXPIRED = 11
}

export const StatusNames: Record<number, string> = {
  0: 'OK',
  1: 'Generic Error',
  2: 'Missing Payload Parameter',
  3: 'Method Not Supported',
  4: 'Invalid Payload Parameter',
  5: 'Invalid State',
  6: 'No Data',
  7: 'Not Supported',
  8: 'Failed Will Retry',
  9: 'Failed Permanently',
  10: 'Abandoned',
  11: 'Expired'
};

/**
 * Method values
 */
export enum Method {
  SET = 1,
  GET = 2,
  SUBSCRIBE = 3,
  UNSUBSCRIBE = 5
}

export const MethodNames: Record<number, string> = {
  1: 'SET',
  2: 'GET',
  3: 'SUBSCRIBE',
  5: 'UNSUBSCRIBE'
};

/**
 * Forward For Type values
 */
export enum ForwardForType {
  LORA = 1,
  I2C = 2,
  CLOUD = 3
}

export const ForwardForTypeNames: Record<number, string> = {
  1: 'LoRa',
  2: 'I2C',
  3: 'Cloud'
};

/**
 * Forwarding To Type values
 */
export enum ForwardingToType {
  LORA = 1,
  I2C = 2,
  CLOUD = 3
}

export const ForwardingToTypeNames: Record<number, string> = {
  1: 'LoRa',
  2: 'I2C',
  3: 'Cloud'
};

/**
 * Storage Level values
 */
export enum StorageLevel {
  NONE = 0,
  RAM = 10,
  NVM = 20
}

export const StorageLevelNames: Record<number, string> = {
  0: 'None',
  10: 'RAM',
  20: 'NVM'
};

/**
 * Message Level values
 */
export enum MessageLevel {
  INFO_WATCH = 1,
  INFO_AUTO = 2,
  VALID = 10
}

export const MessageLevelNames: Record<number, string> = {
  1: 'Info-Watch',
  2: 'Info-Auto',
  10: 'Valid'
};
