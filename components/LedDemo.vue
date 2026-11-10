<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
    clockElapsed, ledFrame, nextFrameTime, pauseClock, playbackDuration,
    playbackPattern, startClock,
    type LedDemoInput, type LedDemoMode, type PlaybackClock,
} from '../utils/LedDemo'

const props = defineProps<{ mode: LedDemoMode }>()
const percentage = ref(props.mode === 'rh2' ? 80 : 55)
const ignition = ref(true)
const vehicleCharging = ref(true)
const ready = ref(false)
const reducedMotion = ref(false)
const elapsed = ref(0)
const clock = ref<PlaybackClock>({ elapsedMs: 0, startedAtMs: null })
let timer: ReturnType<typeof setTimeout> | undefined
let motionQuery: MediaQueryList | undefined

const compact = computed(() => props.mode === 'battery' || props.mode === 'charging')
const input = computed<LedDemoInput>(() => ({ mode: props.mode, percentage: percentage.value, ignition: ignition.value, vehicleCharging: vehicleCharging.value }))
const pattern = computed(() => playbackPattern(input.value))
const duration = computed(() => playbackDuration(pattern.value))
const frame = computed(() => ledFrame(input.value, elapsed.value))
const playing = computed(() => clock.value.startedAtMs !== null)
const canAnimate = computed(() => pattern.value.frames.length > 0)
const finished = computed(() => canAnimate.value && Number.isFinite(duration.value) && elapsed.value >= duration.value)
const title = computed(() => ({ battery: 'Battery level', charging: 'Charging progress', rh2: 'RH2 charging colour', vehicle: 'VT3 connection status' })[props.mode])
const presets = computed(() => props.mode === 'rh2' ? [15, 50, 80, 95, 99] : props.mode === 'charging' ? [10, 35, 55, 75, 90, 95] : [10, 35, 55, 75, 90])
const summary = computed(() => {
    if (frame.value.kind === 'rgb') return `${frame.value.colour} at ${percentage.value}%. ${frame.value.steady ? 'The light stays steady at 99% and above.' : 'Brightness increases in five steps, about 0.5 seconds each, then repeats.'}`
    if (frame.value.kind === 'vehicle') {
        const selected = ignition.value && vehicleCharging.value ? 'Both pairs flash together' : ignition.value ? 'Indicators 1 and 2 flash' : vehicleCharging.value ? 'Indicators 3 and 4 flash' : 'All four indicators stay off'
        return `${selected}.${canAnimate.value ? ' Five cycles: 0.3 seconds on, 0.2 seconds off.' : ' Turn on a condition to explore its pattern.'}`
    }
    if (props.mode === 'battery' && percentage.value < 20) return 'Low battery: the first LED flashes six times.'
    if (props.mode === 'charging' && percentage.value < 95) return 'The highest lit LED blinks while charging.'
    if (props.mode === 'charging') return 'All four LEDs stay on at 95% and above.'
    return `${frame.value.bars} of 4 LEDs on.`
})
const frameDescription = computed(() => {
    const current = frame.value
    if (current.kind === 'rgb') return current.steady ? `${current.colour} · steady` : `${current.colour} · brightness step ${current.step} of 5`
    const on = current.lights.flatMap((lit, index) => lit ? [index + 1] : [])
    const lights = on.length ? `On: ${on.join(', ')}` : 'All indicators off'
    if (compact.value) return lights
    if (current.phase === 'complete') return `${lights} · sequence complete`
    if (current.kind === 'vehicle' && canAnimate.value) return `${lights} · cycle ${current.cycle} of 5`
    return lights
})
const rgbStyle = computed(() => {
    if (frame.value.kind !== 'rgb') return {}
    // Browser RGB is scaled for illustration, not a physical brightness claim.
    const channels = frame.value.rgb.map(channel => Math.round(channel * 255 / 128))
    return { '--led-rgb': channels.join(', ') }
})

function clearTimer() {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
}
function pause() {
    clearTimer()
    if (!playing.value) return
    clock.value = pauseClock(clock.value, performance.now())
    elapsed.value = Math.min(clock.value.elapsedMs, duration.value)
    clock.value = { elapsedMs: elapsed.value, startedAtMs: null }
}
function reset() {
    clearTimer()
    elapsed.value = 0
    clock.value = { elapsedMs: 0, startedAtMs: null }
}
function schedule() {
    if (!playing.value) return
    const nowElapsed = clockElapsed(clock.value, performance.now())
    elapsed.value = Math.min(nowElapsed, duration.value)
    if (elapsed.value >= duration.value) {
        pause()
        return
    }
    const next = nextFrameTime(pattern.value, elapsed.value)
    timer = setTimeout(schedule, Math.max(1, next - nowElapsed))
}
function play() {
    if (!ready.value || reducedMotion.value || !canAnimate.value || document.hidden || playing.value) return
    if (finished.value) reset()
    clock.value = startClock(clock.value, performance.now())
    schedule()
}
function replay() {
    reset()
    play()
}
function selectionChanged() {
    reset()
    if (compact.value) play()
}
function selectPreset(level: number) {
    // Re-selecting a level replays a finite sequence without a separate control.
    if (percentage.value === level) selectionChanged()
    else percentage.value = level
}
function step() {
    pause()
    elapsed.value = finished.value ? 0 : nextFrameTime(pattern.value, elapsed.value)
    clock.value = { elapsedMs: elapsed.value, startedAtMs: null }
}
function motionChanged(event: MediaQueryListEvent) {
    reducedMotion.value = event.matches
    if (event.matches) {
        if (compact.value) reset()
        else pause()
    }
}
function visibilityChanged() {
    if (document.hidden) pause()
    else if (compact.value && !finished.value) play()
}
watch(input, selectionChanged)
onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = motionQuery.matches
    motionQuery.addEventListener('change', motionChanged)
    document.addEventListener('visibilitychange', visibilityChanged)
    ready.value = true
    if (compact.value) play()
})
onBeforeUnmount(() => {
    clearTimer()
    motionQuery?.removeEventListener('change', motionChanged)
    document.removeEventListener('visibilitychange', visibilityChanged)
})
</script>

<template>
    <section class="led-demo" :class="{ 'led-demo--power': compact }" :aria-label="`${title} demo`">
        <header class="led-demo__header">
            <p class="led-demo__title">{{ title }}</p>
            <div v-if="compact" class="led-demo__header-actions">
                <strong class="led-demo__value">{{ percentage }}%</strong>
            </div>
        </header>

        <div class="led-demo__stage" :class="{ 'led-demo__stage--rgb': mode === 'rh2' }">
            <div v-if="frame.kind === 'rgb'" class="led-demo__rgb" :style="rgbStyle" aria-hidden="true">
                <span class="led-demo__rgb-light"></span>
                <span class="led-demo__rgb-colour">{{ frame.colour }}</span>
            </div>
            <div v-else class="led-demo__indicators" aria-hidden="true">
                <div v-for="(on, index) in frame.lights" :key="index" class="led-demo__indicator">
                    <span class="led-demo__light" :class="{ 'led-demo__light--on': on }"></span>
                    <span class="led-demo__number">{{ index + 1 }}</span>
                    <span v-if="!compact" class="led-demo__on-off">{{ on ? 'On' : 'Off' }}</span>
                </div>
            </div>
            <p class="led-demo__frame" :class="{ 'led-demo__sr-only': compact }" :aria-live="compact || playing ? 'off' : 'polite'" aria-atomic="true">{{ frameDescription }}</p>
        </div>

        <div class="led-demo__body">
            <fieldset v-if="mode === 'vehicle'" class="led-demo__conditions" :disabled="!ready">
                <legend>Choose example conditions</legend>
                <label class="led-demo__check"><input v-model="ignition" type="checkbox" /> <span>Ignition high <small>Indicators 1 + 2</small></span></label>
                <label class="led-demo__check"><input v-model="vehicleCharging" type="checkbox" /> <span>Charging <small>Indicators 3 + 4</small></span></label>
            </fieldset>
            <div v-else class="led-demo__level">
                <label class="led-demo__range-label">
                    <span class="led-demo__range-heading" :class="{ 'led-demo__sr-only': compact }"><span>Battery level</span><strong>{{ percentage }}%</strong></span>
                    <input v-model.number="percentage" type="range" min="0" max="100" step="1" :disabled="!ready" :aria-valuetext="`${percentage} percent`" />
                </label>
                <div class="led-demo__presets" role="group" aria-label="Example battery levels">
                    <button v-for="level in presets" :key="level" type="button" :disabled="!ready" :aria-pressed="percentage === level" @click="selectPreset(level)">{{ level }}%</button>
                </div>
            </div>

            <p class="led-demo__summary" aria-live="polite">{{ summary }}</p>
            <div v-if="!compact" class="led-demo__playback" role="group" aria-label="Animation controls">
                <button class="led-demo__primary" type="button" :disabled="!ready || !canAnimate || reducedMotion" @click="playing ? pause() : play()">
                    <span aria-hidden="true">{{ playing ? 'Ⅱ' : '▷' }}</span> {{ playing ? 'Pause' : finished ? 'Play again' : 'Play animation' }}
                </button>
                <button type="button" :disabled="!ready || !canAnimate" @click="replay">{{ reducedMotion ? 'Reset' : 'Replay' }}</button>
                <button type="button" :disabled="!ready || !canAnimate" @click="step">Next frame <span aria-hidden="true">→</span></button>
            </div>
            <p v-if="!ready" class="led-demo__hint">Enable JavaScript to adjust this example.</p>
            <p v-else-if="compact && reducedMotion && canAnimate" class="led-demo__hint">Animation off for reduced motion.</p>
            <p v-else-if="!compact" class="led-demo__hint">{{ reducedMotion && canAnimate ? 'Reduced motion is on. Use Next frame to explore without animation.' : canAnimate ? 'Starts paused. Play the pattern, or explore one frame at a time.' : mode === 'vehicle' ? 'Select ignition or charging to explore the flash sequence.' : 'This level is steady. Choose a level below 99% to explore the brightness steps.' }}</p>
        </div>
    </section>
</template>

<style scoped>
.led-demo {
    --demo-ink: var(--vp-c-text-1, #243149);
    --demo-muted: var(--vp-c-text-2, #57647b);
    --demo-line: var(--vp-c-divider, #dce1e9);
    --demo-panel: var(--vp-c-bg, #fff);
    --demo-soft: var(--vp-c-bg-soft, #f5f7fa);
    --demo-accent: var(--vp-c-brand-1, #345be9);
    margin: 24px 0;
    overflow: hidden;
    border: 1px solid var(--demo-line);
    border-radius: 18px;
    background: var(--demo-panel);
    color: var(--demo-ink);
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 5px 20px rgb(0 0 0 / 3%);
}
.led-demo p { margin: 0; }
.led-demo__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 24px 16px; }
.led-demo .led-demo__title { font-size: 19px; font-weight: 650; letter-spacing: -0.02em; line-height: 1.3; }
.led-demo__stage { padding: 25px 20px 18px; border-block: 1px solid var(--demo-line); background: var(--demo-soft); }
.led-demo__indicators { display: flex; justify-content: center; gap: clamp(16px, 6vw, 32px); }
.led-demo__indicator { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.led-demo__light { display: block; width: 34px; height: 44px; margin-bottom: 9px; border: 1px solid var(--demo-muted); border-radius: 9px; background: transparent; }
.led-demo__light--on { border-color: var(--demo-ink); background: var(--demo-ink); box-shadow: inset 0 1px 1px rgb(255 255 255 / 25%); }
.led-demo__number { font-size: 12px; font-weight: 700; line-height: 1; }
.led-demo__on-off { color: var(--demo-muted); font-size: 10px; line-height: 1.3; }
.led-demo .led-demo__frame { margin-top: 18px; text-align: center; color: var(--demo-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.led-demo__rgb { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.led-demo__rgb-light { display: block; width: 56px; height: 56px; border: 5px solid #222a35; border-radius: 50%; background: rgb(var(--led-rgb)); box-shadow: 0 0 0 1px #657080, 0 0 23px 3px rgba(var(--led-rgb), 0.16), inset 0 1px 4px rgb(255 255 255 / 25%); }
.led-demo__rgb-colour { color: var(--demo-ink); font-size: 12px; font-weight: 650; }
.led-demo__body { padding: 20px 24px 18px; }
.led-demo__range-label { display: block; }
.led-demo__range-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; }
.led-demo__range-heading strong { color: var(--demo-ink); font-size: 21px; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.04em; }
.led-demo input[type="range"] { display: block; width: 100%; height: 32px; margin: 3px 0 7px; cursor: pointer; accent-color: var(--demo-accent); }
.led-demo__presets { display: flex; flex-wrap: wrap; gap: 6px; }
.led-demo button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 7px 12px; border: 1px solid var(--demo-line); border-radius: 8px; background: var(--demo-panel); color: var(--demo-ink); font: inherit; font-size: 12px; line-height: 1.4; cursor: pointer; }
.led-demo button:hover:not(:disabled) { border-color: var(--demo-accent); color: var(--demo-accent); }
.led-demo button:focus-visible, .led-demo input:focus-visible { outline: 3px solid var(--demo-accent); outline-offset: 3px; }
.led-demo button:disabled { opacity: 0.55; cursor: default; }
.led-demo__presets button { min-height: 32px; padding: 5px 11px; border-radius: 6px; font-variant-numeric: tabular-nums; }
.led-demo__presets button[aria-pressed="true"] { border-color: var(--demo-accent); color: var(--demo-accent); box-shadow: inset 0 0 0 1px var(--demo-accent); }
.led-demo .led-demo__summary { min-height: 3em; margin: 18px 0 16px; font-size: 13px; }
.led-demo__playback { display: flex; flex-wrap: wrap; gap: 8px; }
.led-demo .led-demo__primary { border-color: var(--demo-ink); background: var(--demo-ink); color: var(--demo-panel); font-weight: 600; }
.led-demo .led-demo__primary:hover:not(:disabled) { border-color: var(--demo-accent); background: var(--demo-accent); color: var(--demo-panel); }
.led-demo .led-demo__hint { margin-top: 12px; color: var(--demo-muted); font-size: 11px; }
.led-demo__conditions { display: flex; flex-wrap: wrap; gap: 8px 20px; padding: 0; margin: 0; border: 0; }
.led-demo__conditions legend { margin-bottom: 10px; padding: 0; font-size: 12px; }
.led-demo__check { display: flex; align-items: center; gap: 9px; min-height: 44px; cursor: pointer; font-size: 13px; }
.led-demo__check input { flex-shrink: 0; width: 17px; height: 17px; accent-color: var(--demo-accent); }
.led-demo__check small { display: block; color: var(--demo-muted); font-size: 11px; }
/* Power displays stay compact; their LEDs are orange, unlike VT3's neutral demo. */
.led-demo--power { width: 100%; max-width: 28rem; margin: 18px 0; border-radius: 14px; }
.led-demo--power .led-demo__header { min-height: 46px; padding: 10px 18px 0; }
.led-demo--power .led-demo__title { font-size: 16px; }
.led-demo--power .led-demo__stage { padding: 10px 18px 4px; border: 0; background: transparent; }
.led-demo--power .led-demo__indicators { gap: 24px; }
.led-demo--power .led-demo__light { width: 32px; height: 24px; margin-bottom: 3px; border-radius: 6px; }
.led-demo--power .led-demo__light--on { border-color: #b85b05; background: #f59a23; box-shadow: 0 0 9px rgb(245 154 35 / 24%), inset 0 1px 1px rgb(255 255 255 / 35%); }
.led-demo--power .led-demo__number { font-size: 10px; color: var(--demo-muted); }
.led-demo--power .led-demo__body { padding: 6px 18px 14px; }
.led-demo__header-actions { display: flex; align-items: center; gap: 10px; }
.led-demo__value { font-size: 18px; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.04em; }
.led-demo--power input[type="range"] { height: 28px; margin: 0 0 5px; }
.led-demo--power .led-demo__presets { gap: 5px; }
.led-demo--power .led-demo__presets button { min-height: 28px; padding: 4px 10px; }
.led-demo--power .led-demo__summary { min-height: 0; margin: 10px 0 0; font-size: 12px; }
.led-demo--power .led-demo__hint { margin-top: 7px; }
.led-demo .led-demo__sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 420px) {
    .led-demo__header { padding: 17px 16px 14px; }
    .led-demo__body { padding: 18px 16px 16px; }
    .led-demo:not(.led-demo--power) .led-demo__title { font-size: 17px; }
    .led-demo__playback { gap: 6px; }
    .led-demo__playback button { padding: 7px 9px; }
}
</style>
