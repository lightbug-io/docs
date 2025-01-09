<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

# Device Services

Device service messages make use of a few common header fields:

- [3: Response Message ID](./../headers#_3-response-message-id): The message ID of the message being responded to.
- [4: Response Status](./../headers#_4-response-status): 1 (OK), 2 (NOT OK)
- [5: Method](./../headers#_5-method): 1 (Set), 2 (Get), 3 (Subscribe)

There are then multiple message types, each which represents its own service.

## 30: Transmit Now

[Transmit Now](./30-device-transmit-now.md)

## 31: GSM CFUN

[GSM CFUN](./31-device-gsm-cfun.md)

## 32: GSM IMEI

[GSM IMEI](./32-device-gsm-imei.md)

## 33: GSM ICCID

[GSM ICCID](./33-device-gsm-iccid.md)

## 34: Device Info: Status

[Device Info: Status](./34-device-status.md)

## 35: Device Info: ID

[Device Info: ID](./35-device-id.md)

## 36: Device Info: Time

[Device Info: Time](./36-device-time.md)

## 37: Device Info: Last Position

[Device Info: Last Position](./37-device-last-position.md)
