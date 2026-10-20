// An A4 landscape work card is about 60mm wide. 828px preserves print detail
// without decoding every original photo (often 2000px+) in server memory.
export function getPdfImageUrl(source: string): string {
  try {
    const url = new URL(source)
    if (url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com') && !url.pathname.toLowerCase().endsWith('.svg')) {
      return `/_next/image?url=${encodeURIComponent(source)}&w=828&q=75`
    }
  } catch {
    // Local fixture paths do not need the remote image optimizer.
  }
  return source
}
