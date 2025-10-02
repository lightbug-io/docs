---
outline: deep
order: 7
---
# Device information

Verbose information about the device, including:
 - Overview: General device state information, and summarized device information over time.
 - Timeline: A detailed timeline of data received from the device, and received by SIM providers.
 - Config Pages: Current config pages applied to the device.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/GnwHbXd.png)

## Plan

The top of the overview summarizes the current plan and billing state of the device.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/tIjgUsM.png)

## Metric Summary

An expandable overview of some device metrics, errors, sends and power usage are then displayed.
You can mouse over the graphs to see more details about the data.

Use the `+1 Day` and `+1 Week` buttons to expands the time range of the graph into the past.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/alZiO0u.png)

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

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/oIgFTmS.png)

## Timeline

The timeline shows a detailed view of events from and related to the device.

This will poll for new events as they happen, so you should be able to see your device connecting and sending data when active.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/WoevCJG.png)

:::warning
If your device has not recently sent any data, you might find the timeline empty, or timing out.
:::

## Config Pages

The config pages tab shows the current config pages applied to the device.

You can remove config pages by clicking the `X` icon next to the config page name.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/nrXrJW2.png)
