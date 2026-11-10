---
aside: true
---

# Zero3 (ZE3) LED indicators

This page covers the **ZE3 revision 01 design and standard firmware display**. It is not the [ZeroN/ZE2 guide](/guides/tracker-leds#zero-ze2), and does not establish which firmware is installed on a supplied ZE3. Check the revision with support if it is not known.

ZE3 revision 01 has four orange indicators and no separate GPS/mobile-network diagnostic pair. Use these four lights for the battery and charging patterns below, not the older six-indicator colour table.

## Normal battery display

<!--@include: ../.vitepress/includes/led-battery-bars.md-->

![Four orange battery indicators: below 20 percent the first flashes off charge; at least 20, 40, 60 and 80 percent shows one, two, three and four indicators.](/images/devices/general/led-battery-levels.svg)

## Charging

<!--@include: ../.vitepress/includes/led-bar-charging.md-->

## Startup and other patterns

Startup and alerts can light or sequence the same indicators. Let startup finish, then check the latest successful communication in the app or portal. Do not infer a GPS fix or a successful upload from four lit indicators.

Custom applications and remote LED control can change these patterns. For an unfamiliar or persistent display, [contact support](https://lightbug.io/contact/) with the device ID, revision and a short video. Choose another model in the [LED guide](/guides/leds).
