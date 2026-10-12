---
aside: true
---

<script setup>
import spec from '../../../public/device-specs/rtkzero/v1.yaml?raw'
import loadSpec from '../../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Lightbug RTKZero

### Compact dual-band RTK tracker

<div class="rtkzero-hero">
  <div>
    <p class="rtkzero-lead">Accurate positioning in a compact, lightweight tracker designed for body-worn use.</p>
    <p class="rtkzero-connectivity">Dual-band GNSS · LTE Cat 1bis · LoRa · Wi-Fi · Bluetooth</p>
    <span class="rtkzero-preview-label">Customer preview · * marks provisional figures</span>
  </div>
  <div class="rtkzero-stats" aria-label="Preliminary product figures">
    <div><strong>53 × 91 × 15 mm*</strong><span>Core dimensions</span></div>
    <div><strong>~90 g*</strong><span>Estimated weight</span></div>
    <div><strong>2,000 mAh*</strong><span>Rechargeable battery</span></div>
    <div><strong>~15 hours*</strong><span>Estimated battery life</span></div>
  </div>
</div>

## Product specifications

<DeviceSpecSection :spec="specs" sectionName="physical" />

<DeviceSpecSection :spec="specs" sectionName="positioning" />

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

<DeviceSpecSection :spec="specs" sectionName="integrations" />

<DeviceSpecSection :spec="specs" sectionName="sensors" />

<DeviceSpecSection :spec="specs" sectionName="battery" />

<DeviceSpecSection :spec="specs" sectionName="charging" />

<DeviceSpecSection :spec="specs" sectionName="user interface" />

<DeviceSpecSection :spec="specs" sectionName="components" />

* Preliminary product figure.

<DownloadSpecButton :spec="specs" device-title="RTKZero — Customer Preview" pdf-url="https://github.com/lightbug-io/docs/pull/10" label="Download product preview PDF" />

<style scoped>
.rtkzero-hero {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr);
  margin: 1.5rem 0 2rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--vp-c-divider);
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
}

.rtkzero-lead {
  max-width: 46rem;
  margin: 0 0 .6rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.45;
}

.rtkzero-connectivity {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
}

.rtkzero-preview-label {
  display: inline-block;
  padding: .35rem .7rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: .85rem;
  font-weight: 600;
}

.rtkzero-stats {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
}

.rtkzero-stats div {
  display: flex;
  min-height: 4rem;
  flex-direction: column;
  justify-content: center;
  gap: .25rem;
  padding: .8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: .75rem;
  background: var(--vp-c-bg);
}

.rtkzero-stats strong {
  font-size: 1.05rem;
}

.rtkzero-stats span {
  color: var(--vp-c-text-2);
  font-size: .85rem;
}
</style>
