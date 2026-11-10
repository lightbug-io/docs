---
aside: true
order: 1
---

# LED guide

**Start with your device model, not the colour of a light.** ProN (PR2) and Pro3 (PR3) look alike but have different LED hardware. Zero ZE2 and ZE3 are also different generations.

Check the product code on the label or in your device details. The device ID prefix can help identify the family. If you are unsure, [contact support](https://lightbug.io/contact/) with the device ID rather than selecting a guide by appearance alone.

## Choose your model

| Device | How to identify it | Matching LED guide |
| --- | --- | --- |
| Pro3 / PR3 | Prefix 52; four orange indicators on revisions 02–04 | [Pro3 battery, charging and restart patterns](/guides/pro3-leds) |
| ProN / PR2 (legacy) | Prefix 20; four battery indicators plus GPS/mobile diagnostics | [ProN / PR2](/guides/tracker-leds#pro-pr2) |
| Zero / ZE2 / ZeroN | Prefix 19; four battery indicators plus GPS/mobile diagnostics | [Zero ZE2](/guides/tracker-leds#zero-ze2) |
| Enviro / EN2 / EnviroN | Prefix 26; four battery indicators plus GPS/mobile diagnostics | [Enviro EN2](/guides/tracker-leds#enviro-en2) |
| Vehicle / VT3 | Prefix 40; four indicators | [Vehicle battery, ignition and charging patterns](/guides/vehicle-leds) |
| Handheld RTK / RH2 | RH2 product code; RGB status display and application-controlled lights | [RH2 RGB status and application feedback](/guides/rtk-leds#handheld-rtk-rh2) |
| Vehicle RTK / VTRTK | Vehicle RTK product code; four indicators | [VTRTK battery and ignition display](/guides/rtk-leds#vehicle-rtk-vtrtk) |
| Zero3 / ZE3 | Prefix 49; four orange indicators on revision 01 | [ZE3 revision-specific guidance](/guides/ze3-leds) |

For VT2, RH1 or another earlier model, use its [legacy device documentation](/devices/history/) or ask support. Custom devices and applications can have their own LED meanings. Do not apply the table for a similar-looking model.

## Identify what is happening

1. **Just started or restarted?** Wait for startup to finish. A startup pattern is not a battery measurement or a fault code by itself.
2. **Connected to power?** Use the matching charging section. Charging, external power and ignition are different states on vehicle trackers.
3. **Pressed a button?** The device may briefly show battery or connection information and then go dark.
4. **Running an application or alarm?** Its feedback can override the standard display. For example, the RH2 Survey application's green/red flashes describe point submission, not the normal charge level.

No lights does not necessarily mean that a tracker is off. Many devices turn their lights off while resting to save power. A coloured light also does not prove that a new location has reached the server: check the latest successful communication in the app or portal.

## Restart and troubleshooting

On the older ProN/PR2, [two red lights and four orange lights can appear during a restart](/guides/tracker-leds#two-red-lights-and-four-orange-lights-after-a-restart). This is not the Pro3 layout, and it is not a universal Lightbug fault code.

Avoid repeatedly resetting a tracker based on its lights alone. If updates do not resume, follow [tracker troubleshooting](/faq/troubleshooting#why-is-my-tracker-not-transmitting). If a restart is needed, use the [model and firmware guidance](/faq/troubleshooting#restarting-a-tracker), rather than a universal button duration or beep sequence.

## When to contact support

If a pattern persists, charging does not progress, or the device stops communicating, include:

- Product code and device ID, plus hardware/firmware revision if known.
- Whether it is charging, has external power, or has just restarted.
- The latest successful communication time from the app or portal.
- A short video showing the order, colour and timing of the lights.

This guide covers normal device operation. Manufacturing tests, bootloader recovery and custom applications have separate instructions; their LED codes should not be used to diagnose a tracker in ordinary service.
