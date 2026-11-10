---
aside: true
---

# Pro3 LED indicators

This guide covers the four orange indicators on **Pro3 (PR3), hardware revisions 02–04**, with the standard firmware display. The diagrams illustrate the patterns, not the physical orientation of the case.

Looking for the older six-indicator Pro? Use [ProN/PR2 LED guidance](/guides/tracker-leds) instead. See the [Pro3 device page](/devices/pro/pro3) for the generation comparison.

## What the lights show

Pro3 hardware revisions 02–04 have four orange indicators. They show battery status and charging progress, and are also used during startup and for alerts. There are no separate GPS and mobile-network status indicators.

**Four lights do not always mean a full battery.** First check whether the tracker has just restarted, is showing normal battery status or is charging.

## Normal battery display

<!--@include: ../.vitepress/includes/led-battery-bars.md-->

![Four-light battery display: below 20 percent the first light flashes off charge; at least 20, 40, 60 and 80 percent shows one, two, three and four lights respectively.](/images/devices/general/led-battery-levels.svg)

## Charging

<!--@include: ../.vitepress/includes/led-bar-charging.md-->

![Charging shown in two frames: at three bars the first two lights stay on, the third alternates on and off about every second, and the fourth stays off.](/images/devices/general/led-charging.svg)

The charger can also trigger a protection pattern that differs from the normal charging blink. If two lights keep flashing together or charging does not progress, contact [support](https://lightbug.io/contact/) with a video and details of the charging accessory. Do not treat every flashing pattern as a battery reading.

## After a restart

Startup can light all four indicators or run a sequence across them. The exact sequence depends on the firmware and reset reason, so a photograph of the startup lights is not a fault diagnosis or a charge measurement.

Let the device finish starting, then check its latest successful communication in the app or portal. If updates do not resume, check charge, data plan and mobile coverage, then follow [tracker troubleshooting](/faq/troubleshooting#why-is-my-tracker-not-transmitting). Avoid repeated resets based only on the lights.

## Other patterns

Alarms, custom applications and remote LED control can override the standard display. Use your application's instructions when it controls the lights. For an unfamiliar or persistent pattern, include the device ID, hardware revision if known, charging state and a short video when contacting support.

Choose another model in the [LED guide](/guides/leds).
