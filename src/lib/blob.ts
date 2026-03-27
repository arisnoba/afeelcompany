import { put } from '@vercel/blob'

const MAX_SERVER_UPLOAD_SIZE_BYTES = 4_500_000
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function uploadPublicImage(
  file: File,
  pathnamePrefix: 'portfolio' | 'brands'
): Promise<{ url: string; pathname: string }> {
  if (file.size > MAX_SERVER_UPLOAD_SIZE_BYTES) {
    throw new Error('이미지 용량은 4.5MB 이하여야 합니다.')
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다.')
  }

  const safeName = sanitizeFilename(file.name || 'upload.jpg') || 'upload.jpg'
  const pathname = `${pathnamePrefix}/${Date.now()}-${safeName}`

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
  }
}
