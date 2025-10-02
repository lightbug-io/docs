---
outline: deep
---
# Geofences

The geofences page is where you can see all the geofences that are set up on your account, and manage them.

## List

The first display shows you a list of all the geofences that are set up on your account.

:::tabs
== Populated
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/qv96j1O.png)
== Empty
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/XZxL11e.png)
:::

From here you can create a new geofence by clicking on the `+`. Delete them, or edit them by selecting the row.

## Creation & Editing

To create a new geofence, click the `+` button in the top right corner.

::: tip
You can also create geofences using the [API](/apis/v1/post-users-id-geofences.html), which provides you with more control over the geofence creation process.
:::

You'll be presented with a small configuration form, and a map to draw the geofence on.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/XqQSMLT.png)

The fields are:

| Field | Description |
| --- | --- |
| Name | The name of the geofence |
| Alert | Whether to trigger a [notification](/apps/cloud/account/notifications.html) when the device enters or exits the geofence |
| Type | Arbitrary categorization of the geofence, for use in reporting |

To draw the geofence, find the area that you want to cover on the map, and select either `Circle` or `Polygon` from the options.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/lF2dzUO.png)

:::tip Tip
You can click `Reset` at any time to go back to the `Polygon` / `Circle` selection.
:::

### Polygon

Select points on the map to draw the polygon.

Double click on the last point to finish drawing your polygon.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/uJDNFzz.png)

### Circle

You can set the starting radius of the circle ahead of drawing it.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/Pf6bPhe.png)

Tap / click on the map to set the center of the circle.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/baRQMzG.png)

You can adjust the size of the circle by clicking on it, and then dragging it around the map, or using one of the handles to resize it.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/ZmU7RnV.png)
