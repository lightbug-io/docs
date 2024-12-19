---
outline: [1,3]
---

<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# Device Services

Device service messages make use of a few common header fields:

- [20: Method](./headers#_20-method): 1 (Set), 2 (Get), 3 (Subscribe)
- [22: Response Message ID](./headers#_22-response-message-id): The message ID of the message being responded to.
- [23: Response Status](./headers#_23-response-status): 1 (OK), 2 (NOT OK)

There are then multiple message types, each which represents its own service.

## 30: Transmit Now

Send arbitrary data.


**Data fields**

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | Search for GPS (0 = no, 1 = yes) | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x03 0x00 0x01 0x02 |
| 3     | Retries    | Number of retires                | uint8  | 1 |
<!-- Priority -->

## 31: GSM CFUN

TODO document...

## 32: GSM IMEI

<!-- <GenerateConsts :prefix="'MH_'" :enumName="'MyEnum'" :dataPath="'messages/32/data'"/> -->

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | IMEI | 15 bytes ASCII data | []byte  | 51 53 48 49 50 51 52 53 49 50 51 52 53 54 48 | 350123451234560 |

**GET**

If you wanted to GET the IMEI from a device, you would send a message with:
 - Message Type: 32
 - Header Field Type 1: A valid message ID
 - Header Field Type 5: 2 (GET)
 - Payload Field Type 1: 0 (no data)

Sending the payload field indicates that you want that field to exist in the response.

```
3 19 0 32 0 2 0 1 5 1 234 1 2 1 0 1 0 21 145
^ ^    ^    ^   ^ ^ ^ ^   ^ ^ ^   ^ ^ ^
| |    |    |   | | | |   | | |   | | |---> CRC 16 Checksum
| |    |    |   | | | |   | | |   | |-----> Payload field type 1 length (0 / no data)
| |    |    |   | | | |   | | |   |-------> Payload field type 1 (IMEI)
| |    |    |   | | | |   | | |-----------> Payload field count 1
| |    |    |   | | | |   | |-------------> Header field type 5 value 2 (GET)
| |    |    |   | | | |   |---------------> Header field type 5 length 1 (uint8)
| |    |    |   | | | |-------------------> Header field type 1 value 234 (Message ID 234)
| |    |    |   | | |---------------------> Header field type 1 length 1 (uint8)
| |    |    |   | |---------------> Header field type 5 (Method)
| |    |    |   |-----------------> Header field type 1 (Message ID)
| |    |    |---------------------> Header field count 2
| |    |--------------------------> Message Type 32 (GSM IMEI)
| |-------------------------------> Message Length 19
|---------------------------------> Protocol Version 3
```

You can expect an ACK to your request, and then a response message with the IMEI.

The ACK for this message would contain the same message ID (payload field 1) and the message ID of the message being ACKed (payload field 2).

`3 17 0 5 0 0 0 2 0 1 2 1 32 1 234 176 65`

The response headers would:
 - Include its own message ID for the receiver to ACK: 1 -> 22
 - Include the message ID it is responding to: 3 -> 234
 - Include the status of the message: 4 -> 1 (OK)

And the response payload would include the IMEI.

`3 42 0 32 0 3 0 1 3 4 1 22 1 234 1 1 1 0 1 20 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54 159 188`

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.


## 33: GSM ICCID

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
| 4     | Day     | Day              | uint8 | 31 |
| 6     | Hour     | Hour              | uint8 | 24 |
| 7     | Minute   | Minute            | uint8 | 59 |
| 8     | Second   | Second            | uint8 | 59 |
<!-- | 5     | Weekday  | Day of the Week   | | | -->

<!-- TODO, should year be a full year instead of just 24...?! -->

## 37: Device Info: Last Position

TODO document...
