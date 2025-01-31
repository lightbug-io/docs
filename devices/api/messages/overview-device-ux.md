<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Device UX

A dedicated group of messages revolving around user interactions and experience with the device.

This currently primarily revolves around button pressed and screen updates.

Device UX messages revolving around screen updates make use of a common payload field:

- 3: Page ID: An ID for the page being interacted with or updated.

## Screen

The screen on devices that accept screen updates is currently a 122x250 pixel monochrome eink display.

## Page IDs

The Page ID should be provided when updating screens if the screen should be redrawn (ie, you are actually displaying a new page)
Submitting no Page ID, or the same page ID as a previous message may only trigger a partial redraw, and or maintain screen state from previous messages.

The Page ID will be included in events from the device, such as button press events, so that you can trigger actions with page context (possibly with additional context, such as menu selections).

**Page ID ranges**
 - 0, Reserved for initial device page draws
 - 1-10, Reserved for hard coded device pages
 - 100+, Recommended range for custom page IDs
