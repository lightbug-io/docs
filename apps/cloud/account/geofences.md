---
outline: deep
---
# Geofences

The geofences page is where you can see all the geofences that are set up on your account, and manage them.

## List

The first display shows you a list of all the geofences that are set up on your account.

:::tabs
== Populated
![](https://i.imgur.com/qv96j1O.png)
== Empty
![](https://i.imgur.com/XZxL11e.png)
:::

From here you can create a new geofence by clicking on the `+`. Delete them, or edit them by selecting the row.

## Creation & Editing

To create a new geofence, click the `+` button in the top right corner.

::: tip API hint
You can also create geofences using the [API](/apis/v1/post-users-id-geofences.html), which provides you with more control over the geofence creation process.
:::

You'll be presented with a small configuration form, and a map to draw the geofence on.

![](https://i.imgur.com/XqQSMLT.png)

The fields are:

| Field | Description |
| --- | --- |
| Name | The name of the geofence |
| Alert | Whether to trigger a [nottification](/apps/cloud/account/notifications.html) when the device enters or exits the geofence |
| Type | Arbritrary categorization of the geofence, for used in reporting |

To draw the geofence, find the area that you want to cover on the map, and select either `Circle` or `Polygon` from the options.

![](https://i.imgur.com/lF2dzUO.png)

:::tip Tip
You can click `Reset` at any time to go back to the `Polygon` / `Circle` selection.
:::

### Polygon

Select points on the map to draw the polygon.

Double click on the last point to finish drawing your polygon.

![](https://i.imgur.com/uJDNFzz.png)

### Circle

You can set the starting radius of the circle ahead of drawing it.

![](https://i.imgur.com/Pf6bPhe.png)

Tap / click on the map to set the center of the circle.

![](https://i.imgur.com/baRQMzG.png)

You can adjust the size of the circle, byt clicking on it, and the dragging it around the map, or using one of the handles to resize it.

![](https://i.imgur.com/ZmU7RnV.png)
