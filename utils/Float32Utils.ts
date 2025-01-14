export default class Float32Utils {
    static float32ToBytesLE(value: number): number[] {
        const float32 = new Float32Array(1);
        float32[0] = value;
        return Array.from(new Uint8Array(float32.buffer));
    }

    static bytesLEToFloat32(bytes: number[]): number {
        const float32 = new Float32Array(new Uint8Array(bytes).buffer);
        return float32[0];
    }

    static float32ToString(value: number): string {
        return value.toString();
    }
}
