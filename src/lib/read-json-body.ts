export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  if (!request.body || Number(request.headers.get('content-length')) > maxBytes) return null

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ''

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return JSON.parse(text + decoder.decode()) as unknown

      size += value.byteLength
      if (size > maxBytes) {
        void reader.cancel().catch(() => {})
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }
}
