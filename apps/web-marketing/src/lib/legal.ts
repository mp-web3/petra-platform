export type LegalDocKey = 'terms' | 'privacy';

export type LegalVersion = 'v1.0';

export async function fetchLegalMarkdown(
  key: LegalDocKey,
  version: LegalVersion
): Promise<string> {
  const base = key === 'terms' ? '/terms' : '/privacy';
  const url = `${base}/${version}.md`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok)
    throw new Error(`Impossibile caricare il documento legale: ${key}@${version}`);
  return await res.text();
}

export const CURRENT_TERMS_VERSION: LegalVersion = 'v1.0';
export const CURRENT_PRIVACY_VERSION: LegalVersion = 'v1.0';

