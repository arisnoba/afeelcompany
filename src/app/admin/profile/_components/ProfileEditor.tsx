'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface ProfileEditorProps {
  initialProfile: {
    aboutText: string
    contactEmail: string
    contactPhone: string
    address: string
  }
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSave() {
    setIsPending(true)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        setError(result.error ?? '회사 정보 저장에 실패했습니다.')
        return
      }

      setFeedback('회사 정보가 저장되었습니다.')
    } catch {
      setError('회사 정보 저장에 실패했습니다.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="rounded-[32px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
      <CardHeader>
        <CardTitle>회사 프로필</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-stone-800">
          About
          <textarea
            value={profile.aboutText}
            onChange={(event) =>
              setProfile((current) => ({ ...current, aboutText: event.target.value }))
            }
            rows={6}
            className="rounded-[28px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            Contact Email
            <Input
              value={profile.contactEmail}
              onChange={(event) =>
                setProfile((current) => ({ ...current, contactEmail: event.target.value }))
              }
              className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-800">
            Contact Phone
            <Input
              value={profile.contactPhone}
              onChange={(event) =>
                setProfile((current) => ({ ...current, contactPhone: event.target.value }))
              }
              className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-stone-800">
          Address
          <Input
            value={profile.address}
            onChange={(event) =>
              setProfile((current) => ({ ...current, address: event.target.value }))
            }
            className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
          />
        </label>

        {feedback ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <Button
          type="button"
          size="lg"
          onClick={handleSave}
          disabled={isPending}
          className="h-11 rounded-full bg-stone-950 text-white hover:bg-stone-800"
        >
          {isPending ? '저장 중...' : '회사 정보 저장'}
        </Button>
      </CardContent>
    </Card>
  )
}
