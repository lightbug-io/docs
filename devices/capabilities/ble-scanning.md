# BLE Scanning

BLE scanning is a capability that allows devices to scan for nearby Bluetooth Low Energy (BLE) devices.

This can be used for a variety of applications, such as asset tracking, proximity detection, and more.

As part of BLe scanning, we collect MAC Address, RSSI, Name, and any additional advertising data that the device is broadcasting. For various known device types and advertising types this data is parsed and stored in a structured format.

## Devices

Most of our products have BLE capability (please see individual product specifications) and will record scan data.

We also provide a variety of [BLE Tag devices](/devices/peripherals) that work out of the box for BLE tagging applications.

When new BLE devices are seen, they are tracked within the Lightbug platform as an additional device of type `BleTag` and they can be attached to your account, and viewed in all applications (Cloud, Admin, APIs, etc).

## Data

### Cloud & Admin App

Both gateways and `BleTag` devices can have their position plotted on the [Cloud App map](/apps/cloud/), as well as have data visualized about them, such as temperature readings, signal strength, and more.

It's also possible to [view proximity reports](/apps/cloud/reports/proximity) based on this information, showing what devices have been near each other, and when.

### V3 Messaging

Devices that make use of V3 messaging can also make use of the [V3 share feature](/apps/admin/devices/sharing) for adhoc visualization of this data, and sharing it with others via [share.chasm.cloud](/apps/chasm/share/) where a dedicated [BLE Scan view](/apps/chasm/share/ble-scan) is available.

These messages can also be [forwarded directly into other systems](/apps/admin/devices/forwarding) and viewed [live](/apps/admin/devices/information#live) on a per device level.
