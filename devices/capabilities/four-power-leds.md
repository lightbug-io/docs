---
aside: true
---

# Four power LEDs

<CapabilityOverview capability="four-power-leds">

Four power LEDs show approximate battery level and charging progress. The same indicators can also be used for startup sequences, alerts or model-specific functions. This capability describes the standard **four-bar display**, not every device that happens to have four visible lights.

</CapabilityOverview>

## Normal battery display

A short status-button press normally shows the battery level briefly. The four indicators use these approximate bands:

| Battery level | Normal battery display |
| --- | --- |
| Below 20% | First indicator flashes when showing status off charge |
| 20% to below 40% | 1 indicator |
| 40% to below 60% | 2 indicators |
| 60% to below 80% | 3 indicators |
| 80% or more | 4 indicators |

<LedDemo mode="battery" />

Four lights are not an exact 100% reading. These examples use orange power LEDs; see your model for its layout and any display overrides.

## Charging

- Below about 95%, the highest lit battery indicator blinks, roughly one second on and one second off. At very low charge, the first indicator blinks.
- At about 95% or above, the normal charging display becomes steady. This means a high charge level, not an exact 100% reading.
- When unplugged and resting, the lights normally go out after any temporary status display finishes. A button press, startup or other activity can still light them.

<LedDemo mode="charging" />


## Other uses of the same indicators

Startup, alarms, custom applications and remote LED control can temporarily replace the normal display. Some products also use the indicators for a connection or protection state: see the [VT3 connection display](/devices/vehicle/#vehicle-connection-status) and [Pro3 charger protection](/devices/pro/#charger-protection).

For a practical starting point, use the [LED guide](/guides/leds). The number of visible indicators does not by itself establish the number of independently controllable API outputs.

## Model notes

The ZE3 revision 01 design also has four orange indicators and the standard firmware uses this display. That design evidence does not establish which firmware is installed on a supplied ZE3; check the revision with support. ZE3 does not have the older Zero ZE2 diagnostic pair.
