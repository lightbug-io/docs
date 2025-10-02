---
order: 0
aside: true
outline: deep
---

# GET Message

Send a simple GET message to the Lightbug device.

## Retrieve IDs

This is an example of sending a [M35 Device IDs](/devices/api/messages/35-device-ids) message to the Lightbug device, which will return a variety of IDs including the device ID, IMEI, ICCID.

### Code

```toit
<!-- @include: .vitepress/ext/toit-lightbug/examples/messages/m35_device_ids.toit-->
```

### Output
