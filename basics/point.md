# Point

Points represent a single location update from a device, and contain a number of fields that provide information about the device's state at the time the location was recorded.

- Identifiers:
    - Point ID: Unique identifier of the point
    - Device ID: Device that the point relates to
    - Transmission ID: Hash that relates to the transmission the data was received in. Can be used to connect mutiple points and readings.
- Timestamps:
    - Time the device recorded the point. (Can be 1970 if the device didn't know the time)
    - Time the point was successfully received by the receiving endpoint
- Location:
    - Coordinates
    - Altitude
    - Method of finding coordinates `gps`, `wifi`, `gsm`
    - Accuracy in meters
    - Address that has been looked up relating to the coordinates
    - Speed
    - Course
- Status:
    - Battery voltage
    - Battery percent
    - Average charge
    - Currnet used this transmission
- Metadata:
    - GSM signal
    - GPS Satelite count
    - Errors, relating to current or previous operations
    - Send reason
    - Move type
    - Alert type

:::info
Different interfaces may expose these details in different ways, and you are encouraged to look at the individual interface documentaiton.
:::

Other infomation is often submitted with points, such as [readings](./reading)
