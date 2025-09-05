
# Getting started

::: warning ⚠️ main branch documentation
This documentation is currently for the `main` branch of the Toit SDK, which is under active development.

There are pinned early releases available, but they may be out of date in comparison to this documentation.
:::

### 1. Get an ESP32 enabled device

ESP32s are being introduced on some Lightbug devices, such as the [RTK handheld (RH2)](/devices/rtk/).

You'll need one of these devices to run Toit code on.

### 2. Install Jaguar

[Jaguar](https://github.com/toitlang/jaguar) is a small Toit application that runs on your ESP32 which comes with a command line tool that allows you to update and restart your ESP32 code written in Toit over WiFi, which is ideal for fast development.

Install Jaguar, [following step 2](https://docs.toit.io/getstarted/device/#2-install-jaguar) in the Toit getting started guide.

::: info
We currently recommend `v1.55.0`+ of Jaguar, which bundles at least `v2.0.0-alpha.188` of Toit.
:::

Once installed, you should be able to run the version command:

```sh
jag version
Version:         v1.55.0
SDK version:     v2.0.0-alpha.188
Build date:      2025-08-20T08:35:24Z
```

### 3. Flash the ESP

Now it is time to connect your ESP enabled Lightbug device with a USB cable to your computer, and flash the ESP32 with the Jaguar firmware.

::: info
All ESP enabled Lightbug devices currently have ESP32C6 chips, so `--chip esp32c6` is required for flashing.
:::

Running `jag flash --chip esp32c6` will ask you for the serial port to use, and the WiFi credentials, but be aware that the tooling requires [permission to access your serial port](https://github.com/toitlang/jaguar#permission-to-access-serial-port).

It's possible to configure default WiFi credentials, see the [Toit guide](https://docs.toit.io/getstarted/device/#3-flash-your-device) for more info.

### 4. Monitor the device

After flashing, your device boots up and starts the Toit virtual machine. The Jaguar service on the device starts a small HTTP server that listens for incoming requests.

You can see what the ESP is doing by monitoring the serial output of the device with the `jag monitor` command.

<details>
<summary>Click to see example `jag monitor` output</summary>

```
Starting serial monitor of port 'COM22' ...
[wifi] DEBUG: connected
ESP-ROM:esp32c6-20220919
Build:Sep 19 2022
rst:0x15 (USB_UART_HPSYS),boot:0x6f (SPI_FAST_FLASH_BOOT)
Saved PC:0x4081306a
SPIWP:0xee
mode:DIO, clock dESP-ROM:esp32c6-20220919
Build:Sep 19 2022
rst:0x15 (USB_UART_HPSYS),boot:0x6f (SPI_FAST_FLASH_BOOT)
Saved PC:0x400294a2
SPIWP:0xee
mode:DIO, clock div:2
load:0x40875720,len:0x9c
load:0x4086c110,len:0xb94
load:0x4086e610,len:0x2534
entry 0x4086c110
[toit] INFO: starting <v2.0.0-alpha.188>
[toit] DEBUG: clearing RTC memory: powered on by hardware source
[toit] INFO: running on ESP32C6 - revision 0.1
[wifi] DEBUG: connecting
[wifi] DEBUG: connected
[wifi] INFO: network address dynamically assigned through dhcp {ip: 192.168.68.50}
[wifi] INFO: dns server address dynamically assigned through dhcp {ip: [8.8.8.8, 1.1.1.1]}
[jaguar.http] INFO: running Jaguar device 'long-expert' (id: '736b8804-dcdf-4d96-890a-8785c1bfa31d') on 'http://192.168.68.50:9000'
```
</details>

::: tip
Leave the terminal with `jag monitor` running open, as it will show you the output of the device, and will also show you the output of the code you run on the device.
:::

### 5. Start a project

Create a new directory for your project, and run the `jag pkg init` command to create a new Toit project.

```sh
mkdir my-lightbug-project
cd my-lightbug-project
jag pkg init
```

And install the latest version of the Toit Lightbug SDK, which contains the Toit code that runs on the Lightbug devices.

```sh
VERSION=$(jag pkg search lightbug-io/toit-lightbug | awk '{print $3}')
jag pkg install github.com/lightbug-io/toit-lightbug@$VERSION
```

You can copy the example [eink based Hello World application](https://github.com/lightbug-io/toit-lightbug/blob/main/examples/modules/eink/element-box-text.toit) into your project with the following command:

```sh
cp ./.packages/github.com/lightbug-io/toit-lightbug/$VERSION/examples/modules/eink/element-box-text.toit ./main.toit
```

### 6. Run the code

Use the `jag run` command to run the code on your device.

```sh
jag run ./main.toit
```

If your device can not be found automatically, you can specify the device IP address in the command line with the `--device` flag.

Once the code is running, you should see some output through the `monitor` command you ran earlier.

```
[jaguar] INFO: program 970dfee5-ec68-d8ad-ade5-06b62aaad39b started
💬 Sending text to device
```

And you should see the device screen update, saying `Lightbug...` in the top right.

### 7. Inspect the code

The code is very minimal.

Initially importing dependencies...

```
import lightbug.devices as devices
import lightbug.messages.messages_gen as
```

Then defining the `main` function, which is the entry point for the Toit application.

```
main:
```

Here we get a handle to the Lightbug device.

```
  device := devices.I2C
```

And send it a message, asking it to draw a clear box with some text in it, using a random page ID, in position `0,0` (top left), and disabling the status bar.

```
  print "💬 Sending text to device"
  device.comms.send (messages.DrawElement.msg
    --data=(messages.DrawElement.data
      --page-id=(random 10 255)
      --status-bar-enable=false
      --type=messages.DrawElement.TYPE_BOX
      --x=0
      --y=0
      --text="Lightbug..."))
```

We then enter an infinite loop, sleeping for 10 seconds at a time, to keep the application running.

```
  while true:
    sleep --ms=10000
```
