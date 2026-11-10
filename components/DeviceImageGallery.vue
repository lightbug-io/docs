<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { deviceImageUrl } from '../utils/DeviceImageUrl'

/** Strings use neutral defaults; objects can supply view labels and artwork framing. */
interface GalleryImage {
  src: string
  label?: string
  alt?: string
  fit?: 'contain' | 'cover'
  scale?: number
  offsetY?: number
}
const props = withDefaults(defineProps<{
  images: (string | GalleryImage)[]
  ariaLabel?: string
  caption?: string
  aspectRatio?: string
}>(), { ariaLabel: 'Product image gallery', aspectRatio: '4 / 3' })

const images = computed(() => props.images.map((input, index) => {
  const image = typeof input === 'string' ? { src: input } : input
  const label = image.label ?? `Image ${index + 1}`
  return {
    ...image,
    label,
    alt: image.alt ?? label,
    url: deviceImageUrl(image.src),
    style: {
      objectFit: image.fit ?? 'contain',
      transform: `translateY(${image.offsetY ?? 0}%) scale(${image.scale ?? 1})`,
    },
  }
}))
const selectedIndex = ref(0)
const currentImage = computed(() => images.value[selectedIndex.value])
const interactive = ref(false)
const imageFailed = ref(false)
const thumbnails = ref<HTMLDivElement>()

onMounted(() => { interactive.value = true })
watch(() => props.images, () => {
  selectedIndex.value = 0
  imageFailed.value = false
}, { deep: true })

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
  <figure v-if="currentImage" class="device-image-gallery" :aria-label="props.ariaLabel" :style="{ '--gallery-aspect-ratio': props.aspectRatio }">
    <div class="device-image-gallery__stage">
      <img
        v-if="!imageFailed"
        :key="currentImage.src"
        :src="currentImage.url"
        :alt="currentImage.alt"
        class="device-image-gallery__image"
        :style="currentImage.style"
        width="1920"
        height="1080"
        decoding="async"
        @error="imageFailed = true"
      />
      <p v-else class="device-image-gallery__error" role="status">This image could not load.<template v-if="images.length > 1"> Try another view.</template></p>
    </div>
    <div v-if="images.length > 1" ref="thumbnails" class="device-image-gallery__thumbnails" role="group" aria-label="Choose image" :style="{ gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, minmax(0, 1fr))` }">
      <button
        v-for="(image, index) in images"
        :key="`${index}:${image.src}`"
        type="button"
        class="device-image-gallery__thumbnail"
        :aria-label="`Show ${image.label}`"
        :aria-pressed="selectedIndex === index"
        :disabled="!interactive"
        @click="selectImage(index)"
        @keydown="navigateImages($event, index)"
      >
        <span class="device-image-gallery__thumbnail-image"><img :src="image.url" :style="image.style" alt="" width="1920" height="1080" decoding="async" /></span>
        <span>{{ image.label }}</span>
      </button>
    </div>
    <figcaption v-if="props.caption">{{ props.caption }}</figcaption>
    <noscript v-if="images.length > 1">Selecting another view requires JavaScript.</noscript>
  </figure>
</template>

<style scoped>
.device-image-gallery {
  /* Keep direct #images links clear of the navigation and mobile page toolbar. */
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 48px);
  width: 100%;
  max-width: 20rem;
  min-width: 0;
  margin: 0;
}
.device-image-gallery__stage {
  display: grid;
  place-items: center;
  position: relative;
  aspect-ratio: var(--gallery-aspect-ratio);
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
}
.device-image-gallery__image,
.device-image-gallery__thumbnail-image img {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-position: center;
}
.device-image-gallery__thumbnails {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}
.device-image-gallery__thumbnail {
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
.device-image-gallery__thumbnail-image {
  display: block;
  position: relative;
  aspect-ratio: var(--gallery-aspect-ratio);
  margin-bottom: 5px;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}
.device-image-gallery__thumbnail:hover { border-color: var(--vp-c-divider); }
.device-image-gallery__thumbnail[aria-pressed="true"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.device-image-gallery__thumbnail:focus-visible {
  outline: 2px solid var(--vp-c-text-1);
  outline-offset: 3px;
}
.device-image-gallery__thumbnail:disabled { cursor: default; }
.device-image-gallery figcaption,
.device-image-gallery noscript {
  display: block;
  margin-top: 9px;
  color: var(--vp-c-text-2);
  font-size: .75rem;
  line-height: 1.5;
}
.device-image-gallery__error {
  padding: 1rem;
  color: #3c3c43;
  font-size: .875rem;
  text-align: center;
}
</style>
