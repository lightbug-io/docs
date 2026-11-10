---
aside: true
---

# RH2 LED indicators

RH2 has the [RGB status LED capability](/devices/capabilities/rgb-status-leds). In the standard firmware, it uses the display described here. Application-controlled lights can provide separate feedback, so first check whether you are looking at charging/status or at a running application's indication. See the [RH2 exterior guide](/devices/rtk/handheld/external#front) for the enclosure layout.

## Charging status

The standard RGB charging display changes colour with the approximate battery level:

| Battery level | Charging status colour |
| --- | --- |
| Below 30% | Red |
| 30% to below 70% | Orange |
| 70% to below 90% | Yellow-green |
| 90% or more | Green |

Brightness varies in steps about every half-second while charging below approximately 99%. At about 99% or above, that variation stops. Green starts at about 90%; it is not an exact full-battery indication or proof of an RTK fix.

<LedDemo mode="rh2" />

Do not apply the four-bar, 95% charging rule from Pro3 or the older ProN/Zero/Enviro guides to RH2.

## Off-charge status

When armed and active, the standard status display can reflect positioning state and low battery. A configured resting colour takes precedence over that default indication, and an inactive device normally turns the status display off. Applications and alarms can also control the lights.

For this reason, a green or red light by itself is not a reliable statement of RTK accuracy, upload success or a hardware fault. Check the application's positioning/accuracy information and the latest successful communication.

## Application-controlled feedback

The [Survey application](/devices/api/sdks/toit/applications/survey/#cloud-submission) flashes green for a successfully submitted survey point and red for a submission error. Those are application events, not the charging colour table above. Other applications can choose different patterns.


For another device or an unfamiliar pattern, start with the [LED guide](/guides/leds).
