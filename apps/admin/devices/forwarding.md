---
outline: deep
order: 8
---
# Manage Forwarding

<DeviceCompatibilityV3 float="right" />

Forwarding allows you to forward data from your devices to other services, via a configured [connection](#connections).

This will replace similar messaging based on [Notifications](/apps/cloud/account/notifications), which is only accessible via API or the Cloud app.

You can access sharing on supported devices, via the <IconWithLabel iconName="arrow-forward-outline" label="Forwarding" size="1.5em" /> device action on <LinkWithDestination href="https://admin.lightbug.cloud/#/pages/devices" label="the devices admin page" destination="ADMIN" />.

![](https://upload.r2.lb.chasm.cloud/2025/10/He9gWHUObe.png)

For multiple device selection, you can also access forwarding via the <IconWithLabel iconName="arrow-forward-outline" label="Forwarding" size="1.5em" /> button in the bulk actions.

![](https://upload.r2.lb.chasm.cloud/2025/10/Yhgf34LAel.png)

## Selection

If you already have a forwarder set up, it should appear in the list of forwarders ready to select.

If no forwarders have been set up, you'll see an empty list.

:::tabs
== Single device
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/zkPvShs.png)
== Multiple devices
![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_bXJ5YB7FYB.png)
:::

## Create a Forwarder

Hit the `New` button to create a new forwarder.

You'll then be presented with a dialog to configure the forwarder.

![](https://upload.r2.lb.chasm.cloud/2025/10/Vt2B4ee5fm.png)

Enter the details for the forwarder:
 - **Name:** Something descriptive for you to identify the forwarder by.
 - **Connection:** The connection to use for the forwarder, which you must have set up previously. (Click the `+` button to create a new connection if you haven't already).
 - Forward for all devices (rather than adding individual devices to the forwarder).
 - Payload Format (Defaults to bytes):
    - **V3 Bytes**: Will forward the [raw V3 protocol bytes](/devices/api/protocol/) received from the device. You'll need to parse this yourself on the receiving end. (SDKs coming soon).
    - **V3 JSON**: Will forward a JSON object, which is translated from the V3 protocol bytes. This is easier to work with, but larger in size.
 - **Message Types Filter**: Select from the [available message](/devices/api/messages/) for the device communication protocol. Only messages of the selected types will be forwarded. You can leave blank to forward all message types.
 - **Subscription Requests**: Optionally send subscription requests to the device when it connects, to control what data is sent from the device.

Clicking `Create Forwarder` will create the forwarder.

### Subscription Requests

See [Subscriptions](/devices/api/subscriptions/) for more information on how device message subscriptions work.

The subscription requests section allows managing multiple subscription requests to be sent to the device when it connects.

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_ItQT1ADAxT.png){.center}

Clicking the `Add Subscription` button will add a new row to the subscription table.

Here, each column lines up with the relevant subscription header (see [Subscription documentation](/devices/api/subscriptions/))

A single subscription for valid position messages, every 1 second may look like this...

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_2WIrIPaDbE.png){.center}

When sent to a device, the first subscription for each message type will have the subscription ID of 0. Any additional subscriptions for the same message type will have incrementing subscription IDs (1, 2, etc).

## Connections

The connection defines how and where the data is forwarded to. Some pre-defined system connections exist, but you can also create your own custom connections.

### System connections

Some connections are provided by the system, which you can use without needing to create your own.

Currently two system connections exist: `Lightbug Cloud` and `Nowhere`.

#### Lightbug Cloud

The `Lightbug Cloud` connection allows you to forward the V3 device messages into [Lightbug Cloud](/apps/cloud/).

:::alpha Lightbug Cloud Forwarding
Devices may still directly send data to Lightbug Cloud, and thus you may receive data from both sources.

Not all message types are currently supported (see below).
:::

When using this connection for a forwarder, you do not need to select any payload or format options, as this is handled automatically by the system.

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_KlGKaWWJ00.png){.center}

##### Messages

[Position messages](/devices/api/messages/15-position) will be forwarded to Lightbug Cloud, and will appear in the device's location list. Some data fields will be `null` when forwarded, as they are not available in position message, such as battery level.

##### Subscriptions

Forwarding a device to Lightbug Cloud will automatically create a [subscription](/devices/api/subscriptions/) for [Position messages](/devices/api/messages/15-position) for the device when connected to the Chasm link.

The interval of this subscription will be determined by the device's configured reporting interval, for example a 10s device interval setting, will result in `10000ms` interval subscriptions.

The storage level `MH_STORAGE_LEVEL_NVM` will be used.

##### Access

Data can be accessed via Lightbug Cloud as normal, including via the [Cloud App](/apps/cloud/), and the [API](/apis/) as device [datapoints](/terminology/points).

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_zOCfD9oQ84.png){.center}

#### Nowhere

The `Nowhere` connection allows you to configure device subscriptions as part of forwarding, without actually forwarding data to any external service.

This is useful when you want to:

- Control or test subscriptions, without a data target, or external integration
- Debug device behavior with different subscription configurations

### Create a Connection

To create your own connection, click the "New" button, next to the connection selection on the forwarder creation dialog.

You'll then be presented with a dialog to configure the connection, which will vary depending on the type of connection you wish to create.

![]()
![]()

:::tabs
== Webhook
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_tkmI6tf1d5.png){.center}
== MQTT
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_fF0gq0mXQX.png){.center}
:::

Enter the details for the connection:
 - **Name:** Something descriptive for you to identify the connection by.
 - **Type:** The type of connection to create. Currently supported types are:
    - **Webhook (HTTP POST):** Forwards data via HTTP POST to a specified URL.
    - **MQTT:** Forwards data to an MQTT broker.
 - **Details:** The details required will depend on the connection type selected.

#### Webhook

For webhooks, you need only enter the URL to which the data should be posted.

#### MQTT

For MQTT, you'll need to select a few options:
 - **Schema and host**: The schema (mqtt:// or mqtts://) and host of the MQTT broker.
 - **Port**: The port of the MQTT broker.
 - **Username**: (Optional) The username to authenticate with the MQTT broker.
 - **Password**: (Optional) The password to authenticate with the MQTT broker.

Once setup, you'll find data in topics such as:
 - `lightbug/device/1234/v3-bytes`
 - `lightbug/device/1234/v3-json`

#### Connection testing

In both cases, you can `Test Connection` to ensure the details are correct before saving the connection.

When the test is performed, you'll receive raw `test` message string JSON encoded.

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_N1OJCHph8l.png)
