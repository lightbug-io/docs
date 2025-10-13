---
order: 0
aside: true
outline: deep
---

<script setup>
import ToitGithubCode from '../../../../../components/ToitGithubCode.vue';
</script>

# GET Message

Send a simple GET message to the Lightbug device.

## Retrieve IDs

This is an example of sending a [M35 Device IDs](/devices/api/messages/35-device-ids) message to the Lightbug device, which will return a variety of IDs including the device ID, IMEI, ICCID.

### Code

<ToitGithubCode path="examples/messages/m35_device_ids.toit">

```toit
<!-- @include: .vitepress/ext/toit-lightbug/examples/messages/m35_device_ids.toit-->
```

</ToitGithubCode>

### Output

```
[jaguar] INFO: program 760df138-6a5a-9df1-a469-b3f97da57a21 started
ID: 10570000
IMEI: 004950000212000
ICCID: 00457300000022210000
[jaguar] INFO: program 760df138-6a5a-9df1-a469-b3f97da57a21 stopped
```
