---
aside: true
---

# RTK device LED indicators

**Handheld RH2 and Vehicle RTK do not use the same LED display.** Choose the model below. A shared RTK capability does not imply the same indicators or application controls.

## Handheld RTK (RH2)

RH2 uses an RGB status display in the standard firmware. Application-controlled lights can provide separate feedback, so first check whether you are looking at charging/status or at a running application's indication. See the [RH2 exterior guide](/devices/rtk/handheld/external#front) for the enclosure layout.

### Charging status

The standard RGB charging display changes colour with the approximate battery level:

| Battery level | Charging status colour |
| --- | --- |
| Below 30% | Red |
| 30% to below 70% | Orange |
| 70% to below 90% | Yellow-green |
| 90% or more | Green |

Brightness varies in steps about every half-second while charging below approximately 99%. At about 99% or above, that variation stops. Green starts at about 90%; it is not an exact full-battery indication or proof of an RTK fix.

![RH2 charging colours: red below 30 percent, orange from 30 to below 70, yellow-green from 70 to below 90, green at 90 or more. Brightness varies below about 99 percent and is steady at about 99 percent or more.](/images/devices/general/led-rh2-charging.svg)

Do not apply the four-bar, 95% charging rule from Pro3 or the older ProN/Zero/Enviro guides to RH2.

### Off-charge status

When armed and active, the standard status display can reflect positioning state and low battery. A configured resting colour takes precedence over that default indication, and an inactive device normally turns the status display off. Applications and alarms can also control the lights.

For this reason, a green or red light by itself is not a reliable statement of RTK accuracy, upload success or a hardware fault. Check the application's positioning/accuracy information and the latest successful communication.

### Application-controlled feedback

The [Survey application](/devices/api/sdks/toit/applications/survey/#cloud-submission) flashes green for a successfully submitted survey point and red for a submission error. Those are application events, not the charging colour table above. Other applications can choose different patterns.

## Vehicle RTK (VTRTK)

VTRTK has four indicators in the standard firmware, not RH2's RGB status display. It uses the shared battery-bar and vehicle connection patterns below. Indicator colours and physical orientation should be checked for the supplied hardware revision.

### Normal battery display

<!--@include: ../.vitepress/includes/led-battery-bars.md-->

### Charging and ignition

<!--@include: ../.vitepress/includes/led-bar-charging.md-->

After a status-button press, the vehicle connection display flashes logical indicators 1–2 for ignition high and 3–4 for charging, in five cycles of about 0.3 seconds on and 0.2 seconds off. Both pairs can flash together. These logical numbers do not establish left-to-right positions on the case.

External power and active charging are different states. Do not treat an unlit charging pair as proof that there is no external power. The [vehicle connection diagram](/guides/vehicle-leds#vehicle-connection-status) illustrates the logical pairs, not the enclosure colours.

### Startup and other patterns

Startup and alerts can temporarily use the same indicators. Check the latest successful communication after startup, and use the instructions for any custom application that controls the lights. RH2's RGB colours and Survey feedback are not automatically VTRTK features.

## Other RTK generations

Older RTK handhelds and base stations have different displays. Use their [legacy documentation](/devices/history/) or [contact support](https://lightbug.io/contact/) with the product code, device ID and revision. Choose a different family in the [LED guide](/guides/leds).
