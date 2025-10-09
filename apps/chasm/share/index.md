---
---
# Chasm Share

The Chasm Share application is a web-based tool that allows users to view public shared messaging from Lightbug devices.

:::alpha
The sharing application is currently in alpha, and may change rapidly when comparing with the screenshots below.

There many be bugs in display of data, or slow loading, and we appreciate any feedback you have during this time.
:::

## Access

It's accessible at: [https://share.chasm.cloud](https://share.chasm.cloud), where users can enters a device ID, and unique share code to view any shared messages

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_lRFlmGNrRz.png)

Shares can also be directly accessed via a URL in the format:

```
https://share.chasm.cloud#<device_id>/<share_code>
```

## Sharing data

Data can either be shared via the [Admin portal](/apps/admin/), or by adding a share code directly to messages sent to the default device link.

## Viewing Data

Once a valid device ID and share code are entered, the application displays the shared messages in a user-friendly format.

The top of the page shows the share details, as well as links to download the shared data in a variety of formats: JSON, CSV, KML (track, points, or both), NMEA, V3 Messages (Hex, Base64)), Map PNG

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_8TplfstA3F.png)

If the share includes [Position Messages](/devices/api/messages/15-position), the application will display a map with the recorded positions.

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_FCYPD20psZ.png)

Additional information about the GNSS status is also displayed in a variety of charts.

This comes from both [Position messages](/devices/api/messages/15-position) and [Satellite Data message](/devices/api/messages/16-satellite-data)

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_5LMFu0hGut.png)

At the very bottom of the page, all messages are displayed in their JSON format, which is a human readable translation of the raw binary data sent by the device (V3 Messages).

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_8vEOMkBnUk.png)
