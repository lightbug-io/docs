<script setup>
import DeviceSpecTable from '../../components/DeviceSpecTable.vue'
import { ref, onMounted } from 'vue'

const yamlText = ref('')

onMounted(async () => {
  const res = await fetch('/device-specs/enviro/v2.yaml')
  yamlText.value = await res.text()
})
</script>

<DeviceSpecTable v-if="yamlText" :yaml-text="yamlText" :image-url="'https://lightbug.io/raw-renders/2025-07-01/enviro-front angle.png'" />

## Specification

| Attribute             | Value                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Device                | EN2                                                                                          |
| Size                  | 85 x 44 x 28.4 mm                                                                            |
| Weight                | 152g                                                                                         |
| Battery               | 6600mAh (Rechargeable Lithium)                                                                |
| Sim                   | Integrated roaming sim                                                                       |
| GSM                   | Quadband 4G LTE-M & NBIoT + 2G fallback                                                               |
| Bluetooth             | 5.0                                                                                          |
| Positioning           | GPS (GPS, GLONASS, BEIDOU, GALILEO & QZSS), WiFi & GSM                                       |
| Sensors               | High accuracy Temperature & Humidity Sensors, Orientation, Accelerometer, External Bluetooth |
| Memory                | up to 1000 locations update when they can't be transmitted                                   |
| IP rating             | Shockproof                                                                                   |
| Operating Temperature | -20°C to 60°C ¹                                                                              |
| Buttons               | 1                                                                                            |
| LEDs                  | 6 (4x battery, 2x status)                                                                    |
| Sound                 | Buzzer                                                                                       |
| Charging              | Magnetic 4 pin connector                                                                     |
| Additional            |                                                                                              |
| Typical Usage         | For tracking temperature & humidity sensitive non powered assets                                                                                         |
| Optional              | NFC                                                                                          |

<small>¹ All device batteries can be [customized](/devices/custom) down to -40°C with other tradeoffs, please contact us for more information.</small>

## Charging

The Pro tracker is charged using a magnetic 4 pin connector, and should be charged for 5 hours before initial use.

This connecter can be used with a magnetic cable or a pro charging dock.

<!-- TODO side by side picture of 2 charging methods -->

| State                    | Indication                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| Disconnected             | No LEDs will be on                                                           |
| Connected, Charging      | Battery LEDs display the charge of the device, and will blink while charging |
| Connected, Fully charged | Battery LEDs display the charge of the device, no blinking will happen       |

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
