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
- ble_seen: Data associated with a Bluetooth device seen by the device
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
