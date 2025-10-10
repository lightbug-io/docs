// Auto-generated index file for protocol messages
// DO NOT EDIT - This file is generated from the protocol spec

export * from './base.gen';
export * from './header.gen';

export * from './m5_ack.gen';
export * from './m11_open.gen';
export * from './m12_close.gen';
export * from './m13_heartbeat.gen';
export * from './m14_config.gen';
export * from './m15_position.gen';
export * from './m16_satellite_data.gen';
export * from './m30_transmit_now.gen';
export * from './m31_gsm_control.gen';
export * from './m32_gsm_request_ownership.gen';
export * from './m33_change_sim_settings.gen';
export * from './m34_device_status.gen';
export * from './m35_device_ids.gen';
export * from './m36_device_time.gen';
export * from './m38_button_press.gen';
export * from './m39_gps_control.gen';
export * from './m40_haptics_control.gen';
export * from './m41_temperature.gen';
export * from './m42_buzzer_control.gen';
export * from './m43_battery_status.gen';
export * from './m44_pressure.gen';
export * from './m45_alarm.gen';
export * from './m46_buzzer_sequence.gen';
export * from './m47_cpu2_sleep.gen';
export * from './m48_power_profile.gen';
export * from './m49_cpu1_reset.gen';
export * from './m50_link_control.gen';
export * from './m53_protection_level.gen';
export * from './m54_charger_settings.gen';
export * from './m55_wifi_scan.gen';
export * from './m56_ble_scan.gen';
export * from './m1004_lora.gen';
export * from './m2000_rtcm_data.gen';
export * from './m10008_base_page.gen';
export * from './m10009_text_page.gen';
export * from './m10010_menu_page.gen';
export * from './m10011_draw_element.gen';

// Message type registry
import { ProtocolMessage, parseRawMessage } from './base.gen';
import { ACK, MT_ACK } from './m5_ack.gen';
import { Open, MT_OPEN } from './m11_open.gen';
import { Close, MT_CLOSE } from './m12_close.gen';
import { Heartbeat, MT_HEARTBEAT } from './m13_heartbeat.gen';
import { Config, MT_CONFIG } from './m14_config.gen';
import { Position, MT_POSITION } from './m15_position.gen';
import { SatelliteData, MT_SATELLITE_DATA } from './m16_satellite_data.gen';
import { TransmitNow, MT_TRANSMIT_NOW } from './m30_transmit_now.gen';
import { GSMControl, MT_GSM_CONTROL } from './m31_gsm_control.gen';
import { GSMRequestOwnership, MT_GSM_REQUEST_OWNERSHIP } from './m32_gsm_request_ownership.gen';
import { ChangeSIMsettings, MT_CHANGE_SIM_SETTINGS } from './m33_change_sim_settings.gen';
import { DeviceStatus, MT_DEVICE_STATUS } from './m34_device_status.gen';
import { DeviceIDs, MT_DEVICE_IDS } from './m35_device_ids.gen';
import { DeviceTime, MT_DEVICE_TIME } from './m36_device_time.gen';
import { ButtonPress, MT_BUTTON_PRESS } from './m38_button_press.gen';
import { GPSControl, MT_GPS_CONTROL } from './m39_gps_control.gen';
import { HapticsControl, MT_HAPTICS_CONTROL } from './m40_haptics_control.gen';
import { Temperature, MT_TEMPERATURE } from './m41_temperature.gen';
import { BuzzerControl, MT_BUZZER_CONTROL } from './m42_buzzer_control.gen';
import { BatteryStatus, MT_BATTERY_STATUS } from './m43_battery_status.gen';
import { Pressure, MT_PRESSURE } from './m44_pressure.gen';
import { Alarm, MT_ALARM } from './m45_alarm.gen';
import { BuzzerSequence, MT_BUZZER_SEQUENCE } from './m46_buzzer_sequence.gen';
import { CPU2Sleep, MT_CPU2_SLEEP } from './m47_cpu2_sleep.gen';
import { PowerProfile, MT_POWER_PROFILE } from './m48_power_profile.gen';
import { CPU1Reset, MT_CPU1_RESET } from './m49_cpu1_reset.gen';
import { LinkControl, MT_LINK_CONTROL } from './m50_link_control.gen';
import { ProtectionLevel, MT_PROTECTION_LEVEL } from './m53_protection_level.gen';
import { ChargerSettings, MT_CHARGER_SETTINGS } from './m54_charger_settings.gen';
import { WiFiScan, MT_WIFI_SCAN } from './m55_wifi_scan.gen';
import { BLEScan, MT_BLE_SCAN } from './m56_ble_scan.gen';
import { LORA, MT_LORA } from './m1004_lora.gen';
import { RTCMData, MT_RTCM_DATA } from './m2000_rtcm_data.gen';
import { BasePage, MT_BASE_PAGE } from './m10008_base_page.gen';
import { TextPage, MT_TEXT_PAGE } from './m10009_text_page.gen';
import { MenuPage, MT_MENU_PAGE } from './m10010_menu_page.gen';
import { DrawElement, MT_DRAW_ELEMENT } from './m10011_draw_element.gen';

/**
 * Factory function to create message from bytes
 */
export function parseMessage(bytes: number[]): ProtocolMessage {
  const raw = parseRawMessage(bytes);
  switch (raw.messageType) {
    case MT_ACK:
      return ACK.fromBytes(bytes);
    case MT_OPEN:
      return Open.fromBytes(bytes);
    case MT_CLOSE:
      return Close.fromBytes(bytes);
    case MT_HEARTBEAT:
      return Heartbeat.fromBytes(bytes);
    case MT_CONFIG:
      return Config.fromBytes(bytes);
    case MT_POSITION:
      return Position.fromBytes(bytes);
    case MT_SATELLITE_DATA:
      return SatelliteData.fromBytes(bytes);
    case MT_TRANSMIT_NOW:
      return TransmitNow.fromBytes(bytes);
    case MT_GSM_CONTROL:
      return GSMControl.fromBytes(bytes);
    case MT_GSM_REQUEST_OWNERSHIP:
      return GSMRequestOwnership.fromBytes(bytes);
    case MT_CHANGE_SIM_SETTINGS:
      return ChangeSIMsettings.fromBytes(bytes);
    case MT_DEVICE_STATUS:
      return DeviceStatus.fromBytes(bytes);
    case MT_DEVICE_IDS:
      return DeviceIDs.fromBytes(bytes);
    case MT_DEVICE_TIME:
      return DeviceTime.fromBytes(bytes);
    case MT_BUTTON_PRESS:
      return ButtonPress.fromBytes(bytes);
    case MT_GPS_CONTROL:
      return GPSControl.fromBytes(bytes);
    case MT_HAPTICS_CONTROL:
      return HapticsControl.fromBytes(bytes);
    case MT_TEMPERATURE:
      return Temperature.fromBytes(bytes);
    case MT_BUZZER_CONTROL:
      return BuzzerControl.fromBytes(bytes);
    case MT_BATTERY_STATUS:
      return BatteryStatus.fromBytes(bytes);
    case MT_PRESSURE:
      return Pressure.fromBytes(bytes);
    case MT_ALARM:
      return Alarm.fromBytes(bytes);
    case MT_BUZZER_SEQUENCE:
      return BuzzerSequence.fromBytes(bytes);
    case MT_CPU2_SLEEP:
      return CPU2Sleep.fromBytes(bytes);
    case MT_POWER_PROFILE:
      return PowerProfile.fromBytes(bytes);
    case MT_CPU1_RESET:
      return CPU1Reset.fromBytes(bytes);
    case MT_LINK_CONTROL:
      return LinkControl.fromBytes(bytes);
    case MT_PROTECTION_LEVEL:
      return ProtectionLevel.fromBytes(bytes);
    case MT_CHARGER_SETTINGS:
      return ChargerSettings.fromBytes(bytes);
    case MT_WIFI_SCAN:
      return WiFiScan.fromBytes(bytes);
    case MT_BLE_SCAN:
      return BLEScan.fromBytes(bytes);
    case MT_LORA:
      return LORA.fromBytes(bytes);
    case MT_RTCM_DATA:
      return RTCMData.fromBytes(bytes);
    case MT_BASE_PAGE:
      return BasePage.fromBytes(bytes);
    case MT_TEXT_PAGE:
      return TextPage.fromBytes(bytes);
    case MT_MENU_PAGE:
      return MenuPage.fromBytes(bytes);
    case MT_DRAW_ELEMENT:
      return DrawElement.fromBytes(bytes);
    default:
      throw new Error(`Unknown message type: ${raw.messageType}`);
  }
}
