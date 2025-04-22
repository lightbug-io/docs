# Zero

Our smallest core GPS tracking device.

<img src="https://lightbug.io/images/product-front/LB-DEV-ZE2_hu4ff3455ecb7f322eb1f00907f166ea0e_177507_600x900_fit_q95_h2_box_2.webp" alt="Zero" style="max-height: 250px; max-width: 380px">

## Specification

| Attribute             | Value                                                       |
| --------------------- | ----------------------------------------------------------- |
| Device                | ZE2                                                         |
| Size                  | 56 x 37 x 12.9mm                                            |
| Weight                | 35g                                                         |
| Battery               | 1000mAh                                                     |
| Sim                   | Integrated roaming sim                                      |
| GSM                   | Quadband 4G LTE-M & NBIoT + 2G fallback                              |
| Bluetooth             | 5.0                                                         |
| Positioning           | GPS (GPS, GLONASS, BEIDOU, GALILEO & QZSS), WiFi & GSM      |
| Sensors               | Temperature, Orientation, Accelerometer, External Bluetooth |
| Memory                | up to 1000 locations update when they can't be transmitted  |
| IP rating             | IP66 & Shockproof                                           |
| Operating Temperature | 0°C to 50°C ¹                                               |
| Buttons               | 1                                                           |
| LEDs                  | 6 (4x battery, 2x status)                                   |
| Sound                 | Buzzer                                                      |
| Charging              | Magnetic 4 pin connector                                    |
| Additional            |                       |
| Typical Usage         | For tracking non powered assets, where you have a size or weight restriction  |
| Mounting options | Adhesive pad, screw mount, keyring hole                                                      |
| Optional              | NFC                                                         |

<small>¹ All device batteries can be [customized](/devices/custom) down to -40°C with other tradeoffs, please contact us for more information.</small>

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
