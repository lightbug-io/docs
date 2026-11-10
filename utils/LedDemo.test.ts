import {
    batteryBars, clockElapsed, ledFrame, nextFrameTime, pauseClock,
    playbackDuration, playbackPattern, startClock,
    type LedDemoInput, type PlaybackClock,
} from './LedDemo'

const input = (mode: LedDemoInput['mode'], percentage: number): LedDemoInput => ({ mode, percentage })

describe('four power LED examples', () => {
    test.each([
        [0, 0], [19.999, 0], [20, 1], [39.999, 1], [40, 2],
        [59.999, 2], [60, 3], [79.999, 3], [80, 4], [100, 4],
        [-1, 0], [101, 4], [NaN, 0],
    ])('battery level %s has %s bars', (percentage, expected) => {
        expect(batteryBars(percentage)).toBe(expected)
    })

    test.each([20, 40, 60, 80, 95, 100])('off-charge level %s is steady', percentage => {
        const frame = ledFrame(input('battery', percentage), 1750)
        expect(frame.kind).toBe('bars')
        expect(frame).toMatchObject({ blinkingBar: null, phase: 'steady' })
        expect(playbackDuration(playbackPattern(input('battery', percentage)))).toBe(0)
    })

    test('low battery flashes the first indicator six times, then stops off', () => {
        const state = input('battery', 19)
        for (let cycle = 0; cycle < 6; cycle++) {
            expect(ledFrame(state, cycle * 600)).toMatchObject({ lights: [true, false, false, false], cycle: cycle + 1, phase: 'on' })
            expect(ledFrame(state, cycle * 600 + 300)).toMatchObject({ lights: [false, false, false, false], cycle: cycle + 1, phase: 'off' })
        }
        expect(ledFrame(state, 3600)).toMatchObject({ lights: [false, false, false, false], phase: 'complete' })
        expect(ledFrame(state, 9000)).toMatchObject({ lights: [false, false, false, false], phase: 'complete' })
        expect(playbackDuration(playbackPattern(state))).toBe(3600)
    })

    test.each([0, 19, 20, 39, 40, 59, 60, 79, 80, 94.999])('charging %s blinks only its highest indicator', percentage => {
        const state = input('charging', percentage)
        const count = Math.max(1, batteryBars(percentage))
        const on = [0, 1, 2, 3].map(index => index < count)
        const off = [0, 1, 2, 3].map(index => index < count - 1)
        expect(ledFrame(state, 0)).toMatchObject({ lights: on, blinkingBar: count, phase: 'on' })
        expect(ledFrame(state, 999)).toMatchObject({ lights: on })
        expect(ledFrame(state, 1000)).toMatchObject({ lights: off, phase: 'off' })
        expect(ledFrame(state, 1999)).toMatchObject({ lights: off })
        expect(ledFrame(state, 2000)).toMatchObject({ lights: on })
    })

    test.each([95, 99, 100])('charging %s keeps all four on', percentage => {
        expect(ledFrame(input('charging', percentage), 1500)).toMatchObject({ lights: [true, true, true, true], blinkingBar: null, phase: 'steady' })
        expect(playbackPattern(input('charging', percentage)).frames).toEqual([])
    })
})

describe('RH2 charging example', () => {
    test.each([
        [0, 'Red'], [29.999, 'Red'], [30, 'Orange'], [69.999, 'Orange'],
        [70, 'Yellow-green'], [89.999, 'Yellow-green'], [90, 'Green'], [98.999, 'Green'], [99, 'Green'], [100, 'Green'],
    ])('percentage %s uses %s', (percentage, colour) => {
        expect(ledFrame(input('rh2', percentage))).toMatchObject({ kind: 'rgb', colour })
    })

    test.each([
        [15, [[88, 0, 0], [98, 0, 0], [108, 0, 0], [118, 0, 0], [128, 0, 0]]],
        [50, [[48, 20, 3], [68, 30, 3], [88, 40, 3], [108, 50, 3], [128, 60, 3]]],
        [80, [[20, 48, 3], [30, 68, 3], [40, 88, 3], [50, 108, 3], [60, 128, 3]]],
        [95, [[0, 48, 0], [0, 68, 0], [0, 88, 0], [0, 108, 0], [0, 128, 0]]],
    ])('percentage %s uses the five verified firmware channel steps', (percentage, channels) => {
        for (let step = 0; step < 5; step++) {
            expect(ledFrame(input('rh2', percentage), step * 500)).toMatchObject({ rgb: channels[step], step: step + 1, steady: false })
            expect(ledFrame(input('rh2', percentage), step * 500 + 499)).toMatchObject({ rgb: channels[step] })
        }
        expect(ledFrame(input('rh2', percentage), 2500)).toMatchObject({ rgb: channels[0], step: 1 })
    })

    test('99% is steady rather than borrowing the four-bar 95% threshold', () => {
        expect(playbackDuration(playbackPattern(input('rh2', 95)))).toBe(Infinity)
        expect(playbackDuration(playbackPattern(input('charging', 95)))).toBe(0)
        for (const elapsed of [0, 499, 500, 2000, 5000]) {
            expect(ledFrame(input('rh2', 99), elapsed)).toMatchObject({ rgb: [0, 128, 0], steady: true })
        }
    })

    test('RH2 and four-bar states do not expose one another’s indicators', () => {
        expect(ledFrame(input('rh2', 55))).not.toHaveProperty('lights')
        expect(ledFrame(input('charging', 55))).not.toHaveProperty('rgb')
    })
})

describe('VT3 connection example', () => {
    test.each([
        [false, false, [false, false, false, false]],
        [true, false, [true, true, false, false]],
        [false, true, [false, false, true, true]],
        [true, true, [true, true, true, true]],
    ])('ignition %s, charging %s selects only the logical pair', (ignition, vehicleCharging, lights) => {
        const state: LedDemoInput = { mode: 'vehicle', percentage: 55, ignition, vehicleCharging }
        expect(ledFrame(state, 0)).toMatchObject({ kind: 'vehicle', lights })
        expect(ledFrame(state, 300)).toMatchObject({ lights: [false, false, false, false] })
    })

    test('plays exactly five cycles of 300ms on, 200ms off', () => {
        const state: LedDemoInput = { mode: 'vehicle', percentage: 0, ignition: true }
        for (let cycle = 0; cycle < 5; cycle++) {
            expect(ledFrame(state, cycle * 500 + 299)).toMatchObject({ lights: [true, true, false, false], cycle: cycle + 1 })
            expect(ledFrame(state, cycle * 500 + 300)).toMatchObject({ lights: [false, false, false, false], cycle: cycle + 1 })
            expect(ledFrame(state, cycle * 500 + 499)).toMatchObject({ lights: [false, false, false, false] })
        }
        expect(ledFrame(state, 2500)).toMatchObject({ phase: 'complete', lights: [false, false, false, false] })
        expect(playbackDuration(playbackPattern(state))).toBe(2500)
    })
})

describe('deterministic playback and pause', () => {
    test('pausing retains the exact off frame and resumes the remaining time', () => {
        const state = input('charging', 55)
        let clock: PlaybackClock = { elapsedMs: 0, startedAtMs: null }
        clock = startClock(clock, 100)
        clock = pauseClock(clock, 1850)
        expect(clock.elapsedMs).toBe(1750)
        expect(ledFrame(state, clockElapsed(clock, 9000))).toMatchObject({ lights: [true, false, false, false], phase: 'off' })
        clock = startClock(clock, 9000)
        expect(ledFrame(state, clockElapsed(clock, 9249))).toMatchObject({ phase: 'off' })
        expect(ledFrame(state, clockElapsed(clock, 9250))).toMatchObject({ phase: 'on' })
    })

    test('stepping advances to boundaries rather than accumulating arbitrary time', () => {
        const pattern = playbackPattern({ mode: 'vehicle', percentage: 0, ignition: true })
        expect([0, 250, 300, 499, 500, 2300, 2500].map(elapsed => nextFrameTime(pattern, elapsed))).toEqual([300, 300, 500, 500, 800, 2500, 2500])
        expect(nextFrameTime(playbackPattern(input('rh2', 80)), 700)).toBe(1000)
        expect(nextFrameTime(playbackPattern(input('charging', 80)), 2500)).toBe(3000)
        expect(nextFrameTime(playbackPattern(input('battery', 80)), 0)).toBe(0)
    })

    test('restarting an active clock cannot reset its elapsed time', () => {
        const clock = startClock({ elapsedMs: 1250, startedAtMs: null }, 5000)
        expect(startClock(clock, 6000)).toBe(clock)
        expect(clockElapsed(clock, 6000)).toBe(2250)
    })
})
