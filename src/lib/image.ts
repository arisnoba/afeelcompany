function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'))
    image.src = sourceUrl
  })
}

export async function resizePortfolioImage(file: File): Promise<File> {
  const sourceUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(sourceUrl)
    const maxDimension = 2000
    const longestSide = Math.max(image.width, image.height)
    const scale = longestSide > maxDimension ? maxDimension / longestSide : 1
    const targetWidth = Math.max(1, Math.round(image.width * scale))
    const targetHeight = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')

    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('이미지 리사이즈 컨텍스트를 만들지 못했습니다.')
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    })

    if (!blob) {
      throw new Error('이미지 변환에 실패했습니다.')
    }

    const targetName = file.name.replace(/\.[^.]+$/, '') || 'portfolio-image'

    return new File([blob], `${targetName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}
