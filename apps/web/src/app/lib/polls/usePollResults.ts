'use client'

import { useEffect, useState } from 'react'

type PollResult = {
  index: number
  label: string
  votes: number
  percentage: number
}

export function usePollResults(pollId: number) {
  const [results, setResults] = useState<PollResult[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/polls/results?pollId=${pollId}`,
        { cache: 'no-store' }
      )

      const data = await res.json()

      setResults(data.results ?? [])
      setTotalVotes(data.totalVotes ?? 0)
      setLoading(false)
    }

    load()
  }, [pollId])

  return { results, totalVotes, loading }
}
