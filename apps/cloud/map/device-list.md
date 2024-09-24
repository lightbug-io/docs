---
aside: true
outline: [1,3]
---
# Device list

The device list provides an overview of all the devices on your account.

In order to see the device list, you need to expand the sidebar by using the arrow.

![](https://i.imgur.com/2umqTRF.png)

The List will expand, and you will see all the devices on your account that have been active in the last 90 days including various information about each device.

:::tabs
== Desktop
<v-img src="https://i.imgur.com/bv8vapO.png" style="max-height:400px"/>
== Mobile
<v-img src="https://i.imgur.com/Ei8Nqvk.png" style="max-height:400px"/>
:::

::: warning ⚠️ Warning
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

Here are some examples of what the device rows can look like:

| Image | Description |
| --- | --- |
| <v-img src="https://i.imgur.com/6iKfpTu.png" style="width:350px"/> | An active device, that has just transmitted data, and was charging on last transmit |
| <v-img src="https://i.imgur.com/yeynpZl.png" style="width:350px"/> | An active device, that transmitted data 3 minutes ago, and was charging on last transmit
| <v-img src="https://i.imgur.com/0Ws7yNs.png" style="width:350px"/> | An active device, that has not connected since 29 August 2024, and had very little battery on last transmitted |
| <v-img src="https://i.imgur.com/ZYZseSF.png" style="width:350px"/> | A deactivated device, that last reported being on 72% battery |
| <v-img src="https://i.imgur.com/MEhzqHR.png" style="width:350px"/> | An active device, that has just transmitted data, and is in battery saver mode at 13% |
| <v-img src="https://i.imgur.com/MrymS6o.png" style="width:350px"/> | A deactivated device, that last reported being on 74% battery, and in the "Bristol area" zone. |
| <v-img src="https://i.imgur.com/u3glJ6q.png" style="width:350px"/> | A bluetooth beacon that has been added to the account |

Clicking on a device row, will focus the map on that device, and open the device information panel.
