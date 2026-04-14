'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
  const [isPending, setIsPending] = useState(false)

  async function handleSave() {
    setIsPending(true)

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
        toast.error(result.error ?? '회사 정보 저장에 실패했습니다.')
        return
      }

      toast.success('회사 정보가 저장되었습니다.')
    } catch {
      toast.error('회사 정보 저장에 실패했습니다.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="py-0">
      <CardHeader>
        <CardTitle>회사 프로필</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 pb-6">
        <div className="grid gap-2">
          <Label htmlFor="profile-about">About</Label>
          <Textarea
            id="profile-about"
            value={profile.aboutText}
            onChange={(event) =>
              setProfile((current) => ({ ...current, aboutText: event.target.value }))
            }
            rows={6}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="profile-email">Contact Email</Label>
            <Input
              id="profile-email"
              value={profile.contactEmail}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  contactEmail: event.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-phone">Contact Phone</Label>
            <Input
              id="profile-phone"
              value={profile.contactPhone}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  contactPhone: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="profile-address">Address</Label>
          <Input
            id="profile-address"
            value={profile.address}
            onChange={(event) =>
              setProfile((current) => ({ ...current, address: event.target.value }))
            }
          />
        </div>

        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? '저장 중...' : '회사 정보 저장'}
        </Button>
      </CardContent>
    </Card>
  )
}
