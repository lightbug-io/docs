# Readings

Readings, or sensor readings, are sent along site [points](./points), and contain additional information that has been recorded by the device, at a given point in time.

- Identifiers:
    - Reading ID: Unique identifier of the point
    - Device ID: Device that the point relates to
    - Transmission ID: Hash that relates to the transmission the data was received in. Can be used to connect multiple points and readings.
    - Gateway ID: If set (and visible), the data was received via a device with this ID
    - SensorDeviceID
- Timestamps:
    - Time the device recorded the point. (Can be 1970 if the device didn't know the time)
    - Time the point was successfully received by the receiving endpoint
- Data:
    - Type of data (see [#types](#types))
    - Value of data
    - Additional meta data

:::info
Different interfaces may expose these details in different ways, and you are encouraged to look at the individual interface documentation.
:::

## Types

Each reading has a `type` attribute, which indicates what kind of reading it is, and thus the type of data to expect.

These types can also be used to filter the data.

These reading types are sent from most devices:

- temp: Temperature
- [ble_seen](#bluetooth-ble-seen): Bluetooth device seen
- chg_voltage: Charging voltage

Some readings will only be sent by devices that have additional sensors built in, such as the [Enviro](/devices/enviro/):

- humidity_bme: Humidity from the BME sensor
- pressure_bme: Pressure from the BME sensor
- temp_bme: Temperature from the BME sensor

Or by devices that plug into power, such as the [Vehicle Tracker](/devices/vehicle/):

- ext_voltage: External voltage being supplied to the device

Many other sensor readings are available, and will continue to be documented here.

If you need help understanding a reading type that is not listed here, please [contact us](https://lightbug.io/contact/).

- humidity
- temp_hw
- pressure_hw
- light
- heartrate
- acc_ext
- acc_maxForce
- acc_maxTilt
- geofence_log
- lora_packet
- uart_blob
- ultra
- unknown
- temp_dht
- tds_adc
- tamper_detected
- max_speed
- loragw_seen_hack
- light_detected
- humidity_dht
- chg_data
- cadence
- ble_seen
- battery
- adcraw_90
- adcraw_245
- adcraw_2
- adcraw_10
- adcraw_0
- adc_90
- adc_245
- adc_10
- accel_3d

### Bluetooth (ble_seen)

Records data associated with a Bluetooth device seen by the device.
Including links to the device entry itself, which will in turn link to data gathered from sensors on that device.

#### No sensors or name

When a Bluetooth device is seen, but it has no name or sensors, the data may look like this:

Value: `-42`
Meta: `{"rssi":-42,"sensorCount":0}`
RSSI: `-42`
Gateway: `7890123`
Device: `123456`

#### Sensor with name

When a Bluetooth device with sensors and a name is seen, the data may look like this:

Value: `{"name":"P ID 00A3B6"}`
Meta: `{"rssi":-42,"sensorCount":1}`
RSSI: `-42`
Gateway: `7890123`
Device: `123456`

#### iBeacon

When an iBeacon device is seen, the following data is included in the reading:

Value: `{"major":44,"minor":1234,"power":1}`
Meta: `{"rssi":-81,"sensorCount":1,"ibeacon":true}`
RSSI: `-81`
Gateway: `7890123`
Device: `123456`

The device seen relates to a device entry that will include the MAC address of the iBeacon.
