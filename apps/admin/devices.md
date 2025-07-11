---
outline: deep
---
# Devices

The default view is the device list, which shows all devices in the account.

![](https://i.imgur.com/2Yok4An.png)

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

![](https://i.imgur.com/utUiBDm.png)

## Actions

Some actions can be applied on a per device level, these all exist on the right hand side of the rows.

![](https://i.imgur.com/389vSgB.png)

- Activate / Deactivate
- Manage Users
- Manage Settings
- Display device information
- Migrate

### Manage Users

Clicking on the manage users icon will open a dialog allowing you to add or remove users from the device.

Users can have different global permissions, which can be controlled from the [users page](/apps/admin/users#permissions).

![](https://i.imgur.com/yIbkNpT.png)

Clicking `Add User`, open an additional dialog allowing you to select a user from the list of users on your account, or create a new user.

#### Add Existing user

In order to select an existing user, click on their name from the list.

![](https://i.imgur.com/5aFeQlp.png)

On success, you'll see a confirmation message in the top right corner.

#### Add New user

To create a new user, click on the `Create New` button.

This will open a dialog allowing you to enter the new users details.

![](https://i.imgur.com/hKBzdYU.png)

Once you have entered the details, click `Create` to create the user.

On success, you'll see a confirmation message in the top right corner.

#### Remove a user

To remove a user from the device, click on the `X` icon next to their name.

### Device information

Verbose information about the device, such as the last known location, battery level, and more.

![](https://i.imgur.com/RmIDMBR.png)

Additional options are available for display:

- Show/Hide Log
    - Show/Hide Info
    - Show/Hide Status
- Show/Hide latest points
- Show/Hide attached config pages

#### Log

Show meta data surrounding the submission of points.

![](https://i.imgur.com/RBxExdU.png)

You can toggle `Info` and `Status` from this list using the buttons.

#### Latest Points

Shows some of the most recent [points](/terminology/points.html) for the device.

![](https://i.imgur.com/K7Js6XF.png)

## Bulk actions

You can select multiple devices and perform actions on them by using the check boxes at the left of each row.

![](https://i.imgur.com/Y2LyH7r.png)

### Export

Exporting selected devices will display a modal allowing you to copy a IDs, Serial numbers, IMEIs or ICCIDs in a bulk format.

![](https://i.imgur.com/GiLWsY4.png)

### Settings

Settings allows you to change the settings of multiple devices at once, making use of [config pages](./configs.html) that you have on your account.

![](https://i.imgur.com/MTQGSiH.png)

<!-- TODO document "link device to this config" -->

### Users

Allows, bulk adding or removing of users from the selected devices.

![](https://i.imgur.com/KIweB1w.png)

### Tags

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

### Activate / Deactivate

Bulk activations and deactivations of devices.
