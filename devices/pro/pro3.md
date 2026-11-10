---
aside: true
---

<!-- cspell:ignore Quectel HALMD Richtek -->

# Pro3 (PR3)

Pro3 is a different hardware generation from [ProN (PR2)](/devices/pro/). The two generations share the same external appearance, so use the product code and hardware revision to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.

::: tip Choose the matching LED guide
Pro3 hardware revisions 02–04 have four orange indicators, without the two separate GPS and mobile-network indicators found on ProN/PR2. See [Pro3 LED patterns](/guides/pro3-leds) for battery, charging and restart guidance.
:::

## Images

![Pro3 tracker enclosure](https://upload.r2.lb.chasm.cloud/2025/10/product-front/LB-DEV-PR2.png)

The enclosure image is shared with ProN/PR2. It does not identify the internal electronics or LED layout.

## Hardware generations

| Feature | ProN / PR2 | Pro3 / PR3 |
| --- | --- | --- |
| LED layout | Four battery indicators plus two diagnostic indicators | Four orange indicators on revisions 02–04 |
| Cellular platform | SIMCom SIM7000 family | SIMCom A76xx family |
| Controller | STM32WB55 | STM32WLE5 |
| Companion processor | ESP8285 | ESP32 family; ESP32-C6FH4 on revision 04 |
| GNSS receiver | Integrated SIM7000G receiver in the PR2 specification | Separate Quectel LC79HALMD on revision 04 |
| Charger | Texas Instruments BQ25890H in the PR2 specification | Richtek RT9471 on revision 04 |

This is a hardware comparison, not a complete Pro3 specification. Cellular bands, wireless features, charging limits and certifications must be checked for the supplied Pro3 revision. The [PR2 specification download](/devices/pro/) applies to PR2 only.

## LED indicators

The four orange lights share the normal battery display and startup sequences. Pro3 does not have a separate GPS or mobile-network colour table. In particular, the older ProN/PR2 example of two red and four orange lights is not the Pro3 layout.

See the [illustrated Pro3 LED guide](/guides/pro3-leds). When checking whether the tracker is communicating, use the latest successful communication in the app or portal rather than the lights alone.

## Charging

Use the charging accessory and power supply specified for your Pro3 revision. Do not apply the PR2 voltage/current ratings or charging-time instructions to Pro3.

The normal charging display uses the four orange indicators. See [Pro3 charging patterns](/guides/pro3-leds#charging) for the blinking and steady states. A steady high-charge display is not an exact 100% reading.

## Get help

For specifications or troubleshooting, [contact support](https://lightbug.io/contact/) with the product code, device ID and hardware revision if known. Include whether the device is charging and a short video if you are asking about a repeating light pattern.
