# Tags

The tags feature enables arbitrary key-value pairs (tags) to be associated with a device.

Tags appear in the device list, and can be used to filter devices, as well as appearing in reports.

Some are provided by default.

![](https://i.imgur.com/STjaikd.png)

## User tags

User tags are tags that are set by the user, and can be anything you like (within reason).

![](https://i.imgur.com/x6Vq0gm.png)

To add a tag, type in the empty `Tag name` and `Tag Value` fields.

A summary of your tag changes will be shown.

![](https://i.imgur.com/yup6WYH.png)

Clicking on `Save` will save the tags to the device.

![](https://i.imgur.com/pZ7ZDlp.png)

## Auto-Generated tags

The auto-generated tags are tags that are set by the system, and cannot be changed.

![](https://i.imgur.com/8ZA0ajA.png)

Common auto-generated tags include:

| Tag name | Description |
| --- | --- |
| Type | Type of the device |
| id | The device's unique identifier |
| sn | The device's serial number |
| is | Generic tag, primarily used to show a device is `nearby` when using a mobile app with Bluetooth enabled and a Bluetooth enabled device |
| warning | Is the device in a warning state, `LowBattery` or `NoConnection`|
| LastSeen| The time category the device was last seen in `<24H`, `<3D`, `<7D` |
| ignition | Is the device's ignition on or off (for devices that support this) |
| state | The devices current mode, `Trracking`, `Sleep`, `Alert`, `Flight Mode`... |
| zone | Zones that the device is currently in |
| SafeZone| Is the device `inside` or `outside` a safe zone |
| lastZoneList | see inventory reporting... |
| timeSinceFirstEntry | see inventory reporting... |
| currentZoneList | see inventory reporting... |
| timeInZone | see inventory reporting... |
