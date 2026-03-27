'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'done' | 'error'

export function SyncButton() {
  const [syncStatus, setSyncStatus] = useState<Status>('idle')
  const [syncMessage, setSyncMessage] = useState('')
  const [refreshStatus, setRefreshStatus] = useState<Status>('idle')
  const [refreshMessage, setRefreshMessage] = useState('')

  async function handleSync() {
    setSyncStatus('loading')
    setSyncMessage('')
    try {
      const res = await fetch('/api/instagram/sync', { method: 'POST' })
      const json: unknown = await res.json()
      const data = json as { success: boolean; data?: { synced: number }; error?: string }
      if (data.success) {
        setSyncStatus('done')
        setSyncMessage(`Synced ${data.data?.synced ?? 0} posts. Refresh page to see updates.`)
      } else {
        setSyncStatus('error')
        setSyncMessage(data.error ?? 'Sync failed')
      }
    } catch {
      setSyncStatus('error')
      setSyncMessage('Network error during sync')
    }
  }

  async function handleRefreshToken() {
    setRefreshStatus('loading')
    setRefreshMessage('')
    try {
      const res = await fetch('/api/instagram/refresh-token', { method: 'POST' })
      const json: unknown = await res.json()
      const data = json as { success: boolean; data?: { expires_in: number; token_type: string }; error?: string }
      if (data.success) {
        setRefreshStatus('done')
        const expiresIn = data.data?.expires_in ?? 0
        setRefreshMessage(
          `Token refreshed. Expires in: ${expiresIn}s (${Math.round(expiresIn / 86400)} days)`
        )
      } else {
        setRefreshStatus('error')
        setRefreshMessage(data.error ?? 'Token refresh failed')
      }
    } catch {
      setRefreshStatus('error')
      setRefreshMessage('Network error during token refresh')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleSync}
          disabled={syncStatus === 'loading'}
          style={{
            padding: '8px 16px',
            background: syncStatus === 'loading' ? '#ccc' : '#000',
            color: '#fff',
            border: 'none',
            cursor: syncStatus === 'loading' ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
          }}
        >
          {syncStatus === 'loading' ? 'Syncing...' : 'Sync Now'}
        </button>
        {syncMessage && (
          <span style={{ color: syncStatus === 'error' ? 'red' : 'green', fontSize: '14px' }}>
            {syncMessage}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleRefreshToken}
          disabled={refreshStatus === 'loading'}
          style={{
            padding: '8px 16px',
            background: refreshStatus === 'loading' ? '#ccc' : '#444',
            color: '#fff',
            border: 'none',
            cursor: refreshStatus === 'loading' ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
          }}
        >
          {refreshStatus === 'loading' ? 'Refreshing...' : 'Refresh Token'}
        </button>
        {refreshMessage && (
          <span style={{ color: refreshStatus === 'error' ? 'red' : 'green', fontSize: '14px' }}>
            {refreshMessage}
          </span>
        )}
      </div>
    </div>
  )
}
