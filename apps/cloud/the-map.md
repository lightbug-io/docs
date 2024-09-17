# The Map

The app automatically opens to the Map page.

Here you can see all your devices at their latest positions.

<v-tabs v-model="tab" bg-color="#fca377">
  <v-tab value="mobile">Mobile</v-tab>
  <!-- <v-tab value="desktop">Desktop</v-tab> -->
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <v-img src="https://i.imgur.com/0QhDB7z.png" style="height:600px"/>
  </v-tab-item>
  <v-tab-item value="desktop">
  </v-tab-item>
</v-tabs-items>

## Map View Settings

To change the Map view settings, click on the layer icon.
Here you have different viewing options:

<v-tabs v-model="tab" bg-color="#fca377">
  <v-tab value="mobile">Mobile</v-tab>
  <!-- <v-tab value="desktop">Desktop</v-tab> -->
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <v-img src="https://i.imgur.com/TZEZOmT.png" style="height:400px"/>
  </v-tab-item>
  <v-tab-item value="desktop">
  </v-tab-item>
</v-tabs-items>

## Overview of Your Devices

If you would like a quick overview of the devices and their
latest position details as well as their battery status, click
the drop-down arrow.

<v-tabs v-model="tab" bg-color="#fca377">
  <v-tab value="mobile">Mobile</v-tab>
  <!-- <v-tab value="desktop">Desktop</v-tab> -->
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <v-img src="https://i.imgur.com/GqvgfVh.png" style="height:600px"/>
  </v-tab-item>
  <v-tab-item value="desktop">
  </v-tab-item>
</v-tabs-items>

::: warning ⚠️ Warning
If your last location update was 2 days ago, the information here (including battery status) is from 2 days ago.
:::

<v-tabs v-model="tab" bg-color="#fca377">
  <v-tab value="mobile">Mobile</v-tab>
  <!-- <v-tab value="desktop">Desktop</v-tab> -->
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <v-img src="https://i.imgur.com/V13ZKrN.png" style="height:600px"/>
  </v-tab-item>
  <v-tab-item value="desktop">
  </v-tab-item>
</v-tabs-items>
