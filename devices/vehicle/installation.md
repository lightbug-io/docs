# Installation

The Vehicle Tracker is a simple device to install.

It is designed to be installed by anyone with basic knowledge of vehicle maintenance.

::: warning
Images in this guide are for illustrative purposes only and currently features our older VT2 device.
If you purchase a vehicle tracker today, you will receive the VT3 device.
:::

## Tools

You will likely need the following tools to complete installation:

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/rKFNxsu.png){width=300 style="float:right"}

 - Long Nose Pliers
 - Wire cutters or strippers
 - Screwdrivers
 - Multi-meter / Tester
 - Spanners
 - Cable ties
 - Insulation tape

## Finding the fuse box

Every vehicle has a fuse box. Here are a few steps on how to find the fuse box inside the car.

::: info
Fuses are very important because without them several electronic devices, such as the electric windows, the power locks, the lights and radio would not work.
:::

The below pictorial representation shows only one particular scenario, but they may vary from car to car.

<!-- TODO factor this out into a component -->
<v-row>
    <v-col>
        <v-img
            src='https://upload.r2.lb.chasm.cloud/2025/10/imgur/xvugmzY.png'
            alt='Example diagram of fusebox locations'
            max-width="250px"
        />
    </v-col>
    <v-col>
        <ol>
            <li>Passenger fuse box</li>
            <li>Compartment fuse box</li>
        </ol>
    </v-col>
</v-row>

### Step 1: Check the manual

Check your vehicle owner’s manual and familiarize yourself with the location of the fuse boxes.

One is usually under your dashboard, to the side of your steering wheel and the other one is normally located under the hood of the car.

### Step 2: Primary box

Locate the first fuse box which is usually located on the driver’s side of the car under the hood.

It is usually black and clearly marked.

### Step 3: Secondary box

The second fuse box will be found under the dashboard below the steering wheel.

It may be hidden, but will be clearly marked.

Remove the cover and you will note that the fuses are smaller in this fuse box, compared to the one under the hood.

::: info
Occasionally this fuse box is located in the boot of the vehicle.
:::

## Fitting the tracker

### Step 1: Prep wires

The VT3 device wires come with a removable insulation end which should suffice for connection.

If you need more wire exposed, you can use wire cutters to strip the wire.

![Wire stripping](https://upload.r2.lb.chasm.cloud/2025/10/imgur/F2ROuT5.png)

### Step 2: Access fuse box

Identify the location of the secondary fuse box, and open/remove the cover.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Car_fuse_box_Layout.jpg/640px-Car_fuse_box_Layout.jpg)

### Step 3: Identify the fuses

Connect one side of the tester to any grounded metal part of the vehicle.

Check each fuse with the other side of the tester to locate a “direct” fuse and an “ignition” fuse.

If the tester shows current while the vehicle is turned off, it is a “direct” connection fuse.

If the tester shows current only when the vehicle is turned on, it is an “ignition” connection fuse.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/D3d4c4K.png)

::: info
Always try to use fuses with a low current - eg 5A, 7.5A, 10A, & 15A.
:::

### Step 4: Connect to direct current

Remove the chosen “direct” fuse using the nose pliers.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/xubSP5V.png)

Connect the red wire to one of the fuse legs.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/iafp2W9.png)

Using the tester, test both pins from the fuse holder to identify which side has the current.

Return the fuse to the same slot ensuring that the leg with the red wire attached, is inserted to the side that holds no current.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/jFVRuv3.png)

### Step 5: Connect to ignition current

Remove the chosen “ignition” fuse using the nose pliers.

Connect the yellow wire to one of the fuse legs.

Using the tester, test both pins from the fuse holder to identify which side has the current when the ignition is on.

Return the fuse to the same slot ensuring that the leg with the yellow wire attached, is inserted to the side that holds no current when the ignition is on

### Step 6: Connect to earth

Connect the black wire to a grounded metal part of the vehicle.

This can be done by removing a screw, placing the wire and screwing it back in.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/qSuXSXQ.png)

### Step 7: Connect the tracker

The vehicle tracker can now be connected via the 3 pin connector.

::: warning
Ensure the plug is correctly oriented and aligned with the socket before pushing it in.
:::

<!-- ![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/c7zaNPd.png) TODO update image of cable connection for VT3 -->


### Step 8: Check functionality

Before attaching the tracker and cables to the vehicle, ensure the device is in good working order.

Should the wiring be correctly fitted, the battery of the tracker will be charging and a blue light will be visibly glowing through the plastic.

You can also check the [vehicle connection status](/devices/vehicle/#vehicle-connection-status) with a button press to make the other device LEDs light up.

### Step 8: Secure the tracker

If you are satisfied with the connections and that the tracker is behaving normally it's time to mount the tracker.

Fold and tie all the connecting cables neatly, using cable ties and insulation tape.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/SaDkRZw.png)

Locate a suitable place for mounting the tracker.

::: info
Always keep in mind that the device works optimally when mounted in such a way that it has clear visibility of the sky, without metal obstructions.
:::

::: warning
Please be aware that some vehicles do have metal in the windscreen, this can obstruct the tracker.
:::

Use cable ties to mount the tracker to the vehicle.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/Kp9WmiA.png)

Ensure that the device and cables are firmly fastened to the vehicle and will not shake loose, and so that there are no irritating vibrations nor sound when the vehicle is moving.

![](https://upload.r2.lb.chasm.cloud/2025/10/imgur/qhWL4qk.png)
