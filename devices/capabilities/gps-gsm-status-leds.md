---
aside: true
---

# GPS and GSM status LEDs

Some older trackers have two diagnostic indicators: one for GPS and one for the mobile network, often labelled GSM. These are separate from the [four power LEDs](/devices/capabilities/four-power-leds).

The pair describes receiver and connection state, not a general fault code. It is not present on Pro3 or ZE3, and is not the [RGB status LED capability](/devices/capabilities/rgb-status-leds) used by RH2.

## Diagnostic display

Use the model/revision notes below to identify the **secondary diagnostic colour**. It is not universally green. Both channels can be on together; this does not establish a third, universal mixed colour.

| Mobile-network indicator | What the standard display can mean |
| --- | --- |
| Red only | Flight mode is enabled, or signal strength is zero/unknown while the connection is not open |
| Red and secondary colour together | One signal bar is reported and the connection is not open, with flight mode off |
| Secondary colour only | At least two signal bars are reported or the connection is open, with flight mode off |

The mobile indicator is not confirmation that data reached the server. Check the latest successful communication in the app or portal.

| GPS indicator while the receiver is awake | What the standard display can mean |
| --- | --- |
| Red only | No fix yet, before the waiting-for-fix stage |
| Red and secondary colour together | Waiting for a fix, without a lock yet |
| Secondary colour only | A fix is available, or the receiver has moved beyond the waiting-for-fix stage |

When GPS is asleep, its indicator can reflect whether the **previous** fix attempt failed rather than whether there is a live fix now. A secondary-colour light alone is therefore not a guarantee of a current accurate location. Check the location timestamp and accuracy in the app or portal.

## Devices and colour variants

### Pro PR2 {#pro-pr2}

[ProN/PR2](/devices/history/PR2), device ID prefix 20, has four battery indicators and the separate GPS/GSM pair. PR2 designs use red with amber or yellow depending on the board revision. Its [two-red/four-orange startup example](/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart) belongs to this model, not Pro3.

### Zero ZE2 {#zero-ze2}

[ZeroN/ZE2](/devices/zero/), prefix 19, uses the same diagnostic logic. Revision 05 uses yellow and red diagnostic LEDs. A firmware channel named G does not establish that the physical light is green. Use the icons on the case to identify the indicators. ZE3 does not have this pair.

### Enviro EN2 {#enviro-en2}

[EnviroN/EN2](/devices/enviro/), prefix 26, uses the shared diagnostic logic. Its exact diagnostic colours must be checked against the supplied board revision. Do not infer a colour chart from another six-indicator model; ask support if the colours differ from the supplied instructions.

## Limits

Both colour channels can be lit together. Their appearance depends on the components and case, so there is no universal third mixed colour. Startup, alarms and application control can override the ordinary diagnostic display. Use the [LED guide](/guides/leds) to put a pattern in context.
