---
outline: deep
---
# Devices

The default view is the device list, which shows all devices in the account.

![Lightbug Admin device list](https://i.imgur.com/pHBzHGL.png)


## Fields

The device list shows the following fields:
- Identifiers: Static [identifiers](/terminology/devices#identity) for the device.
    - ID
    - Serial Number
    - IMEI
    - ICCID
- Names
    - Name: User defined name for the device.
    - Type: Device type, such as `ZeroN` etc.
    - Tags: User defined [tags](/terminology/devices#tags) for the device.
- Seen
    - Last: Time the device was last seen by the Lightbug platform, this may not be a 1:1 match with when data was last received.
    - First: Time the device was fist seen by the Lightbug platform, likely around the time it was manufactured.
- Users
- Plan details
- Firmware
- Status
    - Battery
    - Enabled
- [Actions](#actions)

## Filters

Filters can be used to narrow down the list of devices.

Such as all `ZeroN` devices.

![](https://i.imgur.com/JkdXTz6.png)

## Actions

The devices table has a number of actions that can be performed on devices, either in row actions, or via buttons on the right hand side of the rows, or via bulk actions having multiple devices selected.

### In row actions

Some actions are available on the device list itself, by interacting with various fields.

#### Reveal ICCID & IMEI

Click the `(more)` link in the identifiers column to reveal the ICCID and IMEI of the device.

![](https://i.imgur.com/xoTN8ga.png)

#### Set device name

Hovering over a device name will reveal a pencil icon, which can be clicked to edit the device name.

Hit `Enter` to save the new name, or `Escape` to cancel.

![](https://i.imgur.com/22CIjYw.png)

#### Schedule Firmware Update

Clicking on the firmware version will open a dialog allowing you to schedule a firmware update for the device.

![](https://i.imgur.com/sK66Th6.png)

### Button Actions

Some per device actions are available via buttons on the right hand side of the rows, these are:

![](https://i.imgur.com/vOxhOLt.png)

- Activate / Deactivate
- [Manage Users](#manage-users)
- Manage Settings
- [See Device information](#device-information)
- [Manage Forwarding](#manage-forwarding)

#### Manage Users

Clicking on the manage users icon will open a dialog allowing you to add or remove users from the device.

Users can have different global permissions, which can be controlled from the [users page](/apps/admin/users#permissions).

![](https://i.imgur.com/yIbkNpT.png)

Clicking `Add User`, open an additional dialog allowing you to select a user from the list of users on your account, or create a new user.

##### Add Existing user

In order to select an existing user, click on their name from the list.

![](https://i.imgur.com/5aFeQlp.png)

On success, you'll see a confirmation message in the top right corner.

:::warning
If the user already exists, and they are not a sub user of your account, you will not be able to select them.
If this is the case please contact support to get them added to your account.
:::

##### Add New user

To create a new user, click on the `Create New` button.

This will open a dialog allowing you to enter the new users details.

![](https://i.imgur.com/QEnoQwF.png)

Once you have entered the details, click `Create` to create the user.

On success, you'll see a confirmation message in the top right corner.

:::warning
If the user already exists, you will not be able to create an account for them.
:::

##### Remove a user

To remove a user from the device, click on the `X` icon next to their name.

![](https://i.imgur.com/HBqlqN1.png)

#### Device information

Verbose information about the device, including:
 - Overview: General device state information, and summarized device information over time.
 - Timeline: A detailed timeline of data received from the device, and received by SIM providers.
 - Config Pages: Current config pages applied to the device.

![](https://i.imgur.com/GnwHbXd.png)

##### Plan

The top of the overview summarizes the current plan and billing state of the device.

![](https://i.imgur.com/tIjgUsM.png)

##### Metric Summary

An expandable overview of some device metrics, errors, sends and power usage are then displayed.

You can mouse over the graphs to see more details about the data.

Use the `+1 Day` and `+1 Week` buttons to expands the time range of the graph into the past.

![](https://i.imgur.com/alZiO0u.png)

This data is then summarized further with some key metrics.

- Total Time
- Total Points
- Avenge Signal
- Average Points per transmit
- Average Time Between Points
- Average Time Between
- Average Power per Transmit
- Average Power per Point
- Battery percent and voltage at start of the time range.
- Battery percent and voltage at end of the time range.
- Max battery voltage during the time range.

And a breakdown of the source of locations received during the time range.

![](https://i.imgur.com/oIgFTmS.png)

##### Timeline

The timeline shows a detailed view of events from and related to the device.

This will poll for new events as they happen, so you should be able to see your device connecting and sending data when active.

![](https://i.imgur.com/WoevCJG.png)

:::warning
If your device has not recently sent any data, you might find the timeline empty, or timing out.
:::

##### Config Pages

The config pages tab shows the current config pages applied to the device.

You can remove config pages by clicking the `X` icon next to the config page name.

![](https://i.imgur.com/nrXrJW2.png)

#### Manage Forwarding

Forwarding is a new feature that allows you to forward data from your devices to other services, currently webhooks and MQTT.

![](https://i.imgur.com/zkPvShs.png)

This will replace similar messaging based on Notifications, which is only accessible via API or the [Cloud app](/apps/cloud/account/notifications).

If you would like to use this feature, please contact support to get it enabled on your account, as it is not yet at General Availability.

### Bulk actions

You can select multiple devices and perform actions on them by using the check boxes at the left of each row.

![](https://i.imgur.com/Y2LyH7r.png)

#### Export

Exporting selected devices will display a modal allowing you to copy a IDs, Serial numbers, IMEIs or ICCIDs in a bulk format.

![](https://i.imgur.com/GiLWsY4.png)

#### Settings

Settings allows you to change the settings of multiple devices at once, making use of [config pages](./configs.html) that you have on your account.

![](https://i.imgur.com/MTQGSiH.png)

<!-- TODO document "link device to this config" -->

#### Users

Allows, bulk adding or removing of users from the selected devices.

![](https://i.imgur.com/KIweB1w.png)

#### Tags

Allows, bulk adding or removing of tags from the selected devices.

Devices with no tags will allow you to add new tags.

![](https://i.imgur.com/KjnS0iT.png)

Changes can be reviewed before they are applied.

![](https://i.imgur.com/lE4YthQ.png)

If selected devices have a mixture of tags, they will be shown differently in the existing tags list.

![](https://i.imgur.com/ES7HrLi.png)

Tags can be:
 - Removed from all devices, using the bin icon.
 - Applied to all devices by clicking tags only applied to "Some devices" (in yellow).

#### Activate / Deactivate

Bulk activations and deactivations of devices.
