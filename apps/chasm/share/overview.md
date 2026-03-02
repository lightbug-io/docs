# Viewing Data

Once a valid device ID and share code are entered, the application displays the shared messages in a user-friendly format, split into various sections.

Multiple shares can be loaded at once, and remembered, which will display as tabs across the top of the screen.

## Overview

The first section includes an overview of device and share information, as well as links to download the shared data in a variety of formats.

![](https://upload.r2.lb.chasm.cloud/2026/03/chrome_hqSioXjX9T.png)

The download options are:
 - All messages
    - JSON: One JSON object per message, with human readable field labels, parsing and formatting of values
    - CSV: One column per V3 message field label
    - HEX: Raw V3 message data in hexadecimal format
    - Base64: Raw V3 message data in Base64 format
 - Positions:
    - KML (track, points, or both)
    - NMEA
    - MAP PNG (when locations are included)

Formats may or may not be available depending on the type of shared data.
