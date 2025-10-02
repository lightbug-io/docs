---
aside: true
outline: [1,3]
---
# Device list

The device list provides an overview of all the devices on your account.

In order to see the device list, you need to expand the sidebar by using the arrow.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/2umqTRF.png){.center}

The List will expand, and you will see all the devices on your account that have been active in the last 90 days including various information about each device.

:::tabs
== Desktop
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/bv8vapO.png)
== Mobile
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/Ei8Nqvk.png)
:::

::: warning
If your last location update was 2 days ago, the information here (including battery status) is from 2 days ago.
:::

<!-- TODO detail device search here too -->

## Device rows

Each device row contains the following information:
 - Device name
 - Device color
 - Last known address (if any)
 - Movement state
 - Time of last transmission (or activation state)
 - Signal strength of last transmission
 - Battery level of last transmission
 - Tags (if any)
 - Current zones (if any)

Here are some examples of what the device rows can look like:

| Image | Description |
| --- | --- |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/6iKfpTu.png){.center} | An active device, that has just transmitted data, and was charging on last transmit |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/yeynpZl.png){.center} | An active device, that transmitted data 3 minutes ago, and was charging on last transmit
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/0Ws7yNs.png){.center} | An active device, that has not connected since 29 August 2024, and had very little battery on last transmitted |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/ZYZseSF.png){.center} | A deactivated device, that last reported being on 72% battery |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/MrymS6o.png){.center} | A deactivated device, that last reported being on 74% battery, and in the "Bristol area" zone. |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/KND4U7x.png){.center} | A deactivated device, that last reported being on 100% battery, and in the "Bristol area" zone, and has a [tag](/apps/cloud/device-settings/tags.html) |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/eVBH9OQ.png){.center} | When using wired trackers, Battery % will not be shown, Powered status (ignition) will be shown |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/MEhzqHR.png){.center} | An active device, that has just transmitted data, and is in battery saver mode at 13% |
| ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/u3glJ6q.png){.center} | A bluetooth beacon that has been added to the account |

Clicking on a device row, will focus the map on that device, and open the device information panel.
