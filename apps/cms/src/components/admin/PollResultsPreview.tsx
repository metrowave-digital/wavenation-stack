'use client'

import { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

type PollResults = Record<string, number>

export default function PollResultsPreview() {
  const { id } = useDocumentInfo()
  const [results, setResults] = useState<PollResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 🛑 Guard: ID must exist AND be numeric
    if (!id) return
    if (typeof id !== 'string') return
    if (!/^\d+$/.test(id)) return

    const pollId = Number(id)

    const baseURL = process.env.NEXT_PUBLIC_SITE_URL
    if (!baseURL) {
      setError('NEXT_PUBLIC_SITE_URL not set')
      return
    }

    setLoading(true)

    fetch(`${baseURL}/api/polls/results?pollId=${pollId}`, {
      cache: 'no-store',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Fetch failed')
        }
        return res.json()
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setResults(data)
        } else {
          setResults({})
        }
      })
      .catch(() => {
        setError('Failed to load poll results')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (error) {
    return (
      <p style={{ color: 'var(--theme-error-500)' }}>
        {error}
      </p>
    )
  }

  if (loading) {
    return <p>Loading results…</p>
  }

  if (!results || Object.keys(results).length === 0) {
    return <p>No votes yet.</p>
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4 style={{ marginBottom: 8 }}>
        Live Results
      </h4>

      <ul style={{ paddingLeft: 16 }}>
        {Object.entries(results).map(
          ([slug, count]) => (
            <li key={slug}>
              {slug}:{' '}
              <strong>{count}</strong>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
