---
aside: true
---

# Pro

The current Pro is Pro3 (PR3), a different hardware generation from [ProN (PR2)](/devices/history/PR2). The two generations share the same external appearance, so use the product code and hardware revision to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.

## Feature guides {#capabilities}

<DeviceCapabilities device="PR3" />

Pro3 does not have the separate [GPS and GSM status LEDs](/devices/capabilities/gps-gsm-status-leds) used by the older ProN/PR2. Use the product code and revision, not the enclosure appearance, to choose the matching documentation.

## Images

![Pro3 tracker enclosure](https://upload.r2.lb.chasm.cloud/2025/10/product-front/LB-DEV-PR2.png)

The enclosure image is shared with ProN/PR2. It does not identify the internal electronics or LED layout.

## Hardware generations

| Generation | LED layout | Documentation |
| --- | --- | --- |
| Pro3 / PR3 (current) | Four orange indicators on revisions 02–04 | This page |
| ProN / PR2 (legacy) | Four battery indicators plus two diagnostic indicators | [PR2 archive](/devices/history/PR2) |

This is a generation guide, not a complete Pro3 specification. Cellular bands, wireless features, charging limits and certifications must be checked for the supplied Pro3 revision. The [PR2 specification download](/devices/history/PR2) applies to PR2 only.

## LED indicators

The [four power LED capability](/devices/capabilities/four-power-leds) defines the normal battery and charging patterns. On revisions 02–04 these indicators are orange. They are also used during startup and for alerts, so four lit indicators are not always a battery reading.

There is no separate GPS/mobile-network colour table on Pro3. The older [PR2 example of two red and four orange lights](/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart) is not this model’s layout. Use the [LED guide](/guides/leds) for the first checks when a pattern is unfamiliar.

### Charger protection

The charger can trigger a protection pattern that differs from the normal charging blink. If two lights keep flashing together or charging does not progress, contact [support](https://lightbug.io/contact/) with a video and details of the charging accessory. Do not treat every flashing pattern as a battery reading.

## Charging

Use the charging accessory and power supply specified for your Pro3 revision. Do not apply PR2 voltage/current ratings or charging-time instructions to Pro3.

See [four power LED charging patterns](/devices/capabilities/four-power-leds#charging) for the normal blinking and steady states. A steady high-charge display is not an exact 100% reading.

## Earlier Pro generations {#pro-pr2}

The [ProN/PR2 archive](/devices/history/PR2) contains its specifications, images and diagnostic-light information. PR2 is no longer in production.

## Get help

For specifications or troubleshooting, [contact support](https://lightbug.io/contact/) with the product code, device ID and hardware revision if known. Include whether the device is charging and a short video if you are asking about a repeating light pattern.
