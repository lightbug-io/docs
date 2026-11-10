---
aside: true
---

# Vehicle (VT3) LED indicators

This guide covers **Vehicle VT3, device ID prefix 40**, using the standard four-indicator firmware display. It does not describe the older [Vehicle VT2](/devices/history/VT2) or the RGB display on an RH2 handheld.

## Normal battery display

<!--@include: ../.vitepress/includes/led-battery-bars.md-->

## Charging

<!--@include: ../.vitepress/includes/led-bar-charging.md-->

The vehicle connection display below temporarily uses the same indicators for a different purpose. There is no universal blue-light check for VT3 installation: use the matching pattern and the reported power/ignition state.

## Vehicle connection status

After showing battery status, a short status-button press shows ignition and charging information in **five brief flash cycles**, about 0.3 seconds on and 0.2 seconds off:

| Indicator pair | Flashes when |
| --- | --- |
| 1 and 2 | The device detects ignition high |
| 3 and 4 | The device reports that it is charging |

Both pairs can flash when both conditions are true. These are logical indicator numbers, not a left-to-right enclosure diagram. The diagram below does not assert the physical colour or orientation for a hardware revision.

![Vehicle connection pattern: indicators 1 and 2 flash for ignition high, indicators 3 and 4 for charging, and all four for both. Five cycles, about 0.3 seconds on and 0.2 seconds off. Neutral shading indicates on and is not an LED colour.](/images/devices/general/led-vehicle-status.svg)

The display can also appear when charging starts or ignition becomes high. Paired flashing can therefore be normal. External power does not always mean the battery is currently charging, so an unlit charging pair alone is not proof of a wiring fault.

Follow the [installation checks](/devices/vehicle/installation#step-8-check-functionality) and confirm the reported external-power and ignition state where available. If those readings do not match the wiring, ask support before changing the installation.

## Startup and other patterns

Startup, alarms and custom applications can use the same four lights. Wait for startup to finish and check the latest successful communication in the app or portal. Do not interpret an unfamiliar pattern as a battery level or as the Pro3 charger-protection pattern.

For another product, use the [LED guide by model](/guides/leds). For persistent unexpected behaviour, send [support](https://lightbug.io/contact/) the device ID, hardware revision if known, power/ignition state and a short video.
