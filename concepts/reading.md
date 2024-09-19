# Reading

Readings, or sensor readings, are sent along site [points](./point), and contain additional infomation that has been recorded by the device, at a given point in time.

- Identifiers:
    - Reading ID: Unique identifier of the point
    - Device ID: Device that the point relates to
    - Transmission ID: Hash that relates to the transmission the data was received in. Can be used to connect mutiple points and readings.
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
Different interfaces may expose these details in different ways, and you are encouraged to look at the individual interface documentaiton.
:::

## Types

Each reading has a `type` attribute, which indicates what kind of reading it is, and thus the type of data to expect.

These reading types are sent from most devices:

- temp
- ble_seen
- chg_voltage

Some readings will only be sent by devices that have additional sensors built in, such as the [Enviro](/devices/enviro/):

- humidity_bme
- pressure_bme
- temp_bme

Or by devices that plug into power, such as the [Vehicle Tracker](/devices/vehicle/):

- ext_voltage

Many other sensor readings are available, and will continue to be documented here.

If you need help understanding a reading type that is not listed here, please [contact us](https://support.lightbug.cloud/).

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
