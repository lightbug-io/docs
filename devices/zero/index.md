---
aside: false
---

<script setup>
import DeviceSpecTable from '../../components/DeviceSpecTable.vue'
import spec from '../../public/device-specs/zero/v2.yaml?raw'
</script>

<DeviceSpecTable :yamlText="spec" />

## Exterior

<img src="/images/devices/zero/overview.png" style="max-height: 300px; max-width: 300px">
<img src="/images/devices/zero/leds.png" style="max-height: 300px; max-width: 300px">

## LED Indicators

The small icons above each of the indicators show what information they display.

These indicators can light up while transmitting, or as the result of a button press.

| Icon                                                                                                 | Name       | Description                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="/images/devices/general/status-battery.png" alt="Battery symbol" width="20" height="20" /> | Battery    | The current charge of the tracker with 1-4 LEDs glowing solid orange.<br><br> 🟧 1 LED: 0%-25%<br> 🟧🟧 2 LEDs: 25%-50%<br> 🟧🟧🟧 3 LEDs: 50%-75%<br> 🟧🟧🟧🟧 4 LEDs: 75%-100% |
| <img src="/images/devices/general/status-gps.png" alt="GPS symbol" width="20" height="20" />         | GPS signal* | 🟧 Solid orange when operational<br> 🟥 Solid red when GPS is unavailable<br><br>It is normal for GPS to be unavailable when the tracker is indoors. |
| <img src="/images/devices/general/status-gsm.png" alt="GSM symbol" width="20" height="20" />         | GSM signal*  | 🟧 Solid orange when operational<br> 🟥 Solid red when GSM is unavailable<br><br>GSM may not be available in areas with poor cell phone coverage. |

*The signal indicators are primarily for diagnostic purposes.

## Buttons

The device has a single button that can be used to trigger different events.

| Trigger    | Indication | Event                                                                                                                                      | Details |
| ---------- | ------|------------------------------------------------------------------------------------------------------------------------------------ | -- |
|  < 1 second | Battery and status LEDs will light up | | Shows you current status |
| 1-3 second | The battery LEDs will flash from left to right in a cycle, and you will hear a small beep. | Send button press event & location | Initially sending an immediate location, followed by a more accurate location once found.
| 15 second | The battery LEDs may go blank for a second, but then will flash from left to right in a cycle, and you will hear a small beep. | Hard reset | Recommended if you are experiencing network related performance issues |

## Charging

The Zero tracker is charged using a magnetic 4 pin connector, and should be charged for 3 hours before initial use.

This connecter can be used with a magnetic cable or a zero charging dock.

<!-- TODO side by side picture of 2 charging methods -->

| State                    | Indication                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| Disconnected             | No LEDs will be on                                                           |
| Connected, Charging      | Battery LEDs display the charge of the device, and will blink while charging |
| Connected, Fully charged | Battery LEDs display the charge of the device, no blinking will happen       |

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
