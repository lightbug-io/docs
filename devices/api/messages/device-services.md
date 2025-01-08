<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import FancyBytes from '../../../components/FancyBytes.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

# Device Services

Device service messages make use of a few common header fields:

- [3: Response Message ID](./../headers#_3-response-message-id): The message ID of the message being responded to.
- [4: Response Status](./../headers#_4-response-status): 1 (OK), 2 (NOT OK)
- [5: Method](./../headers#_5-method): 1 (Set), 2 (Get), 3 (Subscribe)

There are then multiple message types, each which represents its own service.

## 30: Transmit Now

Send arbitrary data.

**Data fields**

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | 0 = no gps fix required<br>1 = wait for GPS lock (or timeout) before send | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x03 0x00 0x01 0x02 |
| 3     | Retries    | Number of retries [0-10]<br>Exponential backoff (10 = 25h)                | uint8  | 1 |
<!-- Priority -->

## 31: GSM CFUN

TODO document...

## 32: GSM IMEI

The GSM IMEI message can be used to get the IMEI of the device.

It has a single field, the IMEI, which is a 15 byte ASCII string.

<!-- <GenerateConsts :prefix="'MD_GSM_IMEI_'" :enumName="'MyEnum'" :dataPath="'messages/32/data'"/> -->

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | IMEI | 15 bytes ASCII data | []byte  | 51 53 48 49 50 51 52 53 49 50 51 52 53 54 48 | 350123451234560 |

### Usage

If you wanted to GET the IMEI from a device, you would send a GET message with the IMEI field requested (length 0).

<ProtocolBytes
byteString="3 19 0 32 0 2 0 1 5 1 234 1 2 1 0 1 0 21 145"
:boldPositions="[3,12,15,16]"
/>

You can expect an [ACK](generic#_5-ack) in response, with the message ID of the message being ACKed (234).

The device would then respond with a message of type 32, with the IMEI field filled in if known.

<ProtocolBytes
byteString="3 42 0 32 0 3 0 1 3 4 1 22 1 234 1 1 1 0 1 20 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54 159 188"
:boldPositions="[20]"
/>

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.


## 33: GSM ICCID

Device ICCID.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | ICCID | up to 22 bytes ASCII data | []byte  | 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54  | 89457387300002643966 |

## 34: Device Info: Status

TODO document...

## 35: Device Info: ID

TODO document...

## 36: Device Info: Time

Interact with device time.

**Data fields**

| Field | Name     | Description       | Type | Example |
| ----- | -------- | ----------------- | ---- | ---- |
| 1     | Unix     | Unix Time         | uint32 | 1734014057 |
| 2     | Year     | Year              | uint8 | 24 |
| 3     | Month    | Month             | uint8 | 12 |
| 4     | Day      | Day               | uint8 | 31 |
| 5     | Weekday  | Day of the Week   | | |
| 6     | Hour     | Hour              | uint8 | 24 |
| 7     | Minute   | Minute            | uint8 | 59 |
| 8     | Second   | Second            | uint8 | 59 |

<!-- TODO, should year be a full year instead of just 24...?! -->

## 37: Device Info: Last Position

TODO document...
