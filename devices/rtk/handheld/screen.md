---
aside: true
outline: deep
---

# Screen

The RH2 features a 2.13" front-lit monochrome e-ink display with a resolution of 250x122 pixels, which is visible in direct sunlight and has a very low power consumption.

The [default firmware of the RH2 has a simple application](./application) that makes use of the screen to display information such as GNSS status, battery level, and allow basic control of the device.

:::tabs
== Visualization
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/lGxzg9U.png)
== Wide Photo
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/dF5X5Qn.png)
== Zoom Photo
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/42e4q6P.jpeg)
:::

Custom applications running on the [ESP32 microcontroller](./esp32) can make use of the [Toit SDK](/devices/api/sdks/toit/) and or [device API](/devices/api/) to display sensor data, custom menus, alerts, messaging and more.

<!-- TODO include image of what a custom application may look like on the screen -->
