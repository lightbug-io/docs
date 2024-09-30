# Devices

Lightbug devices follow a common technical internal and external architecture.

You can find more infomation about current devices [in the devices section](/devices)

## Identity

There are various ways to identify our devices

### Serial number

Every Lightbug device has e a single unique serial number.

You should find this printed on a sticker on your device, along with a QR code that can be scanned.

![](https://i.imgur.com/Sfi9Org.png)

::: warning
On older lightbug products, a barcode might be on the outside ofthe device, instead of a QR code, and may show the device ID, rather than serial number.
:::

### Other IDs

You might find other unique identifiers exposed in various interfaces.

 - ID, internal lightbug cloud (or silo) id for the device
 - IMEI number, associated with the mobile device, that identifies the device to the network ([Wikipedia](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity))
 - ICCID number, associated with the SIM ([Wikipedia](https://en.wikipedia.org/wiki/SIM_card#ICCID))
 - Bluetooth MAC Addresss, associated with the Bluetooth radio ([Wikipedia](https://en.wikipedia.org/wiki/MAC_address))

## Modes

Our devices can generall be in one of two modes.

### Sleep mode

Will send updates based on the `beacon period` set in device configuration, by default 12 hours.

If `motion detection` is enabled, the device may wake up.

<!-- TODO link beacon period to the device setting -->
<!-- TODO link motion detection to the device setting -->

### Wake mode

Will send updates based on the `update rate` set in device configuration, by default 5 minutes.

<!-- TODO link update rate to the device setting -->

::: warning ⚠️ Warning
If your device battery level is critical, wake mode may be disabled.
Generally this is 20% or less.
:::
