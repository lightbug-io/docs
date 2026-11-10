# Device page components

The specification tables, PDF download, capability links and image components take device data as props. Keep product-specific wording and artwork choices in the page, and image URLs in the device YAML.

## Overview and gallery

`DeviceOverview` places its default content above its `media` slot on narrow articles, and beside it when the article has room. It does not load data or add headings.

```vue
<DeviceOverview>
  <!-- Product copy, DownloadSpecButton and DeviceCapabilities go here. -->
  <template #media>
    <DeviceImageGallery
      :images="specs.product.images"
      aria-label="Device exterior views"
      caption="Optional product-specific caption."
    />
  </template>
</DeviceOverview>
```

`DeviceImageGallery` also works on its own. It accepts any number of image URLs, uses contain-fit framing by default, hides itself for an empty list, and omits navigation for one image. For descriptive labels, alt text or artwork-specific framing, map the YAML URLs to objects in the page:

```js
const galleryImages = specs.product.images.map((src, index) => ({
  src,
  label: viewLabels[index],
  alt: viewDescriptions[index],
  // Optional: fit ('contain' or 'cover'), scale (default 1), offsetY (percent, default 0).
}))
```

Pass that array as `:images="galleryImages"`. Missing labels fall back to “Image 1”, “Image 2”, etc.; missing alt text uses the label. Explicit empty alt text is preserved. The optional `aspect-ratio` prop controls the stage and thumbnail shape (default `4 / 3`). Add an `id` at the callsite only when the page needs a gallery anchor.

Local image URLs respect the VitePress base path. The gallery, `DeviceSpecImages` and specification PDF data share `deviceImageUrl`, which proxies the existing supported Lightbug image hosts and leaves unrelated external URLs unchanged.

## Existing shared components

- `DeviceSpecOverview` and `DeviceSpecSection`: overview and named section tables from a parsed `spec`.
- `DeviceSpecImages`: a static row of images from the same `spec`.
- `DownloadSpecButton`: the shared specification PDF; optional `preview-image` enables a thumbnail card.
- `DeviceCapabilities`: feature-guide links selected by device code.

These can be composed independently. Adding a gallery does not require changing a device's specification schema or PDF generator.
