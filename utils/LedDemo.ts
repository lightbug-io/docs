/**
 * Illustrative LED states, kept separate from playback and rendering.
 * The colour channels and timings follow LED::showBatteryBars and the
 * RGB_STATUS charging branch. These are not calibrated light-output values.
 */
export type LedDemoMode = 'battery' | 'charging' | 'rh2' | 'vehicle'
export type RgbColour = 'Red' | 'Orange' | 'Yellow-green' | 'Green'
export type RgbChannels = [number, number, number]
export type FourLights = [boolean, boolean, boolean, boolean]
export interface LedDemoInput {
    mode: LedDemoMode
    percentage: number
    ignition?: boolean
    vehicleCharging?: boolean
}
export type LedDemoFrame =
    | { kind: 'bars'; lights: FourLights; bars: number; blinkingBar: number | null; phase: 'on' | 'off' | 'steady' | 'complete'; cycle: number | null }
    | { kind: 'rgb'; colour: RgbColour; rgb: RgbChannels; step: number; steady: boolean }
    | { kind: 'vehicle'; lights: FourLights; phase: 'on' | 'off' | 'complete'; cycle: number }
export interface PlaybackPattern {
    /** Individual frame lengths. Empty for a steady display. */
    frames: number[]
    /** Null means repeat until paused. */
    repeats: number | null
}
export interface PlaybackClock {
    elapsedMs: number
    startedAtMs: number | null
}

export function clampPercentage(value: number): number {
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
}

export function batteryBars(percentage: number): number {
    return Math.min(4, Math.floor(clampPercentage(percentage) / 20))
}

export function playbackPattern(input: LedDemoInput): PlaybackPattern {
    const percentage = clampPercentage(input.percentage)
    switch (input.mode) {
        case 'battery': return percentage < 20 ? { frames: [300, 300], repeats: 6 } : { frames: [], repeats: 0 }
        case 'charging': return percentage < 95 ? { frames: [1000, 1000], repeats: null } : { frames: [], repeats: 0 }
        case 'rh2': return percentage < 99 ? { frames: [500, 500, 500, 500, 500], repeats: null } : { frames: [], repeats: 0 }
        case 'vehicle': return input.ignition || input.vehicleCharging ? { frames: [300, 200], repeats: 5 } : { frames: [], repeats: 0 }
    }
}

export function playbackDuration(pattern: PlaybackPattern): number {
    if (!pattern.frames.length) return 0
    if (pattern.repeats === null) return Infinity
    return pattern.frames.reduce((sum, duration) => sum + duration, 0) * pattern.repeats
}

function safeElapsed(value: number): number {
    return Number.isFinite(value) ? Math.max(0, value) : 0
}

/** Returns the next boundary, including a finite sequence's final all-off frame. */
export function nextFrameTime(pattern: PlaybackPattern, elapsedMs: number): number {
    if (!pattern.frames.length) return 0
    const elapsed = safeElapsed(elapsedMs)
    const duration = playbackDuration(pattern)
    if (elapsed >= duration) return duration
    const cycle = pattern.frames.reduce((sum, frame) => sum + frame, 0)
    let boundary = Math.floor(elapsed / cycle) * cycle
    for (const frame of pattern.frames) {
        boundary += frame
        if (boundary > elapsed) return Math.min(boundary, duration)
    }
    return Math.min(boundary + pattern.frames[0], duration)
}

export function clockElapsed(clock: PlaybackClock, nowMs: number): number {
    return clock.elapsedMs + (clock.startedAtMs === null ? 0 : Math.max(0, nowMs - clock.startedAtMs))
}

export function pauseClock(clock: PlaybackClock, nowMs: number): PlaybackClock {
    return { elapsedMs: clockElapsed(clock, nowMs), startedAtMs: null }
}

export function startClock(clock: PlaybackClock, nowMs: number): PlaybackClock {
    return clock.startedAtMs === null ? { ...clock, startedAtMs: nowMs } : clock
}

export function ledFrame(input: LedDemoInput, elapsedMs = 0): LedDemoFrame {
    const percentage = clampPercentage(input.percentage)
    const elapsed = safeElapsed(elapsedMs)
    if (input.mode === 'rh2') {
        const steady = percentage >= 99
        const step = steady ? 4 : Math.floor(elapsed / 500) % 5
        const stepCount = 10 * (4 - step)
        let colour: RgbColour
        let rgb: RgbChannels
        if (percentage < 30) {
            colour = 'Red'
            rgb = [128 - stepCount, 0, 0]
        } else if (percentage < 70) {
            colour = 'Orange'
            rgb = [128 - stepCount * 2, 60 - stepCount, 3]
        } else if (percentage < 90) {
            colour = 'Yellow-green'
            rgb = [60 - stepCount, 128 - stepCount * 2, 3]
        } else {
            colour = 'Green'
            rgb = [0, 128 - stepCount * 2, 0]
        }
        return { kind: 'rgb', colour, rgb, step: step + 1, steady }
    }
    if (input.mode === 'vehicle') {
        const complete = elapsed >= 2500
        const on = !complete && elapsed % 500 < 300
        return {
            kind: 'vehicle',
            lights: [!!input.ignition && on, !!input.ignition && on, !!input.vehicleCharging && on, !!input.vehicleCharging && on],
            phase: complete ? 'complete' : on ? 'on' : 'off',
            cycle: Math.min(5, Math.floor(elapsed / 500) + 1),
        }
    }
    const bars = batteryBars(percentage)
    const charging = input.mode === 'charging'
    const lowBattery = !charging && percentage < 20
    const blinkingBar = lowBattery ? 1 : charging && percentage < 95 ? Math.max(1, bars) : null
    const complete = lowBattery && elapsed >= 3600
    const phase = complete ? 'complete' : blinkingBar === null ? 'steady' : Math.floor(elapsed / (charging ? 1000 : 300)) % 2 === 0 ? 'on' : 'off'
    const visibleBars = blinkingBar === null ? bars : Math.max(bars, blinkingBar)
    const lights = [0, 1, 2, 3].map(index => index < visibleBars && (index + 1 !== blinkingBar || phase === 'on')) as FourLights
    return { kind: 'bars', lights, bars, blinkingBar, phase, cycle: lowBattery ? Math.min(6, Math.floor(elapsed / 600) + 1) : null }
}
