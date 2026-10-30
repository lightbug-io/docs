import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const yaml = require('js-yaml')

const protocol = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))

describe('cellular diagnostic state contract', () => {
    it('documents the approved filesystem-mode numbering and older firmware difference', () => {
        const state = protocol.messages[62].data[1]
        expect(Object.fromEntries(Object.entries(state.values).map(([number, value]: [string, any]) => [number, value.id]))).toEqual({
            0: 'off', 1: 'turningOn', 2: 'resetting', 3: 'initializing',
            4: 'filesystemOnly', 5: 'awaitingNetwork', 6: 'initializingData',
            7: 'ready', 8: 'sleeping', 9: 'filesystemOnlySleeping',
        })
        expect(state.description).toContain('Earlier firmware uses 4 for Awaiting Network')
    })
})
