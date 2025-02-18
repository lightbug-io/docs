---
aside: true
outline: [1,3]
---
# Controls

## Map view settings

To change the Map view settings, click on the layer icon in the top right corner.

![Map View Layer button](https://i.imgur.com/L49Owzb.png)

This will open a panel where you can change the map view settings.

:::tabs
== Desktop
<v-img src="https://i.imgur.com/MyNO8SA.png" style="max-height:400px"/>
== Mobile
<v-img src="https://i.imgur.com/MGsCDkH.png" style="max-height:400px"/>
:::

The two sections allow choice of tile set and layers to be displayed.

### Tile choices

| Tile set| Description |
| --- | --- |
| Street | Mapbox provided OSM tiles |
| Satellite | Mapbox provided satellite tiles (maxar) |
| Hybrid | A combination of Street and Satellite tiles |
| Traffic | Street tiles with traffic information |

:::tabs
== Street
<v-img src="https://i.imgur.com/ldqnhzg.png" style="max-height:400px"/>
== Satellite
<v-img src="https://i.imgur.com/iswsEo0.png" style="max-height:400px"/>
== Hybrid
<v-img src="https://i.imgur.com/nAfcXxf.png" style="max-height:400px"/>
== Traffic
<v-img src="https://i.imgur.com/PdynzXc.png" style="max-height:400px"/>
:::

### Layer choices

Devices are always shown on the map, but you can choose how they are displayed, and also turn off some additional layers.

| Layer             | Description                                                                     |
| ----------------- | ------------------------------------------------------------------------------- |
| Device clustering | Cluster devices together under a single point, with a count, when zoomed out    |
| Zones             | Display zones outlined on the map                                               |
| Beacons           | Display beacons on the map based on metadata                                    |
| Zone Counters     | Display number of devices in defined zones / geofences at the bottom of the map |

#### Device clustering

| Clustered                                     | Not Clustered                                     |
| --------------------------------------------- | ------------------------------------------------- |
| ![Clustered](https://i.imgur.com/N7tKJIC.png) | ![Not Clustered](https://i.imgur.com/oo3aNqQ.png) |
| Clusters show the number of devices within an area | Each device is shown individually on the map, [optionally with the name](/apps/cloud/account/preferences) |

Clicking on a cluster will zoom in to show the individual devices, or smaller clusters.

Clicking on an individual device will open the [device information panel](/apps/cloud/map/device-view).

<!-- TODO add image example of a zone -->
<!-- TODO add image example of a beacon -->
<!-- TODO add image example of the zone counters -->
