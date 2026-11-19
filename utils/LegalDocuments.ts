export interface LegalDocument {
  id: 'terms' | 'eula';
  title: string;
  version: string;
  url: string;
  sha256: string;
}
export interface LegalManifest { setId: string; documents: LegalDocument[]; }
export const emptyLegalManifest = (): LegalManifest => ({ setId: '', documents: [] });
export function parseLegalManifest(value: any): LegalManifest {
  if (!value || !Array.isArray(value.documents) || typeof value.setId !== 'string') throw new Error('Legal documents are unavailable');
  if (!value.documents.length && value.setId === '') return emptyLegalManifest();
  if (!/^[a-f0-9]{64}$/.test(value.setId) || !value.documents.length) throw new Error('Legal documents are unavailable');
  const seen = new Set<string>();
  for (const document of value.documents) {
    if (!document || !['terms', 'eula'].includes(document.id) || seen.has(document.id) ||
        typeof document.title !== 'string' || !document.title.trim() ||
        typeof document.version !== 'string' || !document.version.trim() ||
        typeof document.url !== 'string' || !/^[a-f0-9]{64}$/.test(document.sha256)) throw new Error('Legal documents are unavailable');
    const url = new URL(document.url);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.hash) throw new Error('Legal documents are unavailable');
    seen.add(document.id);
  }
  return value;
}
