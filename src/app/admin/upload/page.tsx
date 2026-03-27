import { UploadForm } from '@/app/admin/upload/_components/UploadForm'

export default function AdminUploadPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-stone-950/8">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          Upload
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
          새 포트폴리오 항목 업로드
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          이미지는 클라이언트에서 먼저 2000px 기준으로 리사이즈한 뒤 `multipart/form-data`
          로 전송합니다. 업로드가 끝나면 같은 자산이 웹, PDF, 인스타 큐의 시작 데이터가 됩니다.
        </p>
      </section>

      <UploadForm />
    </div>
  )
}
