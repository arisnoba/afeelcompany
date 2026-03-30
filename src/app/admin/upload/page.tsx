import { UploadForm } from '@/app/admin/upload/_components/UploadForm'
import { AdminPageIntro } from '@/components/admin/AdminPageIntro'

export default function AdminUploadPage() {
  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="업로드"
        title="새 포트폴리오 항목 업로드"
        description="이미지는 클라이언트에서 먼저 2000px 기준으로 리사이즈한 뒤 `multipart/form-data`로 전송됩니다."
        aside={
          <div>업로드 후 포트폴리오 화면에서 노출 여부를 확인하세요.</div>
        }
      />

      <UploadForm />
    </div>
  )
}
