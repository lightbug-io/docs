---
aside: false
---

# GNSS (Global Navigation Satellite System)

GNSS is a set of satellite based navigation system, of which the first constellation was GPS, launched in the 70s.

Satellites provide location and time information, anywhere on Earth where there is an unobstructed line of sight.

Getting a GPS lock can take some time, and this depends on the environment and current satellite positions.

## Constellations

There are now 6 constellations in operation.

Lightbug devices use GNSS satellite constellations as a primary means of determining their location, and this typically leads to accurate positioning of 0.5-5m outdoors.

- GPS (United States)
- GLONASS (Russia)
- Galileo (Europe)
- BeiDou (China)
- NavIC (India)
- QZSS (Japan)

## Example Position

An example position from a Lightbug device making use of GNSS might look something like this:

```json
{
    "type": "gps",
    "location": {
        "lat": 51.470019,
        "lng": -2.541543
    },
  "accuracy": 5
}
```

**Reading** [Wikipedia: GNSS](https://en.wikipedia.org/wiki/Global_Navigation_Satellite_System),
[Wikipedia: GPS](https://en.wikipedia.org/wiki/Global_Positioning_System)
