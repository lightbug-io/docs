---
aside: true
order: 1
---

# Understanding your device LEDs

Start with your device model and the situation: charging, starting up, responding to a button, or running an application. The same light can mean different things in those states.

The reusable LED features are documented as [device capabilities](/devices/capabilities/). This guide helps you choose the right capability and model-specific details rather than defining another set of LED patterns.

## Identify the device and its capabilities

Check the product code on the label or in your device details. ProN (PR2) and Pro3 (PR3) share the same external appearance but have different indicators. Zero ZE2 and ZE3 are also different generations.

| Device | LED capabilities and model details |
| --- | --- |
| [Pro3 / PR3](/devices/pro/) | [Four power LEDs](/devices/capabilities/four-power-leds); orange on revisions 02–04, without separate GPS/GSM diagnostics |
| [ProN / PR2](/devices/history/PR2) | [Four power LEDs](/devices/capabilities/four-power-leds) plus the older [GPS/GSM pair](/devices/capabilities/gps-gsm-status-leds#pro-pr2) |
| [Zero / ZE2](/devices/zero/) | [Four power LEDs](/devices/capabilities/four-power-leds) plus the older [GPS/GSM pair](/devices/capabilities/gps-gsm-status-leds#zero-ze2) |
| [Enviro / EN2](/devices/enviro/) | [Four power LEDs](/devices/capabilities/four-power-leds) plus the older [GPS/GSM pair](/devices/capabilities/gps-gsm-status-leds#enviro-en2) |
| [Vehicle / VT3](/devices/vehicle/) | [Four power LEDs](/devices/capabilities/four-power-leds), also used for its [connection display](/devices/vehicle/#vehicle-connection-status) |
| [Handheld RTK / RH2](/devices/rtk/handheld/) | [RGB status LEDs](/devices/capabilities/rgb-status-leds); see the [RH2-specific colours and application feedback](/devices/rtk/handheld/leds) |

For other devices or earlier generations, use the matching [device documentation](/devices) or [legacy pages](/devices/history/), or ask support. Do not borrow a colour table from a similar-looking device.

## Check what is happening

1. **Starting up?** Wait for startup to finish. On PR2, [two red lights and four orange lights can appear during startup](/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart). That is not the Pro3 layout or a universal fault code.
2. **Charging?** Use either [four power LED charging patterns](/devices/capabilities/four-power-leds#charging) or the [RH2 RGB charging table](/devices/rtk/handheld/leds#charging-status), as appropriate. Do not mix their thresholds.
3. **Just pressed a button?** A brief status display may finish and go dark. On VT3 the same indicators can also show ignition and charging.
4. **Running an application or alarm?** Its feedback can replace standard status. For example, [RH2 Survey submission flashes](/devices/rtk/handheld/leds#application-controlled-feedback) are application events, not battery colours.

No lights does not necessarily mean the tracker is off or empty. Many devices turn their lights off while resting to save power. A coloured light also does not prove that a new location reached the server: check the latest successful communication in the app or portal.

## If the pattern is unexpected

Check charge, mobile coverage and the latest communication time. For a GPS test, use a clear view of the sky. If a pattern persists, charging does not progress, or the device stops communicating, [contact support](https://lightbug.io/contact/) with:

- Product code and device ID, plus hardware/firmware revision if known.
- Whether the device is charging or has just started.
- The latest successful communication time.
- A short video showing the order, colour and timing of the lights.

Manufacturing tests, recovery modes and custom applications have separate instructions. This guide covers ordinary device operation.
