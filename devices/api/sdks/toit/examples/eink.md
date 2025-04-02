# Eink Hello World

The latest version of the eink example can be [found on GitHub](https://github.com/lightbug-io/toit-lightbug/blob/main/examples/eink.toit).


## Output

When the program is running, you should see some output through the `monitor` command that looks something like this:

```
[lb-comms] INFO: Comms starting
[lb-comms] INFO: Comms started
💬 Sending text page to device
💬 Text page sent
Waiting on message latch
✅ Text page ACKed
Latch response: Message type: 5 length: 40 response-to: 3405447839
```

## Device

The device EInk screen will update, displaying the text that was included in the message.

## Code

First, the required dependencies are [imported](https://docs.toit.io/language/imports).

This primarily includes things from the `lightbug` package, but also the [log library](https://libs.toit.io/log/library-summary) that is part of the toit SDK.

```toit
import lightbug.devices as devices
import lightbug.services as services
import lightbug.messages as messages
import log
```

A `main` function is defined, which is the entry point of the toit program.

Here we start setting up the application, such as the log level to use, the device to use, and the communication service.

```toit
main:
  // Setup the Toit logger with the INFO log level
  log.set-default (log.default.with-level log.INFO-LEVEL)

  // This example is setup to work with the RH2 device
  device := devices.RtkHandheld2

  // Setup the comms service, which allows communication with the Lightbug device
  comms := services.Comms --device=device
```

We then send a single message to the device, which is a [text page](./../../../messages/10009-text-page.md).

The `send` function is used to send the message, and it can take a number of optional parameters that allow hooking into the message lifecycle.

```toit
  // Send a basic text page to the device to display
  // https://docs.lightbug.io/devices/api/tools/parse?bytes=03%2C57%2C00%2C19%2C27%2C02%2C00%2C05%2C01%2C01%2C01%2C04%2C7f%2C0e%2C60%2C9b%2C05%2C00%2C03%2C04%2C06%2C65%2C66%2C02%2Cd1%2C07%2C0b%2C48%2C65%2C6c%2C6c%2C6f%2C20%2C77%2C6f%2C72%2C6c%2C64%2C01%2C02%2C1f%2C57%2C65%2C6c%2C63%2C6f%2C6d%2C65%2C20%2C74%2C6f%2C20%2C79%2C6f%2C75%2C72%2C20%2C4c%2C69%2C67%2C68%2C74%2C62%2C75%2C67%2C20%2C64%2C65%2C76%2C69%2C63%2C65%2C0c%2C72%2C75%2C6e%2C6e%2C69%2C6e%2C67%2C20%2C54%2C6f%2C69%2C74%2Cb8%2C71
  latch := comms.send (messages.TextPage.to-msg
    --page-id=2001
    --page-title="Hello world"
    --line2="Welcome to your Lightbug device"
    --line3="running Toit"
    --redraw-type=2 // FullRedraw
  )
    --now=true
    --withLatch=true
    --preSend=(:: print "💬 Sending text page to device")
    --postSend=(:: print "💬 Text page sent")
    --onAck=(:: print "✅ Text page ACKed")
    --onNack=(:: print "❌ Text page NACKed")
    --onError=(:: print "❌ Text page error")
```

The code then waits for the message to be responded to, printing the response to the console.

See [Latch](https://docs.toit.io/language/tasks/#latch) from the Toit [monitor library](https://libs.toit.io/monitor/library-summary).

```toit
  print "Waiting on message latch"
  response := latch.get
  // The value of the latch will be false on timeout or unknown error, or the msg object for the response
  // Such as https://docs.lightbug.io/devices/api/tools/parse?bytes=03%2C28%2C00%2C05%2C00%2C04%2C00%2C03%2C04%2C01%2C02%2C04%2C7f%2C0e%2C60%2C9b%2C01%2C00%2C04%2Cd9%2C16%2C00%2C00%2C08%2Cb3%2Cd5%2C9b%2C00%2C00%2C00%2C00%2C00%2C01%2C00%2C01%2C02%2C19%2C27%2Ca9%2C0c
  print "Latch response: $response"
```
