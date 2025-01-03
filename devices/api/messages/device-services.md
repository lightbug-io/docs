<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import FancyBytes from '../../../components/FancyBytes.vue'
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

<FancyBytes
    byteString="3 19 0 32 0 2 0 1 5 1 234 1 2 1 0 1 0 21 145"
    :byteDefinition="[
        { pos: 0, len: 1, name: 'Message Meta', desc: 'Protocol', type: 'uint8', value: 3 },
        { pos: 1, len: 2, name: 'Message Meta', desc: 'Length', type: 'uint16', value: 19 },
        { pos: 3, len: 2, name: 'Message Meta', desc: 'Type', type: 'uint16', value: 32, bold:1 },
        { pos: 5, len: 2, name: 'Header Meta', desc: 'Header Field Count', type: 'uint16', value: 2 },
        { pos: 7, len: 2, name: 'Header Meta', desc: 'Header Fields', type: '[]uint8', value: '1, 5' },
        { pos: 9, len: 1, name: 'Header 1', desc: 'Message ID (1) length', type: 'uint8', value: 1},
        { pos: 10, len: 1, name: 'Header 1', desc: 'Message ID (1) value', type: 'uint8', value: 234},
        { pos: 11, len: 1, name: 'Header 2', desc: 'Method (5) length', type: 'uint8', value: 1},
        { pos: 12, len: 1, name: 'Header 2', desc: 'Method (5) value', type: 'uint8', value: 'GET', bold:1},
        { pos: 13, len: 2, name: 'Payload Meta', desc: 'Payload Field Count', type: 'uint16', value: 1},
        { pos: 15, len: 1, name: 'Payload Meta', desc: 'Payload Fields', type: '[]uint8', value: '1', bold:1 },
        { pos: 16, len: 1, name: 'Payload 1', desc: 'IMEI (1) length', type: 'uint8', value: 0, bold:1 },
        { pos: 17, len: 2, name: 'Message Meta', desc: 'Checksum', type: 'uint16', value: '21 145' },
    ]"
/>

You can expect an [ACK](generic#_5-ack) in response, with the message ID of the message being ACKed (234).

The device would then respond with a message of type 32, with the IMEI field filled in if known.

<FancyBytes
    byteString="3 42 0 32 0 3 0 1 3 4 1 22 1 234 1 1 1 0 1 20 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54 159 188"
    :byteDefinition="[
        { pos: 0, len: 1, name: 'Message Meta', desc: 'Protocol', type: 'uint8', value: 3 },
        { pos: 1, len: 2, name: 'Message Meta', desc: 'Length', type: 'uint16', value: 42 },
        { pos: 3, len: 2, name: 'Message Meta', desc: 'Type', type: 'uint16', value: 32 },
        { pos: 5, len: 2, name: 'Header Meta', desc: 'Field Count', type: 'uint16', value: 3 },
        { pos: 7, len: 3, name: 'Header Meta', desc: 'Header Fields', type: '[]uint8', value: '1, 3, 4' },
        { pos: 10, len: 1, name: 'Header 1', desc: 'Message ID (1) length', type: 'uint8', value: 1},
        { pos: 11, len: 1, name: 'Header 1', desc: 'Message ID (1) value', type: 'uint8', value: 22},
        { pos: 12, len: 1, name: 'Header 2', desc: 'Response to Message ID (3) length', type: 'uint8', value: 1},
        { pos: 13, len: 1, name: 'Header 2', desc: 'Response to Message ID (3) value', type: 'uint8', value: 234},
        { pos: 14, len: 1, name: 'Header 3', desc: 'Message Status (4) length', type: 'uint8', value: 1},
        { pos: 15, len: 1, name: 'Header 3', desc: 'Message Status (4) value', type: 'uint8', value: 1},
        { pos: 16, len: 2, name: 'Payload Meta', desc: 'Payload Field Count', type: 'uint16', value: 1 },
        { pos: 18, len: 1, name: 'Payload Meta', desc: 'Payload Fields', type: '[]uint8', value: '1' },
        { pos: 19, len: 1, name: 'Payload 1', desc: 'IMEI (1) length', type: 'uint8', value: 20 },
        { pos: 20, len: 20, name: 'Payload 1', desc: 'IMEI (1) value', type: 'bytes', value: '89457387300002643966', bold:true },
        { pos: 40, len: 2, name: 'Message Meta', desc: 'Checksum', type: 'uint16', value: '159 188' },
    ]"
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
