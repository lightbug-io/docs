# Device view

You can view detailed information about a device by clicking on the device row in the device list, or on the map.

The device view focuses in on a single device point, and shows detailed information about the device, as well as the [history of the device](#history-list) for the selected time period.

:::tabs
== Desktop
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/sIVl24t.png)
== Mobile
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/xJ3sqRC.png)
:::

## Details

In the top left of the device view, you will see the device name, color, as well as information about the last transmission.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/rSNOeNC.png){.center}

<!-- TODO clicking the info bar, opens Device Information -->

Clicking the dropdown will open the [History list](#history-list) for the device.

## Time range

The time range that is currently being used is displayed at the bottom of the map.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/5BTlmMJ.png){.center}

By default, the map view time range selection is set to midnight yesterday, to the current time today.

Options exist in [user preferences](/apps/cloud/account/preferences) to alter this default.

Clicking on the time range selector will open a panel where you can change the time range.

:::tabs
== Desktop
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/NMijD9C.png)
== Mobile
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/ku85nHB.png)
:::

The time range selector allows you to choose a custom time range, or one of the predefined options.

When clicking `DONE` you will be taken back to the map view with the new time range applied.

::: warning
The time range selector can only be used to show at most 90 days of data at once.
:::

## Data & Playback

Next to the time range selector, you will see a playback button.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/5BTlmMJ.png){.center}

Clicking this will open the playback panel at the bottom of the page.

Mousing over the graph will displays data names and values.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/EEb61bj.png){.center}

:::tip
This is best viewed on a desktop, as the playback panel is quite large.
:::

### Navigation {#data-playback-navigation}

You can alter the time range, to show more or less data within this view.

Within the selected time range, you can use the playback controls (direction keys) to navigate through the data points.

You can also choose to drag the playback slider to a specific point in time.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/yzEEsvE.png){.center}


### Options {#data-playback-options}

Clicking the menu icon in the top left of the playback panel will open a menu with options to:

- Show and hide various data lines
- Export the visualized data as a PNG, PDF or CSV

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/nmZCKGB.png)

Example CSV data might look like this:

```csv
"DateTime","Altitude","chg_voltage","Humidity","Pressure","Speed","Temperature","Temperature (basic)"
"2025-04-01 10:25:51",,4900,0,0,,0,34.11328125
"2025-04-01 10:40:58",,4900,32,1018,0,31.89,34.84765625
```

## History list

The history list can be accessed by clicking the dropdown in the top left of the device view.

:::tabs
== Desktop
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/vjZFWL4.png)
== Mobile
![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/vnZ9r0p.png)
:::

The list shows all the locations transmitted by the in the given [time range](#time-range).

You can hover over a location in the list to see extra information (such as accuracy).

You can click on any of the locations to, zoom to the location.

<!-- TODO include documentation on trip view vs non trip view.. -->

## Dot

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/rCwVSve.png)

<!-- TODO add all the dots.. -->

General control

- White: Device configuration
- Yellow: Take me to this point on google maps (account preference to enable)
- Red X: Close

Some dots represent device seen.  The number on each of the dot represents the number of devices seen throughout the time frame.

- Blue: BLE Devices (Paired or unpaired)
- Orange: Other nearby Lightbug devices

Any events that have occurred will be shown on the map as a dot.

- Rotation sign (arrows)
- Drop detection (triangle)
