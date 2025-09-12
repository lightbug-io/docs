---
aside: false
---

# Cellular Positioning

Cellular networks can also be used to determine the location of a device.

This is the least accurate of the positioning methods, but can be used as a backup when GPS and WiFi are not available.

Lightbug devices can make use of either information of the cell towers that they can see along with the signal strength to determine their location.

Or as a fallback, the ID of the cell tower that they are connected to.

## Example Position

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
