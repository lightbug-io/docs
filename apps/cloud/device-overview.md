# Device overview

You can see an overview of your devices on [the map](the-map).

Below we see an example account with 17 devices.

<v-tabs v-model="tab" bg-color="#fca377">
  <!-- <v-tab value="mobile">Mobile</v-tab> -->
  <v-tab value="desktop">Desktop</v-tab>
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <!-- <v-img src="https://i.imgur.com/2NMm8Zo.png" style="height:600px"/> -->
  </v-tab-item>
  <v-tab-item value="desktop">
    <v-img src="https://i.imgur.com/XWPqXVX.png"/>
  </v-tab-item>
</v-tabs-items>

### Device list

Clicking the drop down arrow will list all devices on the account, including basic details.

 - **Name**: The user configurable name of the device
 - **Location**: The last known location of the device, using words, such as an address
 - **Color**: The user configurable color of the device
 - **Tags**: The tags applied to the device, including automatically applied tags such as zones
 - **State**: The last known state of the device, such as moving or stationary
 - **Update time**: The time of the last update from the device
 - **Battery**: The last reported battery level of the device

<v-tabs v-model="tab" bg-color="#fca377">
  <!-- <v-tab value="mobile">Mobile</v-tab> -->
  <v-tab value="desktop">Desktop</v-tab>
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <!-- <v-img src="https://i.imgur.com/2NMm8Zo.png" style="height:600px"/> -->
  </v-tab-item>
  <v-tab-item value="desktop">
    <v-img src="https://i.imgur.com/mhjxEKH.png" style="height:400px"/>
  </v-tab-item>
</v-tabs-items>

### Device selection

Clicking on a device in this list will:

 - Select it
 - Center the map on its last known location
 - Provide additional options for the device

<v-tabs v-model="tab" bg-color="#fca377">
  <!-- <v-tab value="mobile">Mobile</v-tab> -->
  <v-tab value="desktop">Desktop</v-tab>
</v-tabs>
<v-tabs-items v-model="tab">
  <v-tab-item value="mobile">
    <!-- <v-img src="https://i.imgur.com/2NMm8Zo.png" style="height:600px"/> -->
  </v-tab-item>
  <v-tab-item value="desktop">
    <v-img src="https://i.imgur.com/ha3wvuP.png"/>
  </v-tab-item>
</v-tabs-items>

The left hand side drop down can now be used to show the datapoints for the device in the selected time range.

Additional icons surround the tracker dot, which present additional infomation and options:

 - **Settings**: Navigate to the settings page for the device
 - **Open in maps**: Open the device location in Google Maps (if configured in user settings)
 - **Show Bluetooth devices**: Show any Bluetooth devices that have been detected by the tracker (paired and unpaired)
 - If the latest point is not accurate or is old
 - If rotation, motion, or a drop were detected
