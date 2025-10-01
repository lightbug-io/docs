---
aside: false
---

# WiFi Positioning

WiFi networks around the globe advertise unique identifiers in the form of MAC addresses.

Databases of these MAC addresses and their locations are maintained by companies, and thus can be used to determine the location of a device based on the WiFi networks it can see.

Lightbug devices can make use of WiFi as a low energy and quick alternative to GPS for basic positioning.

This is particularly useful in urban areas where GPS signals may be obstructed.

## Example Position

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
