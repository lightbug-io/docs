<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
</script>

# 30: Transmit Now

Send arbitrary data.

**Data fields**

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | 0 = no gps fix required<br>1 = wait for GPS lock (or timeout) before send | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x03 0x00 0x01 0x02 |
| 3     | Retries    | Number of retries [0-10]<br>Exponential backoff (10 = 25h)                | uint8  | 1 |
<!-- Priority -->
