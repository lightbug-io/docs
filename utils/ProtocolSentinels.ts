/** A named raw numeric value that represents a state rather than a measurement. */
export interface ProtocolSentinel {
    id: string
    name: string
    description?: string
}

export type ProtocolSentinels = Record<string, ProtocolSentinel>

/** Match before conversion or unit formatting; never reinterpret arrays or text. */
export function formatSentinelValue(value: unknown, field: { sentinels?: ProtocolSentinels }): string | undefined {
    if (typeof value !== 'bigint' && (typeof value !== 'number' || !Number.isFinite(value))) return undefined
    const key = String(value)
    if (!field.sentinels || !Object.prototype.hasOwnProperty.call(field.sentinels, key)) return undefined
    const sentinel = field.sentinels[key]
    if (typeof sentinel?.name !== 'string' || !sentinel.name.trim()) return undefined
    return `${sentinel.name} (raw ${key})`
}
