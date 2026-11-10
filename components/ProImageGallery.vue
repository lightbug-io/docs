<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps<{ images: string[] }>()
const labels = ['Front angle', 'Top side', 'Back', 'Side']
const images = computed(() => props.images.map((src, index) => ({
  src,
  label: labels[index] ?? `Image ${index + 1}`,
  url: `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(src)}`,
})))
const selectedIndex = ref(0)
const currentImage = computed(() => images.value[selectedIndex.value])
const interactive = ref(false)
const imageFailed = ref(false)
const thumbnails = ref<HTMLDivElement>()

onMounted(() => { interactive.value = true })

function selectImage(index: number) {
  if (selectedIndex.value === index) return
  selectedIndex.value = index
  imageFailed.value = false
}

async function navigateImages(event: KeyboardEvent, index: number) {
  let nextIndex: number
  switch (event.key) {
    case 'ArrowRight': nextIndex = (index + 1) % images.value.length; break
    case 'ArrowLeft': nextIndex = (index + images.value.length - 1) % images.value.length; break
    case 'Home': nextIndex = 0; break
    case 'End': nextIndex = images.value.length - 1; break
    default: return
  }
  event.preventDefault()
  selectImage(nextIndex)
  await nextTick()
  thumbnails.value?.querySelectorAll<HTMLButtonElement>('button')[nextIndex]?.focus()
}
</script>

<template>
  <figure id="images" class="pro-gallery" aria-label="Pro enclosure gallery">
    <div class="pro-gallery__stage">
      <img
        v-if="!imageFailed"
        :key="currentImage.src"
        :src="currentImage.url"
        :alt="`Shared Pro enclosure, ${currentImage.label.toLowerCase()} view`"
        class="pro-gallery__image"
        :class="{ 'pro-gallery__image--side': currentImage.label === 'Side' }"
        width="1920"
        height="1080"
        decoding="async"
        @error="imageFailed = true"
      />
      <p v-else class="pro-gallery__error" role="status">This image could not load. Try another view.</p>
    </div>
    <div ref="thumbnails" class="pro-gallery__thumbnails" role="group" aria-label="Choose enclosure view">
      <button
        v-for="(image, index) in images"
        :key="image.src"
        type="button"
        class="pro-gallery__thumbnail"
        :aria-label="`Show ${image.label.toLowerCase()} view`"
        :aria-pressed="selectedIndex === index"
        :disabled="!interactive"
        @click="selectImage(index)"
        @keydown="navigateImages($event, index)"
      >
        <span class="pro-gallery__thumbnail-image"><img :src="image.url" :class="{ 'pro-gallery__image--side': image.label === 'Side' }" alt="" width="1920" height="1080" decoding="async" /></span>
        <span>{{ image.label }}</span>
      </button>
    </div>
    <figcaption>Shared exterior views for Pro3 and ProN/PR2.</figcaption>
    <noscript>Selecting another view requires JavaScript.</noscript>
  </figure>
</template>

<style scoped>
.pro-gallery {
  width: 100%;
  max-width: 20rem;
  min-width: 0;
  margin: 0;
}
.pro-gallery__stage {
  display: grid;
  place-items: center;
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}
.pro-gallery__image,
.pro-gallery__thumbnail-image img {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  /* The source artwork has wide white margins. Reframe without altering it. */
  transform: scale(1.25);
}
.pro-gallery__image--side,
.pro-gallery__thumbnail-image img.pro-gallery__image--side {
  /* Side crop center: (370 + 700 / 2) vs canvas center 1080 / 2.
     Lift by (180 / 1080) * 1.25 at the shared zoom in both sizes. */
  transform: translateY(-20.833333%) scale(1.25);
}
.pro-gallery__thumbnails {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin-top: 10px;
}
.pro-gallery__thumbnail {
  min-width: 0;
  min-height: 44px;
  padding: 3px 3px 6px;
  border: 2px solid transparent;
  border-radius: 9px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: .72rem;
  line-height: 1.4;
  cursor: pointer;
}
.pro-gallery__thumbnail-image {
  display: block;
  position: relative;
  aspect-ratio: 4 / 3;
  margin-bottom: 5px;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}
.pro-gallery__thumbnail:hover { border-color: var(--vp-c-divider); }
.pro-gallery__thumbnail[aria-pressed="true"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.pro-gallery__thumbnail:focus-visible {
  outline: 2px solid var(--vp-c-text-1);
  outline-offset: 3px;
}
.pro-gallery__thumbnail:disabled { cursor: default; }
.pro-gallery figcaption,
.pro-gallery noscript {
  display: block;
  margin-top: 9px;
  color: var(--vp-c-text-2);
  font-size: .75rem;
  line-height: 1.5;
}
.pro-gallery__error {
  padding: 1rem;
  color: #3c3c43;
  font-size: .875rem;
  text-align: center;
}
</style>
