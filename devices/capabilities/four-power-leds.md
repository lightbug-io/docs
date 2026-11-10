---
aside: true
---

# Four power LEDs

Four power LEDs show approximate battery level and charging progress. The same indicators can also be used for startup sequences, alerts or model-specific functions. This capability describes the standard **four-bar display**, not every device that happens to have four visible lights.

## Devices

| Device | Implementation and limits |
| --- | --- |
| [Pro3 / PR3](/devices/pro/) | Four orange indicators on hardware revisions 02–04; no separate GPS/GSM diagnostic pair |
| [ProN / PR2](/devices/history/PR2) | Four battery indicators, alongside two separate GPS/GSM diagnostic indicators |
| [Zero / ZE2](/devices/zero/) | Four battery indicators, alongside two separate GPS/GSM diagnostic indicators |
| [Enviro / EN2](/devices/enviro/) | Four battery indicators, alongside two separate GPS/GSM diagnostic indicators |
| [Vehicle / VT3](/devices/vehicle/) | Four indicators also used for the [vehicle connection display](/devices/vehicle/#vehicle-connection-status); physical colours and orientation depend on the revision |

The ZE3 revision 01 design also has four orange indicators and the standard firmware uses this display. That design evidence does not establish which firmware is installed on a supplied ZE3; check the revision with support. ZE3 does not have the older Zero ZE2 diagnostic pair.

[RH2 RGB status LEDs](/devices/rtk/handheld/leds) use a different display and are not covered by these battery-bar thresholds. Custom products, applications and firmware can also differ.

## Normal battery display

A short status-button press normally shows the battery level briefly. The four indicators use these approximate bands:

| Battery level | Normal battery display |
| --- | --- |
| Below 20% | First indicator flashes when showing status off charge |
| 20% to below 40% | 1 indicator |
| 40% to below 60% | 2 indicators |
| 60% to below 80% | 3 indicators |
| 80% or more | 4 indicators |

![Illustrated battery bands: below 20 percent the first indicator flashes off charge; at least 20, 40, 60 and 80 percent shows one, two, three and four indicators.](/images/devices/general/led-battery-levels.svg)

These bands apply to the normal battery display only. Four lights are not an exact 100% reading. The diagram illustrates the pattern, not a physical case layout or a colour specification for every model.

## Charging

- Below about 95%, the highest lit battery indicator blinks, roughly one second on and one second off. At very low charge, the first indicator blinks.
- At about 95% or above, the normal charging display becomes steady. This means a high charge level, not an exact 100% reading.
- When unplugged and resting, the lights normally go out after any temporary status display finishes. A button press, startup or other activity can still light them.

![Charging example at three bars: two steady indicators and a third that alternates on and off every second, with the fourth off. Two static frames illustrate the repeating pattern.](/images/devices/general/led-charging.svg)

These are battery-bar patterns, not RH2's RGB charging colours.

## Other uses of the same indicators

Startup, alarms, custom applications and remote LED control can temporarily replace the normal display. Some products also use the indicators for a connection or protection state: see the [VT3 connection display](/devices/vehicle/#vehicle-connection-status) and [Pro3 charger protection](/devices/pro/#charger-protection).

For a practical starting point, use the [LED guide](/guides/leds). The number of visible indicators does not by itself establish the number of independently controllable API outputs.
