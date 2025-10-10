<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Device Screen

A dedicated group of messages for displaying on device Eink screens (currently only monochrome eink of size 122x250 pixels)

All screen messages have a Page ID field (3) defined, which tracks which screen is currently being rendered.

A single screen can be created (buffered), updated and displayed over multiple messages, all of which should have the same page ID.

Page Ids may also be used in other messages, emitting certain events, such as button presses during menu navigation.

**Page ID ranges**
 - 0, Reserved for initial device page draws
 - 1-10, Reserved for hard coded device pages
 - 100+, Recommended range for custom page IDs
