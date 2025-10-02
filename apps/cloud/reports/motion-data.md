# Motion data report

The motion data report shows the motion data of the devices over a period of time.

This includes:

 - Vibration Amount
 - Maximum Tilt Event
 - Maximum force event (3d Magnitude)
 - Maximum force experiences (X)
 - Maximum force experiences (Y)
 - Maximum force experiences (Z)
 - X Tilt (Pitch)
 - Y Tilt (Roll)
 - Z Tilt (Yaw)

This data is recorded whenever a location update is sent, while the data collection is enabled.

## Configuration

There are a few things you must to to correctly set up the motion data report on a device.

::: tip
In order to get your device to send motion data at the point in time that motion occurs, you will want to enable either **Motion detection** or notifications for when **A fall or shock is detected**.

A fall will be detected if the tilt is greater than 30 degrees and or a shock of more than 1.5g is detected (defaults).
:::

### Enable data collection

To enable the report, you must enable the `Advanced Accelerometer Data` setting in the advanced device settings.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/a0GmMTN.png)

You must then reset the device twice for the changes to take effect with 10 minutes between resets.

::: info
You can reset the device by holding the button for 10 seconds, it should beep once and then the LEDs will flash.
:::

### Positioning the device

In order to get correct data for tilt values, you must configure the 0 position of the device.

If this is not done, the tilt values will be incorrect.

- Grab your tracker
- Hold the button for 3 seconds, and release, the device should do 2 short beeps, and LEDs should flash.
- Immediately place the device in desired position, this will be your baseline.

If you want to change the baseline position of the device in the future, you will need to repeat this process.

## Examples

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/8zOtUfm.png)

### Tilting

<v-row>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/tozxkKh.png" style="max-height:400px"></v-img>
    </v-col>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/AEdy391.png" style="max-height:400px"></v-img>
    </v-col>
</v-row>

### Full Rotation

<v-row>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/lQfejFG.png" style="max-height:400px"></v-img>
    </v-col>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/WsCxuqd.png" style="max-height:400px"></v-img>
    </v-col>
</v-row>

### Drop

<v-row>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/mWzM7tg.png" style="max-height:400px"></v-img>
    </v-col>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/65kXSME.png" style="max-height:400px"></v-img>
    </v-col>
</v-row>

### Tilt and Drop

<v-row>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/bHaInm2.png" style="max-height:400px"></v-img>
    </v-col>
    <v-col class="d-flex child-flex" cols="6">
    <v-img src="https://upload.r2.lb.chasm.cloud/2025/10/imgur/NG1jDYQ.png" style="max-height:400px"></v-img>
    </v-col>
</v-row>
