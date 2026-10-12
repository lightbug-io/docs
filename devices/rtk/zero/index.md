---
aside: true
---

<script setup>
import spec from '../../../public/device-specs/rtkzero/v1.yaml?raw'
import loadSpec from '../../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# RTKZero — Draft Product Specification

> **PRELIMINARY — for design review.** This page records current design intent, RH2-derived assumptions and unresolved items. It is not a production specification, certification claim, or performance guarantee.

RTKZero is a proposed compact, lighter RTK tracker based on the RH2 architecture for body-mounted positioning applications. Compared with RH2, the current product direction omits the screen, haptics and strobe and uses an approximately 2,000 mAh battery rather than the 6,600 mAh RH2 comparison basis. Final form factor and body-mounted performance remain unvalidated.

## Status key

- **Selected design intent** means the current hardware direction in the RTKZero design notes; it remains subject to prototype validation.
- **Target** means a design or prototype acceptance goal, not a verified product claim.
- **Estimate** means a calculation from RH2 reference data, not an RTKZero measurement.
- **TBD** means the value or decision is not yet approved or validated.

## Preliminary specification

<DeviceSpecSection :spec="specs" sectionName="integrations" />

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

<DeviceSpecSection :spec="specs" sectionName="positioning" />

<DeviceSpecSection :spec="specs" sectionName="sensors" />

<DeviceSpecSection :spec="specs" sectionName="components" />

<DeviceSpecSection :spec="specs" sectionName="battery" />

<DeviceSpecSection :spec="specs" sectionName="charging" />

<DeviceSpecSection :spec="specs" sectionName="user interface" />

<DeviceSpecSection :spec="specs" sectionName="physical" />

## Current design summary

The selected design direction names an STM32G0B1 main processor, an ESP32-S31 wireless module, A7683E cellular, LC29HEA GNSS, Semtech LR2021 radio, PTX105R NFC reader, LIS2DH accelerometer, an RH2-style six-axis sensor, INA236 battery monitor and a BQ25890/BQ25895-family charger. The charger variant, exact six-axis part, battery cell and final antenna/RF layout remain open.

The Notion design notes describe low-power NFC card detection with a Renesas PTX105R, with an LP5-style flex antenna where practical. The detailed NFC operating range and wake behavior remain to be validated. Full Wi-Fi and Bluetooth are design requirements, while exact radio versions and capabilities are still TBD. A satellite-uplink TCXO was considered and declined; satellite uplink is not part of this draft baseline.

## Mounting, servicing and charging concepts

The enclosure design intent includes a top-entry number-plate mount, a low-profile belt-clip insert and a backup/security loop. The mounting system should fail safely before harming the tracker or wearer; attachment geometry, load limits and safe-release behavior have not been established. A multi-device charging tray is also a design concept, with drainage and allowance for dirt called out as design considerations. Tray capacity, geometry, contacts and electrical behavior remain TBD.

## RH2 software and cloud references — RTKZero support unconfirmed

The RH2 specification and existing Lightbug API documentation describe cloud streaming and API access, Lightbug Cloud hosting (including hosted or on-premise deployments), forwarding to other services, device APIs over UART, I2C or UDP, and native UDP/TCP transport. The RH2 specification lists forwarding via MQTT, HTTP(S) and WebSocket. Its developer references include the Lightbug Toit SDK, lower-level message APIs and ESP32 development using ESP-IDF; the RH2 YAML also lists Arduino and PlatformIO. RH2 lists USB-C virtual COM and I2C external interfaces.

These are **RH2 reference capabilities**, not RTKZero commitments. RTKZero's ESP32-S31 module and retained dock-I2C intent provide a basis for investigation, but firmware ports, SDK/toolchain support, cloud provisioning, data/API behavior, USB-C and externally accessible interfaces have not been confirmed or validated for RTKZero. No interoperability, firmware-update path or cloud service is promised by this draft.

## Optional concepts under evaluation

The following ideas are outside the current baseline and require design approval and validation: wireless charging; higher-spec GNSS receivers; alternate antenna configurations; a low-temperature battery option; a serviceable battery/backplate/contact assembly; and alternate breakaway-clip arrangements. The backup/security loop remains part of current baseline design intent. They do not replace or add to the selected design by implication.

## Battery estimate and limits

The draft battery capacity is approximately 2,000 mAh LiPo, subject to cell selection. This is about 30% of the 6,600 mAh RH2 comparison basis, or roughly 3.3 times lower capacity. RH2's current YAML lists more than 50 hours at 6,700 mAh. Using 50 hours only as an illustrative nominal baseline and scaling by 2,000/6,600 gives **about 15 hours illustrative scaling** under identical operating conditions. The RH2 lower-bound wording does not transfer to RTKZero. This is not measured runtime, a guarantee or a forecast; no RTKZero runtime has been measured.

## RH2-derived assumptions

This draft uses RH2 only as an architectural and comparison reference. It does not carry over RH2 dimensions, weight, materials, certifications, ingress rating, operating-temperature range, battery chemistry/cell, connector pinout, radio bands or powers, protocol versions, GNSS datum, accuracy figures, update-rate support, or optional functions. The five-contact dock with I2C is included because RTKZero design notes explicitly retain RH2 dock compatibility; its final pinout and electrical limits are not established here.

## Unresolved before a production specification

- Approve enclosure outline, antenna keep-outs, mounts, materials, assembled dimensions and weight.
- Select and characterize the battery cell, optional cold-weather version, SIM arrangement, charge settings and exact charger variant.
- Validate GNSS performance on-body, antenna placement, RF coexistence, sustained 5 Hz reporting and correction coverage behavior.
- Define GNSS datum/height reference, radio versions, regions, bands, output powers, antenna details and certifications.
- Validate cellular connectivity, Wi-Fi/Bluetooth interoperability, LoRa operation, NFC detection/wake behavior and sensor characteristics.
- Measure sleep current, runtime and operating-temperature limits across representative configurations.
- Validate the dock pinout and electrical behavior, enclosure sealing and the IP65 minimum design requirement; IP67 remains only a target.
- Define button, LED, piezo and firmware behavior, plus production approvals and labeling.

## Source and traceability

Primary design source: the current RTKZero hardware design notes (last edited 11 October 2026). The current component table names LC29HEA; a later clarification resolves the stale MS34SN2 remaining-decision checkbox in favor of the LC29H family. Later notes retain I2C dock compatibility and decline the satellite-uplink TCXO.

RH2 comparison source: the [published RH2 specification data](/device-specs/rtk/v2.yaml), which lists a 6,700 mAh battery and more than 50 hours continuous-use figure. The capacity comparison uses the explicit 6,600 mAh RH2 basis from the request; the small mismatch with the RH2 YAML's 6,700 mAh figure is retained as a comparison caveat. RH2 software references are in the [RTK API overview](/devices/api/) and [Toit SDK documentation](/devices/api/sdks/toit/).

<DownloadSpecButton :spec="specs" device-title="RTKZero — Draft Product Specification" label="Download draft specification PDF" />
