<template>
  <div class="device-overview">
    <div class="device-overview__layout" :class="{ 'device-overview__layout--with-media': $slots.media }">
      <div class="device-overview__copy"><slot /></div>
      <div v-if="$slots.media" class="device-overview__media"><slot name="media" /></div>
    </div>
  </div>
</template>

<style scoped>
.device-overview { container-type: inline-size; }
.device-overview__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  margin-top: 1.5rem;
}
.device-overview__copy { min-width: 0; }
.device-overview__copy > :deep(:first-child) { margin-top: 0; }
.device-overview__copy > :deep(:last-child) { margin-bottom: 0; }
.device-overview__media { width: 100%; min-width: 0; max-width: 20rem; justify-self: center; }
/* Use the article's width, not the viewport: navigation may occupy both sides. */
@container (min-width: 42rem) {
  .device-overview__layout--with-media { grid-template-columns: minmax(0, 1fr) 18rem; gap: 2rem; }
  .device-overview__media { justify-self: end; }
}
</style>
