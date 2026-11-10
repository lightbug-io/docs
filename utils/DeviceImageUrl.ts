import { withBase } from 'vitepress'

/** Share image routing across product galleries, specification rows and PDFs. */
export function deviceImageUrl(src: string): string {
  return ['https://lightbug.io/', 'https://lightbug.cloud/', 'https://upload.r2.lb.chasm.cloud/']
    .some(origin => src.startsWith(origin))
    ? `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(src)}`
    : withBase(src)
}
