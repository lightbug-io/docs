---
outline: deep
order: 9
---

# Manage Sharing

<DeviceCompatibilityV3 float="right" />

Sharing allows you to share a period of data that has been received from a device with other users publicly [via a link](/apps/chasm/share/).

On <LinkWithDestination href="https://admin.lightbug.cloud/#/pages/devices" label="the devices admin page" destination="ADMIN" />, open the device's **More actions** menu and choose **Shared access** in the **Connectivity** section.

Sharing supports one device at a time. Check the device shown under **Sharing data for** before creating a share.

![Share device data dialog showing the selected device, message type, time range, and optional name =800x](https://upload.r2.lb.chasm.cloud/2026/11/screenshots/devices-share-e9133f54-4ec8-4685-82b8-f36315c36862.png)

## Selection

The selection screen allows you to choose the time period to share, and the type of data to include.

- **Message type**: Use `*` to include all messages, or enter a numeric [message type from the device communication protocol](/devices/api/messages/).
- **Start time**: The start time of the data to share, based on the time received by the server.
- **End time**: The end time of the data to share, based on the time received by the server.
- **Name (optional)**: A name of up to 255 characters to help identify the share and show on the share page.

### Time selection

The dialog starts with **Last 1 hour** in your local timezone. Use **Quick time range** to choose **Today** or a recent period, such as **Last 6 hours** or **Last 24 hours**. Today starts at midnight in the selected time format, up to a maximum of 24 elapsed hours.

![Quick time range menu showing Today and recent periods from five minutes to 24 hours =550x](https://upload.r2.lb.chasm.cloud/2026/11/screenshots/devices-share-time-selection-c02e310a-5867-4192-8d09-85748daa1f3a.png)

You can also edit **Start time** and **End time** directly, including seconds. The start must be before the end, and a share can cover at most **24 hours**.

Choose **UTC** or **Local** under **Input time format**. The local timezone is shown beside Local, and each time field shows both local and UTC values underneath. Switching format converts the displayed times without changing the selected period.

To paste a timestamp, use an ISO value such as `2026-11-05T13:43:25Z` or `2026-11-05T14:43:25+01:00`, or an unambiguous month-name date such as `Nov 5, 2026`. Values without a timezone use the selected input format. Slash-separated numeric dates are not supported when pasting. If a local time is ambiguous because the clocks change, use an ISO timestamp with an explicit offset.

### Create the share

Clicking the `Share` button will create the share, and provide you with a link to access it, if there is data available for the selected period.

Use **Copy** to copy the link or **Open share** to view it. Anyone with the link can view the shared data without signing in, so check the device, message type, and time range before sharing the link.

The URL is made up of the device ID, start time, end time, and a random token to prevent guessing of URLs.

![Share created confirmation with the share link, Copy button, and Open share link =800x](/images/share-created-confirmation.svg)

## Viewing

Shares will be published to [share.chasm.cloud](https://share.chasm.cloud) which itself is [fully documented on this site](/apps/chasm/share/), and can be viewed without authentication.

Some example share URLs for RH2 devices:
 - [A 5 minute drive through Bristol @ 1Hz](https://share.chasm.cloud/#12916041/20260212-170900-20260212-171500-htNJ4Uuz5hM7zOb45Hw0)
 - [A 50 minute walk in Bristol @ 1Hz](https://share.chasm.cloud/#12916041/20260212-124500-20260212-134500-5QoJIuLTbH76C9PlINmS)
 - [Sat stationary on a rock on Dartmoor](https://share.chasm.cloud/#13671375/20260125-151718-20260125-152439-1EBYuf1nYgfqfDJ1lAVX)

And for other devices:
 - Android: [A 5 minute walk including BLE data](https://share.chasm.cloud/#13683726/20260114-164117-20260114-164627-OLlSHUMJvbY13z4TWtGZ)
