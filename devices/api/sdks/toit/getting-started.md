
# Getting started

### 1. Get an ESP32 enabled device

ESP32s are being introduced on some Lightbug devices.

You'll need one of these devices to run Toit on a Lightbug device.

### 2. Install Jaguar

[Jaguar](https://github.com/toitlang/jaguar) is a small Toit application that runs on your ESP32 which comes with a command line tool that allows you to update and restart your ESP32 code written in Toit over WiFi, which is ideal for fast development.

Install Jaguar, [following step 2](https://docs.toit.io/getstarted/device/#2-install-jaguar) in the Toit getting started guide.

::: info
We currently require `v1.50.3`+ of Jaguar, which bundles at least `v2.0.0-alpha.179` of Toit.
:::

Once installed, you should be able to run the version command:

```sh
jag version
Version:         v1.50.3
SDK version:     v2.0.0-alpha.179
Build date:      2025-04-31T10:10:10Z
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

::: tip
Leave the terminal with `jag monitor` running open, as it will show you the output of the device, and will also show you the output of the code you run on the device.
:::

### 5. Start a project

Create a new directory for your project, and run the following command to create a new Toit project:

```sh
mkdir my-lightbug-project
cd my-lightbug-project
jag pkg init
jag pkg install github.com/lightbug-io/toit-lightbug
```

You can copy the example [eink based Hello World application](https://github.com/lightbug-io/toit-lightbug/blob/main/examples/eink.toit) for the RTK Handheld 2 device into your project with the following command:

```sh
cp ./.packages/github.com/lightbug-io/toit-lightbug/0.7.0/examples/eink.toit ./main.toit
```

### 6. Run the code

Use the `jag run` command to run the code on your device.

```sh
jag run ./main.toit
```

If your device can not be found automatically, you can specify the device IP address in the command line with the `--device` flag.

Once the code is running, you should see some output through the `monitor` command you ran earlier.

```
[jaguar] INFO: program cf533602-d549-c9bd-34a3-3ae1093bda51 started
[lb-comms] INFO: Comms starting
[lb-comms] INFO: Comms started
💬 Sending text page to device
💬 Text page sent
Waiting on message latch
✅ Text page ACKed
Latch response: Message type: 5 length: 40 response-to: 3405447839
```

And you should see the device screen update
