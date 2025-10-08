---
outline: [2,3]
---
# Application

The RH2 comes pre loaded with fully featured application for RTK data collection as an RTK rover, or as a base station for other rovers, tracking location at 1Hz, 2Hz or 10Hz.

When tracking, by default, data will be sent to the Lightbug Cloud. You can access the data sent to the cloud by API. The Cloud can also be configured to store data, [forward it to other services](/apps/admin/devices/forwarding), or publicly share snapshots of the data.

:::alpha
The cloud connection, or link can also be configured to point to a private UDP server, that would receive messages directly from the device, via the [device communication protocol](/devices/api/protocol/).

If you would like to use this feature, please [contact us for more information.](https://lightbug.io/contact/)
:::

## Home

The home screen shows basic device status, and basic device control.

The status bar at the top shows:
 - SIM status
 - GSM status and signal strength
 - Battery level
 - Charge state

### Disarmed

A device would normally start in a disarmed state.

In this state the device is not attempting to get a GNSS fix or report its location, or connect to GSM.

:::tabs
== Visualization
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/lGxzg9U.png){.center}
== Wide Photo
![=600x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/dF5X5Qn.png){.center}
== Zoom Photo
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/42e4q6P.jpeg){.center}
:::

The center button can be used to arm the device (See [armed](#armed) below).

Or the menu button can be used to access the [menu](#menu) below.

The actions selection can be used by custom [ESP32 applications](./esp32) to provide quick access to custom actions. Unless something is listening for the button press, it will do nothing.

### Armed

When armed the device will find it location using GNSS, and report it to the Lightbug Cloud, then streaming RTK corrections if available for the device.

Information above the status of this process will be shown on the screen.

:::tabs
== Visualization
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/C05HoGx.png){.center}
== Wide Photo
![=600x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/gnhrnfH.png){.center}
== Zoom Photo
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/1hVj0c0.jpeg){.center}
:::

#### GNSS Status

The GNSS status will be one of the following:

| GNSS status | Meaning |
| --- | --- |
| <code>Acquiring&nbsp;GPS</code> | The device is searching for enough satellites to get a fix. |
| <code>Accuracy&nbsp;x.x&nbsp;m</code> | The device has a GNSS fix, and is reporting its accuracy. |

#### Correction State

The correction state will be one of the following:

| Correction state | Meaning |
| --- | --- |
| <code>Connecting&nbsp;to&nbsp;server...</code> | The device is attempting to connect to the Lightbug Cloud to get correction data. |
| <code>Awaiting&nbsp;correction&nbsp;data</code> | The device is connected to the Lightbug Cloud, but has not yet received any correction data. |
| <code>Corrections&nbsp;active</code> | The device is receiving correction data, and applying it to its GNSS fix. |

## Menu

The menu allows selection of:
 - Base station mode (allowing the device to work as an RTK base station)
 - 1Hz RTK tracking
 - 2Hz RTK tracking
 - 5Hz RTK tracking
 - Displays the [Device ID](/terminology/devices#identity)

:::tabs
== Visualization
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/pZ22H5j.png){.center}
== Wide Photo
![=600x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/D0PxTPE.png){.center}
== Zoom Photo
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/a0mwlDn.jpeg){.center}
:::
