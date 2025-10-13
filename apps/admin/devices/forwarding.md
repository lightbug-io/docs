---
outline: shallow
order: 8
---
# Manage Forwarding

:::tip Device compatibility
Forwarding is only available for devices that make use of the V3 protocol for messaging.
This currently includes the [RtkHandheld2](/devices/rtk/handheld/), [VehicleRtk](/devices/rtk/vehicle), Viper and ZCard devices.
:::

Forwarding allows you to forward data from your devices to other services, via a configured connection.

This will replace similar messaging based on Notifications, which is only accessible via API or the [Cloud app](/apps/cloud/account/notifications).

## Selection

If you already have a forwarder set up, it should appear in the list of forwarders ready to select.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/zkPvShs.png)

If not forwarders have been set up, you'll see an empty list.


## Create a Forwarder

Hit the `New` button to create a new forwarder.

You'll then be presented with a dialog to configure the forwarder.

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_FmZ5CB1RJ2.png)

Enter the details for the forwarder:
 - **Name:** Something descriptive for you to identify the forwarder by.
 - **Connection:** The connection to use for the forwarder, which you must have set up previously. (Click the `+` button to create a new connection if you haven't already).
 - Payload Format (Defaults to bytes):
    - **V3 Bytes**: Will forward the [raw V3 protocol bytes](/devices/api/protocol/) received from the device. You'll need to parse this yourself on the receiving end. (SDKs coming soon).
    - **V3 JSON**: Will forward a JSON object, which is translated from the V3 protocol bytes. This is easier to work with, but larger in size.
 - **Message Types Filter**: Select from the [available message](/devices/api/messages/) for the device communication protocol. Only messages of the selected types will be forwarded. You can leave blank to forward all message types.

Here you can also choose to `Forward for all devices`, rather than adding individual devices to the forwarder.

Clicking `Create Forwarder` will create the forwarder.

## Connections

Before you can configure a forwarder, you must first create a connection to the service you wish to forward data to.

To do this, click the "New" button, next to the connection selection on the forwarder creation dialog.

### Create a Connection

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

#### Connection testing

In both cases, you can `Test Connection` to ensure the details are correct before saving the connection.

When the test is performed, you'll receive raw `test` message string JSON encoded.

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_N1OJCHph8l.png)
