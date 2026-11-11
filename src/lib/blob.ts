import { put } from '@vercel/blob'
import sharp from 'sharp'

const MAX_SERVER_UPLOAD_SIZE_BYTES = 4_500_000
const MAX_IMAGE_PIXELS = 16_000_000
const IMAGE_TYPES = {
  jpeg: { mime: 'image/jpeg', extension: 'jpg' },
  png: { mime: 'image/png', extension: 'png' },
  webp: { mime: 'image/webp', extension: 'webp' },
} as const

type PreparedImage = { name: string; contentType: string; bytes: Buffer }

export class InvalidImageError extends Error {}

export async function preparePublicImage(file: File): Promise<PreparedImage> {
  if (!file.size || file.size > MAX_SERVER_UPLOAD_SIZE_BYTES) {
    throw new InvalidImageError('이미지 용량은 4.5MB 이하여야 합니다.')
  }

  const image = sharp(await file.arrayBuffer(), { limitInputPixels: MAX_IMAGE_PIXELS, animated: true })
  const { format } = await image.metadata().catch(() => ({ format: undefined }))
  if (format !== 'jpeg' && format !== 'png' && format !== 'webp') {
    throw new InvalidImageError('JPEG, PNG, WebP 이미지 파일만 업로드할 수 있습니다.')
  }

  const bytes = await image.autoOrient().toFormat(format).toBuffer().catch(() => {
    throw new InvalidImageError('이미지 파일을 읽을 수 없습니다.')
  })
  if (bytes.length > MAX_SERVER_UPLOAD_SIZE_BYTES) {
    throw new InvalidImageError('변환한 이미지의 용량은 4.5MB 이하여야 합니다.')
  }

  const base = file.name.replace(/\.[^.]*$/, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'upload'
  const { mime, extension } = IMAGE_TYPES[format]
  return { name: `${base}.${extension}`, contentType: mime, bytes }
}

export async function storePublicImage(image: PreparedImage, pathnamePrefix: 'portfolio' | 'brands') {
  const blob = await put(`${pathnamePrefix}/${Date.now()}-${image.name}`, image.bytes, {
    access: 'public',
    addRandomSuffix: true,
    contentType: image.contentType,
  })

  return { url: blob.url, pathname: blob.pathname }
}

export async function uploadPublicImage(file: File, pathnamePrefix: 'portfolio' | 'brands') {
  return storePublicImage(await preparePublicImage(file), pathnamePrefix)
}
