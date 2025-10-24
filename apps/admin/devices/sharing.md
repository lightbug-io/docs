---
outline: deep
order: 9
---

# Manage Sharing

<div style="float: right; display: flex; flex-direction: column;">

<DeviceCompatibility :devices="[
  { id: 'rtk-handheld', name: 'Handheld RTK', link: '/devices/rtk/handheld/' },
  { id: 'rtk-vehicle', name: 'Vehicle RTK', link: '/devices/rtk/vehicle' },
  { id: 'viper', name: 'Viper' },
  { id: 'zcard', name: 'ZCard' }
]" />
</div>

Sharing allows you to share a period of data that has been received from a device with other users publicly [via a link](/apps/chasm/share/).

You can access sharing on supported devices via the <IconWithLabel iconName="share-outline" label="Sharing" size="1.5em" /> device action on <LinkWithDestination href="https://admin.lightbug.cloud/#/pages/devices" label="the devices admin page" destination="ADMIN" />.

![](https://upload.r2.lb.chasm.cloud/2025/10/1qPepVy89y.png)

## Selection

The selection screen allows you to choose the time period to share, and the type of data to include.

- **Message type**: Relates to the [message type of the device communication protocol](/devices/api/messages/)
- **Start time**: The start time of the data to share, based on the time received by the server.
- **End time**: The end time of the data to share, based on the time received by the server.
- **Name**: The name to give the share, to help identify it later, and to be shown on the share page.

![=600x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_6d49IuNZko.png)

Clicking the `Share` button will create the share, and provide you with a link to access it, if there is data available for the selected period.

The URL is made up of the device ID, start time, end time, and a random token to prevent guessing of URLs.

![=600x](https://upload.r2.lb.chasm.cloud/2025/10/tuXPf8zSqs.png)

## Viewing

Shares will be published to [share.chasm.cloud](https://share.chasm.cloud) ([documentation](/apps/chasm/share/)), and can be viewed without authentication.
