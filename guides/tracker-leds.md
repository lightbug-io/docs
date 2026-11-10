---
aside: true
---

# LEDs on Pro PR2, Zero ZE2 and Enviro EN2

This guide covers **Pro PR2 (firmware ProN, device ID prefix 20), Zero ZE2 (ZeroN, prefix 19) and Enviro EN2 (EnviroN, prefix 26)**. These models have four battery indicators and two separate GPS and mobile-network indicators. Check the model and device ID before using this guide.

**This is not a guide to Pro PR3 or Zero ZE3.** Those models have four MCU-controlled indicators without the separate GPS and mobile-network pairs described here. Use the [Pro3 LED guide](/guides/pro3-leds) for PR3. Do not interpret their four lights using the status information below. Vehicle, RTK and other product families also use different displays.

## Identify your model and revision

### Pro PR2 {#pro-pr2}

ProN/PR2 has four battery indicators and separate GPS and mobile-network diagnostics. The status lights use red plus an amber or yellow channel depending on the board revision. The [restart example below](#two-red-lights-and-four-orange-lights-after-a-restart) is specific to PR2. This is a legacy product; its [device page and specification](/devices/pro/) remain available.

### Zero ZE2 {#zero-ze2}

ZeroN/ZE2 uses the same battery and diagnostic logic. Revision 05 uses yellow and red diagnostic LEDs. Do not assume that a firmware channel named G means a physically green light. Follow the case icons to identify battery, GPS and mobile-network indicators. The [Zero device page](/devices/zero/) is for ZE2, not [ZE3](/guides/ze3-leds).

### Enviro EN2 {#enviro-en2}

EnviroN/EN2 uses the shared battery and diagnostic logic, but the exact diagnostic colours must be checked against the supplied board revision. Do not choose a colour chart from ProN or Zero just because the case has six indicators. See the [Enviro device page](/devices/enviro/) for the model specification, and ask support if the indicator colours differ from your supplied instructions.

## Two red lights and four orange lights after a restart

::: tip This can be normal
On a Pro PR2, two red status lights together with all four orange battery lights can appear during a restart. This pattern alone does not mean that the tracker is faulty, or that its battery is full.
:::

![Six-indicator restart example: four orange battery lights on the left, followed by red GPS and mobile-network lights. The diagram labels every light and is not a fault code.](/images/devices/general/led-restart.svg)

The tracker can restart automatically as well as after a reset. Startup lights may change or run across the battery indicators before the normal status display returns. The exact sequence depends on the hardware, firmware and reason for the restart.

**What should I do?**

1. Let the tracker finish starting and give it a couple of minutes to communicate. Avoid repeatedly resetting it just because the lights are red.
2. Check its latest communication or update time in the app or web portal. A recent successful update is more useful than a snapshot of the lights. An old location on the map does not by itself show whether the tracker has just communicated.
3. If updates do not resume, check the charge, data plan and mobile coverage, then follow [tracker troubleshooting](/faq/troubleshooting#why-is-my-tracker-not-transmitting). For a GPS test, place it outside with a clear view of the sky.

If the same pattern persists, keeps returning, or the tracker is not communicating, [contact support](https://lightbug.io/contact/). Include the device ID, when you saw it, whether it was on charge, its last update time, and a short video showing whether the lights are steady or flashing.

## Reading the normal display

The diagrams are illustrative layouts. Use the icons on the case to identify the lights. The four battery lights are separate from the GPS and mobile-network lights. Red status lights are diagnostic information, not a general device-failure warning.

A short button press shows the status briefly. Lights may also appear during startup, charging or other device activity. When the tracker is unplugged and resting, the lights normally go out to save power. **No lights does not necessarily mean that the tracker is off or the battery is empty.**

### Battery indicators

<!--@include: ../.vitepress/includes/led-battery-bars.md-->

![Illustrated battery bands: below 20 percent the first indicator flashes off charge; at least 20, 40, 60 and 80 percent shows one, two, three and four indicators.](/images/devices/general/led-battery-levels.svg)

### GPS and mobile-network indicators

Use the model/revision notes above to identify the **secondary diagnostic colour**. It is not universally green. Both channels can be on together; this does not establish a third, universal mixed colour.

| Mobile-network indicator | What the standard display can mean |
| --- | --- |
| Red only | Flight mode is enabled, or signal strength is zero/unknown while the connection is not open |
| Red and secondary colour together | One signal bar is reported and the connection is not open, with flight mode off |
| Secondary colour only | At least two signal bars are reported or the connection is open, with flight mode off |

The mobile indicator is not confirmation that data reached the server. Check the latest successful communication in the app or portal.

| GPS indicator while the receiver is awake | What the standard display can mean |
| --- | --- |
| Red only | No fix yet, before the waiting-for-fix stage |
| Red and secondary colour together | Waiting for a fix, without a lock yet |
| Secondary colour only | A fix is available, or the receiver has moved beyond the waiting-for-fix stage |

When GPS is asleep, its indicator can reflect whether the **previous** fix attempt failed rather than whether there is a live fix now. A secondary-colour light alone is therefore not a guarantee of a current accurate location. Check the location timestamp and accuracy in the app or portal.

## Charging patterns

<!--@include: ../.vitepress/includes/led-bar-charging.md-->

![Charging example at three bars: two steady battery lights and a third that alternates on and off every second. This animation is shown as two static frames.](/images/devices/general/led-charging.svg)

This guide describes the standard six-indicator display. Custom applications, remote LED control, alarms and other hardware versions can change the lights. If your tracker has a different layout, choose the matching model in the [LED guide](/guides/leds) or ask support.
