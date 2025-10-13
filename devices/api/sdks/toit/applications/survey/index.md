---
outline: [2,3]
---
# Survey

The survey application is designed for easily demoing the Toit capabilities of the RH2 device.

When installed on an RH2 Device, it is accessible via the `Actions` menu of the [main screen](/devices/rtk/handheld/application).

The application allows for collecting up to 100 GNSS points with or without RTK correction data, either manually or automatically based on distance, and sending them to the cloud for further processing or viewing (via [share.chasm.cloud](/apps/chasm/share/)).

## Interface

The application is designed to be used with the RH2 device, and its button interface.

Many screens present options above the buttons, which can be selected using the corresponding button.

When in a menu, the left and right buttons can be used to navigate between options, with the center button used to select the currently highlighted option.

The application is split into three main screens.
Depending on how the application is loaded onto the device, you may also find an initial App selection menu.

### Apps

The app selection screen allows selecting any of the installed applications on the device, including the ability to switch back to the main device application, or reboot the device.

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_I8ns15cyLB.png)

You can select the `Survey` options to launch the survey application, by navigating to it and pressing the center button.

### Home

When the survey application is launched, you will be presented with the home screen, including the standard device status bar, as well as new button options, and information that will be populated while the survey is in progress.

This screen can take a few forms, depending on the current state of the application.

When the application is idle, the screen will prompt you to [start a new survey](#surveying), or navigate to the [Info](#info) or [Actions](#actions) screens.

:::tabs
== E-Ink
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_8CTt8Sv1FG.png)
== Web App
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_erGwlLVCvH.png)
:::

If the device is configured to have a WiFi connection, you'll also find the device accessible via a basic web interface, mirroring the information on the device screen, and sub menus.

When [surveying](#surveying) is in progress, the screen will update to show the current status of the survey, including GNSS fix information, and the number of points collected.

### Info

The `Info` screen displays information about the application connectivity.

:::tabs
== WiFi mode
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_raFyujiYaE.png)
== AP mode
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_8Fhippah0Y.png)
:::

 - **Share**: A random code associated with this load of the survey application, which can be used to retrieve any cloud submitted data using [share.chasm.cloud](/apps/chasm/share/). The share code to enter into the viewer will be the date of submission, follow by the share code, e.g. `20250930-af3ge911e5`.
 - **Conn** : Will either be `WiFi` or `WiFi AP`, depending on the current connectivity mode. If not WiFi credentials are configured on the ESP32, then this will always be `WiFi AP`, where the device will run its own access point (and also display connection details)
 - **IP** : The current IP address of the device on the WiFi network, or the access point IP if in AP mode.
 - **WiFi Net** : The SSID of the WiFi network the device is connected to (if in station mode).
 - **AP Name** : The SSID of the access point the device is running (if in AP mode).
 - **AP Pass** : The password of the access point the device is running (if in AP mode).

### Actions

:::tabs
== Menu page 1
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_y4UbjFOr5N.png)
== Menu page 2
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_tEukp4Wsec.png)
:::

- **Go Back**: Return to the application [home screen](#home)
- **Clear Points**: Clear any collected survey points from the device memory.
- **Send to cloud**: Send any collected survey points to the cloud, where they can be [forwarded to other services](/apps/admin/devices/forwarding), or viewed using [share.chasm.cloud](/apps/chasm/share/).
- **RTK**: Can be used to toggle the [RTK corrections data](/devices/api/messages/39-gps-control) on or off.
- **Mode**: Can be used to toggle between various survey modes.
- **Auto**: Can be used to toggle automatic point collection on or off, based on a calculated distance from last point for the auto mode.
- **Stop**: Stop any ongoing survey.
- **Exit**: Exit the survey application, returning to the main device application, or previous application selection screen.

## Surveying

To start a survey, press the `Start` button on the home screen or web app.

You'll see the page update to show the current survey status, as it attempts to get a GNSS and RTK fix.

:::tabs
== E-Ink
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_TkfFFtmRdE.png)
== Web App
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_p2KHTFZb3v.png)
:::

As the GNSS fix is acquired, the status will update to show the current number of satellites, and the current accuracy, fix type, and coordinate location.

:::tabs
== E-Ink
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_8KDy4Fm9K7.png)
== Web App
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_JbsaLxjqMa.png)
:::

### Button mode

When in button mode (the default), you can manually collect points by pressing the center `Store` button, or the `Store` button on the web app.

Doing so will collect the more recently receive GNSS point, and add it to the list of collected points.

The last 2 points collected will be shown on the screen E-Ink screen, along with the total number of points collected.

The web app will show a larger list of the most recently collected points.

:::tabs
== E-Ink
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_TI8Nrk7D1a.png)
== Web App
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_f7N2pImSqj.png)
:::

### Continuous mode

When in continuous mode, points will be automatically collected based on the distance moved from the last collected point.

To activate continuous mode, navigate to the [Actions](#actions) menu, and select the `Mode` option until `Continuous` is shown. You can then select the continuous distance using the `Distance` option.

:::tip
You may want to acquire a good GNSS fix before starting continuous mode, to avoid collecting points with poor accuracy, as the application will still calculate distance based on these GNSS points.
:::

When in continuous mode, and a survey is in progress, the middle button will no longer collect points.

:::tabs
== E-Ink
![=500x](https://upload.r2.lb.chasm.cloud/2025/10/chrome_tI7unbjce6.jpg)
:::

## Cloud submission

The RH2 device will be sending periodic location updates to the cloud while a survey is in progress if you have RTK corrections enabled, or have a cloud position subscription activated (the default for new devices).

However, the collected survey points can be sent in addition to this, with extra headers, that publish them directly to [share.chasm.cloud](/apps/chasm/share/).

To send the collected points to the cloud, navigate to the [Actions](#actions) menu, and select the `Send to cloud` option.

You should see a green LED flash per successfully sent point, or a red LED flash if there was an error sending a point.

From the [Info](#info) screen, you can note the `Share` code, which can be used to view the submitted points using [share.chasm.cloud](/apps/chasm/share/), using the format `YYYYMMDD-<share code>`, e.g. `20250930-af3ge911e5`.

### Our Carpark

An example of using the button mode to collect points around our carpark, and sending the points to the cloud is accessible using https://share.chasm.cloud/#10579203/20250930-1f3ce921e8

![](https://upload.r2.lb.chasm.cloud/2025/10/chrome_fNPGAz03uf.png)

You can see further documentation on using [share.chasm.cloud](/apps/chasm/share/) to view and export the data in various formats.

## Code

The Toit application code is open source, and available on [GitHub](https://github.com/lightbug-io/toit-lightbug/blob/main/src/apps/survey/survey.toit), currently comprising of just under 1000 lines of custom code.

As some of the patterns used in the application are factored out into the core Lightbug SDK, we expect the number of lines of code required for similar applications to reduce over time.

## Known Limitations

- The application is designed for demo purposes, initially to showcase the Toit capabilities of the RH2 device, and is not intended for use on other devices, or for production use.
- Entering any WiFi details by hand will in future be improved with QR codes, as will linking to [share.chasm.cloud](/apps/chasm/share/) shared sets of data.
- A hybrid mode for point collection (manual button pressed and automatic distance) is not currently supported, but has been requested, and may be added in the future.
- Button presses are currently only sent between processors on releasing the button, which leads to some unnecessary delays in the UI updates, due to the way that the [button press message and subscriptions work](/devices/api/messages/38-button-press). We will be introducing an additional message type to allow for immediate button press notifications in the future (on press, not after press).
- Button presses and menu synchronization : Currently the application doesn't know which menu items are selected, only which buttons are pressed through time. As a result the application can decide differing options are being selected. This will be fixed with "menu selection information" being sent alongside button presses in the future.
- 100 point limit for surveys, which should be sufficient for demo purposes, but may be too low for some use cases. The application currently only stores points in memory, and does not persist them to flash. The final release of the RH2 will come with additional memory, and Toit applications can also use of [buckets](https://libs.toit.io/system/storage/class-Bucket) to store data persistently and allow for more point storage.
