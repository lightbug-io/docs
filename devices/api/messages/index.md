# Messages

There are a few different groupings of messages that can be used within the devices API.

| Group | Description |
| ----- | ----------- |
| Generic | Messages that can be used in a variety of situations. |
| Device Services | Messages that are specific to device services. |

## Generic

Message types that can be used in a variety of situations.

| Type | Name | Description |
| ---- | ---- | ----------- |
| [5: ACK](./5-ack) | ACK | Used to acknowledge a previously sent message. |
| [6: KeepAlive](./6-keepalive) | KeepAlive | Used to keep a connection alive.|

## Device Services

Messages relating to specific on device services.

| Type | Name | Description |
| ---- | ---- | ----------- |
| [30: Transmit Now](./device-services#_30-device-transmit-now) | Transmit Now | Send arbitrary data. |
| [31: GSM CFUN](./device-services#_31-device-gsm-cfun) | GSM CFUN | TODO document... |
| [32: GSM IMEI](./device-services#_32-devie-gsm-imei) | GSM IMEI | The GSM IMEI message can be used to get the IMEI of the device. |
| [33: GSM ICCID](./device-services#_33-device-gsm-iccid) | GSM ICCID | Device ICCID. |
| [34: Status](./device-services#_34-device-status) | Device Info: Status | TODO document... |
| [35: ID](./device-services#_35-device-id) | Device Info: ID | TODO document... |
| [36: Time](./device-services#_36-device-time) | Interact with device time. |
| [37: Last Position](./device-services#_37-device-last-position) | TODO document... |
