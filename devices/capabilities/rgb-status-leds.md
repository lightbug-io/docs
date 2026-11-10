---
aside: true
---

# RGB status LEDs

RGB status LEDs use colour and brightness to indicate device state. They are a different capability from the [four power LED bar display](/devices/capabilities/four-power-leds) and the older [GPS/GSM diagnostic pair](/devices/capabilities/gps-gsm-status-leds).

A red, green or other colour is meaningful only in the context of the model, firmware, configuration and application controlling it. There is no universal RGB colour table for all Lightbug devices.

## Devices

<CapabilityDevices capability="rgb-status-leds" />

## Standard status and application control

The same colour can be used for charging, positioning, a configured resting state, an alert or application feedback. Some devices also have separate application-controlled lights. The number and position of those lights are model-specific; the capability name does not define the physical layout.

Check the device documentation for which display takes precedence and any configurable overrides. A green light does not universally mean full battery, an RTK fix or successful data delivery.

## Interpreting a pattern

First identify the device and whether it is charging, active, or running an application that controls the lights. Then use the model's colour table. If the pattern is unfamiliar, use the [LED guide](/guides/leds) and check the latest successful communication in the app or portal.
