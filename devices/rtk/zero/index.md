---
aside: true
---

<script setup>
import spec from '../../../public/device-specs/rtkzero/v1.yaml?raw'
import loadSpec from '../../../utils/loadSpec'

const specs = loadSpec(spec)
const imagePlaceholders = [
  { label: 'Device views' },
  { label: 'Mechanical drawing' }
]
</script>

# RTKZero Hardware Datasheet

<div class="rtkzero-sheet-label">Preliminary hardware specification</div>

RTKZero is a compact wearable RTK tracker with dual-band, multi-constellation GNSS, LTE Cat 1bis, LoRa, Wi-Fi, Bluetooth, NFC and onboard motion sensing.

<div class="rtkzero-image-grid" aria-label="RTKZero product image placeholders">
  <figure><div class="rtkzero-placeholder-mark">RTKZero</div><figcaption>Device views</figcaption></figure>
  <figure><div class="rtkzero-placeholder-mark">RTKZero</div><figcaption>Mechanical drawing</figcaption></figure>
</div>

<div class="rtkzero-stats" aria-label="RTKZero key specifications">
  <div><strong>Up to 10 Hz</strong><span>GNSS positioning</span></div>
  <div><strong>15 hours</strong><span>At 1 Hz with full RTK</span></div>
  <div><strong>2,000 mAh</strong><span>LiPo battery</span></div>
  <div><strong>Approx. 90 g*</strong><span>Estimated mass</span></div>
</div>

## Mechanical and environmental

<DeviceSpecSection :spec="specs" sectionName="physical" />

## Positioning and antenna

<DeviceSpecSection :spec="specs" sectionName="positioning" />

## Wireless connectivity

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

## Sensors

<DeviceSpecSection :spec="specs" sectionName="sensors" />

## Battery and charging

<DeviceSpecSection :spec="specs" sectionName="battery" />

<DeviceSpecSection :spec="specs" sectionName="charging" />

## Processor and interfaces

<DeviceSpecSection :spec="specs" sectionName="integrations" />

<DeviceSpecSection :spec="specs" sectionName="components" />

## User interface

<DeviceSpecSection :spec="specs" sectionName="user interface" />

* Preliminary mechanical values; IP figures are design targets.

<DownloadSpecButton :spec="specs" :image-placeholders="imagePlaceholders" :pdf-section-order="['physical', 'positioning', 'connectivity', 'sensors', 'battery', 'charging', 'integrations', 'user interface', 'components']" device-title="RTKZero Hardware Datasheet" pdf-url="https://github.com/lightbug-io/docs/pull/10" label="Download hardware datasheet PDF" />

<style scoped>
.rtkzero-sheet-label {
  display: inline-block;
  margin: .2rem 0 1rem;
  padding: .35rem .7rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: .85rem;
  font-weight: 700;
  letter-spacing: .02em;
  text-transform: uppercase;
}

.rtkzero-image-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.rtkzero-image-grid figure {
  display: grid;
  min-height: 12rem;
  margin: 0;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: .75rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg-alt));
}

.rtkzero-placeholder-mark {
  color: var(--vp-c-text-3);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: .12em;
}

.rtkzero-image-grid figcaption {
  width: 100%;
  padding: .65rem .9rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: .85rem;
  text-align: center;
}

.rtkzero-stats {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  margin: 1.25rem 0 2rem;
}

.rtkzero-stats div {
  display: flex;
  min-height: 4.25rem;
  flex-direction: column;
  justify-content: center;
  gap: .25rem;
  padding: .8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: .75rem;
  background: var(--vp-c-bg-soft);
}

.rtkzero-stats strong { font-size: 1.1rem; }
.rtkzero-stats span { color: var(--vp-c-text-2); font-size: .85rem; }

@media (max-width: 640px) {
  .rtkzero-image-grid { grid-template-columns: 1fr; }
}
</style>
