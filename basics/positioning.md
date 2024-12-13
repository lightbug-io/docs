# Positioning

Lightbug devices make use of a combination of technologies to determine their location.

The most common of these are GNSS (commonly referred to as GPS), but we also use other technologies fill in the gaps when a GPS lock many not be found due to device configuration.

## GNSS (Global Navigation Satellite System)

GNSS is a set of satellite based navigation system, of which the first constellation was GPS, launched in the 70s.

Satellites provide location and time information, anywhere on Earth where there is an unobstructed line of sight.

Getting a GPS lock can take some time, and this depends on the environment and current satellite positions.

### Constellations

There are now 6 constellations in operation.

Lightbug devices use GNSS satellite constellations as a primary means of determining their location, and this typically leads to accurate positioning of 0.5-5m outdoors.

- GPS (United States)
- GLONASS (Russia)
- Galileo (Europe)
- BeiDou (China)
- NavIC (India)
- QZSS (Japan)

### Example Position

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

## WiFi Positioning

WiFi networks around the globe advertise unique identifiers in the form of MAC addresses.

Databases of these MAC addresses and their locations are maintained by companies, and thus can be used to determine the location of a device based on the WiFi networks it can see.

Lightbug devices can make use of WiFi as a low energy and quick alternative to GPS for basic positioning.

This is particularly useful in urban areas where GPS signals may be obstructed.

### Example Position

An example position from a Lightbug device making use of WiFi positioning might look something like this:

```json
{
    "type": "wifi",
    "location": {
        "lat": 51.469831,
        "lng": -2.541757
    },
  "accuracy": 50
}
```

**Reading** [Wikipedia: Wi-Fi](https://en.wikipedia.org/wiki/Wi-Fi),
[Wikipedia: Wi-Fi positioning system](https://en.wikipedia.org/wiki/Wi-Fi_positioning_system),
[Wikipedia: MAC address](https://en.wikipedia.org/wiki/MAC_address)

## Cellular Positioning

Cellular networks can also be used to determine the location of a device.

This is the least accurate of the positioning methods, but can be used as a backup when GPS and WiFi are not available.

Lightbug devices can make use of either information of the cell towers that they can see along with the signal strength to determine their location.

Or as a fallback, the ID of the cell tower that they are connected to.

### Example Position

An example position from a Lightbug device making use of cellular positioning might look something like this:

```json
{
    "type": "gsm",
    "location": {
        "lat": 51.472638,
        "lng": -2.532963
    },
  "accuracy": 961
}
```

**Reading** [Wikipedia: Cell ID](https://en.wikipedia.org/wiki/Cell_ID),
[Wikipedia: Cell tower](https://en.wikipedia.org/wiki/Cell_site),
[Wikipedia: Mobile phone tracking](https://en.wikipedia.org/wiki/Mobile_phone_tracking)
