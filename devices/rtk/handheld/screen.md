---
aside: true
outline: deep
---

# Screen

The RH2 features a 2.13" monochrome e-ink display with a resolution of 250x122 pixels, which is visible in direct sunlight and has a very low power consumption.

The default firmware of the RH2 has a simple user interface that makes use of the screen to display information such as GNSS status, battery level, and allow basic control of the device.

The screen can also be used by the ESP32 microcontroller as part of a custom application, for example to display sensor data, custom menus, alerts, messaging and more.

## Defaults

The default firmware has a single main [home](#home) screen, with a sub [menu](#menu) screen.

### Home

The home screen shows basic device status, and basic device control.

The status bar at the top shows:
 - SIM status
 - GSM status and signal strength
 - Battery level
 - Charge state

#### Disarmed

A device would normally start in a disarmed state.

In this state the device is not attempting to get a GNSS fix or report its location, or connect to GSM.

:::tabs
== Visualization
![](https://i.imgur.com/lGxzg9U.png)
== Wide Photo
![](https://i.imgur.com/dF5X5Qn.png)
== Zoom Photo
![](https://i.imgur.com/42e4q6P.jpeg)
:::

The center button can be used to arm the device (See [armed](#armed) below).

Or the menu button can be used to access the [menu](#menu) below.

The actions selection currently does nothing, and is intended for future use.

#### Armed

When armed the device will find it location using GNSS, and report it to the Lightbug Cloud, then streaming RTK corrections if available for the device.

Information above the status of this process will be shown on the screen.

:::tabs
== Visualization
![](https://i.imgur.com/C05HoGx.png)
== Wide Photo
![](https://i.imgur.com/gnhrnfH.png)
== Zoom Photo
![](https://i.imgur.com/1hVj0c0.jpeg)
:::


### Menu

The menu allows selection of:
 - Base station mode (allowing the device to work as an RTK base station)
 - 1Hz RTK tracking
 - 2Hz RTK tracking
 - 5Hz RTK tracking
 - Displays the Device ID

:::tabs
== Visualization
![](https://i.imgur.com/pZ22H5j.png)
== Wide Photo
![](https://i.imgur.com/D0PxTPE.png)
== Zoom Photo
![](https://i.imgur.com/a0mwlDn.jpeg)
:::

## Custom

Custom applications running on the [ESP32](esp32) can make use of [Toit SDK](/devices/api/sdks/toit/) and or [device API](/devices/api/) to draw custom screens.
