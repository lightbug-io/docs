# Points

Points represent a single location update from a device, and contain a number of fields that provide information about the device's state at the time the location was recorded.

- Identifiers:
    - Point ID: Unique identifier of the point
    - Device ID: Device that the point relates to
    - Transmission ID: Hash that relates to the transmission the data was received in. Can be used to connect multiple points and readings.
- Timestamps:
    - `timestamp`: Time the device recorded the point, with whole-second precision on ProN firmware 2422. (Can be 1970 if the device didn't know the time)
    - `created`: When the server received and processed the point
- Location:
    - Coordinates
    - Altitude: GPS altitude in metres above mean sea level for ProN firmware 2422
    - Method of finding coordinates `gps`, `wifi`, `gsm`
    - Accuracy: An estimated horizontal accuracy in metres. You can represent it as a circle of that radius around the point, but it isn’t a guaranteed boundary.
    - Address that has been looked up relating to the coordinates
    - Speed
    - Course: GPS course over ground in degrees. It’s most useful while moving.
- Status:
    - Battery voltage
    - Battery percent
    - Average charge
    - Current used this transmission
- Metadata:
    - GSM signal: An optional cellular signal-strength reading, reported as a CSQ value. It isn’t included with every point, so a blank doesn’t by itself mean there was no network connection.
    - GPS Satellite count
    - Errors, relating to current or previous operations
    - Send reason
    - Move type
    - Alert type

:::info
Different interfaces may expose these details in different ways, and you are encouraged to look at the individual interface documentation.
:::

Other information is often submitted with points, such as [readings](./readings.html)
