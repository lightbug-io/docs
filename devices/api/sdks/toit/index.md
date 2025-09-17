# Toit

[Toit](https://toitlang.org/) is a modern high-level open source object oriented language designed for microcontrollers and the Internet of Things.

[Jaguar](https://github.com/toitlang/jaguar) is a small Toit application that runs on your ESP32 which comes with a command line tool that allows you to update and restart your ESP32 code written in Toit over WiFi, which is ideal for fast development.

Lightbug provides a [Toit package](https://pkg.toit.io/package/github.com%2Flightbug-io%2Ftoit-lightbug) that includes a set of bindings to Lightbug devices and the [Lightbug device API](./../../).

Together, these tools allow you to quickly develop and deploy applications on Lightbug devices using Toit.

Once developed, Toit firmware can be build without the jaguar development tooling enabled, and sent to Lightbug devices over the air for update.

:::tip

Access to the device API is not limited to Toit, however it is the current preferred and documented high-level language for Lightbug devices.

Devices with an ESP32 can also be programmed using C/C++ with the ESP-IDF framework, or anything else that is supported on the ESP32. For such solutions, you'll need to make use of the lower level [messages](./../../messages/), rather than a higher level abstraction like the Toit package.

:::
