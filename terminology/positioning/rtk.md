---
aside: true
---

# RTK (Real-Time Kinematic)

RTK (Real-Time Kinematic) is a technique used to enhance the precision of position data derived from [GNSS systems](./gnss).

By using a fixed base station with a known location, RTK can provide centimeter-level accuracy.

![](https://i.imgur.com/OzhNfJ2.png){width="400"}


**Reading** [Wikipedia: Real-time kinematic positioning](https://en.wikipedia.org/wiki/Real-time_kinematic_positioning)

## Devices (Rovers)

The [RH2](/devices/rtk/handheld) and [VTRTK](/devices/rtk/vehicle) support RTK positioning, and support both rover and base station modes.

In the past, we also offered the RH1, the first Lightbug device to support RTK, which is now discontinued.

## Base stations

A base station is a stationary GNSS receiver placed at a precisely surveyed location.

It continuously collects GNSS observations and computes correction data that represents the difference between its known position and the position computed from GNSS measurements.

With the Lightbug platform, you are able to bring your own base station, make use of an existing network of stream of data, or use a Lightbug device in base station mode to provide corrections to other Lightbug devices in rover mode.

## How it works (high level)

- A fixed base station sits at a precisely surveyed, known location and collects GNSS observations.
- A rover receiver (the device in the field) receives the same satellite signals and also collects observations.
- The base computes correction data (pseudorange and carrier-phase) representing the difference between its known position and the position computed from GNSS measurements.
- Corrections are transmitted to the rover in real time (commonly using RTCM formats over radio, cellular/NTRIP, or other links).
- The rover applies the corrections and attempts to resolve carrier-phase integer ambiguities, producing a corrected, high-precision fix.

## Other terminology

- Base station: a stationary receiver with a surveyed location that provides correction data.
- Rover: the mobile receiver that applies corrections to improve its position.
- RTCM: a common protocol family (RTCM 2.x/3.x) used to encode and stream correction messages.
- NTRIP: Networked Transport of RTCM via Internet Protocol, commonly used to stream corrections over cellular data.

## Practical accuracy and limits

- Centimetre-level horizontal accuracy is achievable under good conditions with successful ambiguity resolution.
- Vertical accuracy is usually a bit worse than horizontal and more sensitive to geometry and multipath.

## Common error sources and failure modes

- Multipath: reflected signals (from buildings, water, ground) distort measurements and can prevent ambiguity resolution.
- Signal blockage: buildings, foliage, vehicle bodies or low horizons reduce satellite visibility and degrade fixes.
- Ionospheric and tropospheric delays: residual atmospheric errors increase with baseline; network RTK mitigates this.
- Latency and packet loss: delayed or missing corrections cause the rover to revert to a less accurate solution or lose fix.
- Incorrect base coordinates: if the base station location is wrong, corrections will be biased and produce incorrect rover positions.
