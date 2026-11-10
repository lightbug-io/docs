---
aside: false
---
# Troubleshooting

[[toc]]

## Why are location updates not instant?

In many cases, location can not be retrieved instantly, it takes time to get a [GPS fix](/terminology/positioning/gnss) and if that fails, the [other location technologies](/terminology/positioning/) come into action.

After a device has determined its location, it has to connect to the internet via the mobile networks in order to send the location information.

Once the information has been received by our servers, during normal operation it should be visible to you within a few seconds.

## Why are two lights red and four orange?

On a Pro PR2 (device ID prefix 20), this can be part of a normal restart. Other Pro versions have different LED hardware. It is not by itself a fault code or a full-battery reading. Give the tracker time to start, then check its latest update in the app or portal before resetting it again.

See the [illustrated LED guide](/guides/tracker-leds#two-red-lights-and-four-orange-lights-after-a-restart) for the pattern, normal battery/status meanings and when to contact support.

## Why is my tracker not transmitting?

Always give your tracker a couple of minutes to send a location update.

If it still hasn't sent a location update, make sure:

- Your device has an active data plan
- Your device is charged
- The tracker is in an area with good mobile coverage

If you have checked the above and your tracker is still not transmitting, try the following:

- Request a location update using the button action documented for your device and application
- If needed, follow the [restart guidance](#restarting-a-tracker) for your model and firmware
- Place the tracker outside for 5 minutes after completing all the above

If the tracker is still not transmitting, please contact us.

## Restarting a tracker

Do not repeatedly reset a tracker just because a light is red. First check the [LED guide for your model](/guides/leds) and the latest successful communication.

On standard current firmware for ProN/PR2, Zero/ZE2, Enviro/EN2, Pro3, VT3 and RH2, a long press reaches the restart action after about 10 seconds. **Release when the restart begins.** Button behaviour, the button to use and any sound can vary by model, application and firmware version. There is no universal beep or LED sequence.

Depending on firmware and reset history, a long-press restart can clear settings or enter recovery mode. Do not assume this action always preserves settings. If the installed firmware or button behaviour is uncertain, check with [support](https://lightbug.io/contact/) before proceeding. Use the procedure supplied for other models.

## Why is my tracker giving inaccurate locations?

Location accuracy depends on several variables.

There are a few good practices that help improve the location accuracy of your tracker.

- Try to place your tracker with the logo facing up (this is where the GPS antenna is located)
- Avoid surrounding your tracker with metals as they block GPS and GSM signals
- To allow for more GPS locations to be gathered, try to place your tracker somewhere with a good line of sight with the sky
- Increase the GPS timeout
- Make sure you have the correct settings. If you are unsure, please get in touch and we will assist!

## Why is my battery not lasting as long as advertised?

The advertised values are general guidelines.

In reality, there are many variables that affect battery life, such as:

- Where the tracker is mounted: with a clear line of sight with the sky, the tracker will use less power per location update
- Is the tracker indoors? If the tracker is indoor, more power will be used as the tracker will try to look for a GPS fix before attempting to locate itself via WPS or GSM. Find out more about this under the How the location technologies work section
- Make sure you have Wi-Fi and GPS Safe Zones set up where applicable
- Motion sensitivity: maybe your tracker is sending more location updates than it should because the motion sensitivity is too high. This usually occurs when the tracker is stationary but still sending location updates. Reduce the motion sensitivity via your flexible configurations page.

You can always [contact our support team](https://lightbug.io/contact/) for help with this.
