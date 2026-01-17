'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './HeroPoll.module.css'
import { HeroPollSkeleton } from './HeroPollSkeleton'
import { trackEvent } from '@/lib/analytics'

/* ===========================
   Types
=========================== */

type PollOption = {
  label: string
  slug: string
}

type Poll = {
  id: number
  question: string
  options: PollOption[]
  status: 'draft' | 'live' | 'closed'
  startDate?: string | null
  endDate?: string | null
}

type PollResults = Record<string, number>

/* ===========================
   Component
=========================== */

export function HeroPoll() {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [results, setResults] = useState<PollResults>({})
  const [voted, setVoted] = useState(false)
  const [votedOption, setVotedOption] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Capture time once for deterministic renders
  const [now] = useState(() => Date.now())

  // Prevent double impression firing
  const hasTrackedImpression = useRef(false)

  /* ===========================
     FETCH FEATURED POLL
  =========================== */

  useEffect(() => {
    let cancelled = false

    async function loadPoll() {
      try {
        const res = await fetch('/api/polls/featured', {
          cache: 'no-store',
        })

        if (!res.ok) {
          if (!cancelled) setPoll(null)
          return
        }

        const data: Poll | null = await res.json()

        if (!data || typeof data.id !== 'number') {
          if (!cancelled) setPoll(null)
          return
        }

        if (!cancelled) setPoll(data)

        const resultsRes = await fetch(
          `/api/polls/results?pollId=${data.id}`,
          { cache: 'no-store' }
        )

        if (resultsRes.ok && !cancelled) {
          const json = await resultsRes.json()
          setResults(json ?? {})
        }
      } catch {
        if (!cancelled) setPoll(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPoll()

    return () => {
      cancelled = true
    }
  }, [])

  /* ===========================
     IMPRESSION ANALYTICS (ONCE)
  =========================== */

  useEffect(() => {
    if (!poll || hasTrackedImpression.current) return

    trackEvent('content_impression', {
      placement: 'hero_poll',
      page: 'home',
      pollId: poll.id,
      question: poll.question,
      status: poll.status,
    })

    hasTrackedImpression.current = true
  }, [poll])

  /* ===========================
     DERIVED DATA
  =========================== */

  const optionsWithVotes = useMemo(() => {
    if (!poll) return []
    return poll.options.map(option => ({
      ...option,
      votes: results[option.slug] ?? 0,
    }))
  }, [poll, results])

  const totalVotes = useMemo(
    () => Object.values(results).reduce((a, b) => a + b, 0),
    [results]
  )

  const leaderSlug = useMemo(() => {
    if (!optionsWithVotes.length) return null
    return [...optionsWithVotes].sort(
      (a, b) => b.votes - a.votes
    )[0].slug
  }, [optionsWithVotes])

  const isClosed = useMemo(() => {
    if (!poll) return true
    if (poll.status === 'closed') return true
    if (poll.endDate) {
      return new Date(poll.endDate).getTime() < now
    }
    return false
  }, [poll, now])

  // ✅ ADDITION (minimal)
  const hasAlreadyVoted = voted && !submitting

  /* ===========================
     COUNTDOWN META
  =========================== */

  const countdownMeta = useMemo(() => {
    if (!poll?.endDate || isClosed) return null

    const end = new Date(poll.endDate).getTime()
    const diffMs = end - now
    if (diffMs <= 0) return null

    const totalMinutes = Math.floor(diffMs / 60000)
    const totalHours = Math.floor(totalMinutes / 60)

    const nowDate = new Date(now)
    const endDate = new Date(end)

    const isSameDay =
      nowDate.toDateString() === endDate.toDateString()

    const isTomorrow =
      new Date(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate() + 1
      ).toDateString() === endDate.toDateString()

    let label: string

    if (totalMinutes < 60) {
      label = `Ends in ${totalMinutes}m`
    } else if (totalHours < 24) {
      label = `Ends in ${totalHours}h`
    } else {
      const days = Math.floor(totalHours / 24)
      label = `Ends in ${days}d`
    }

    if (isSameDay && totalHours >= 1) {
      label = 'Ends today'
    } else if (isTomorrow) {
      label = 'Ends tomorrow'
    }

    return {
      label,
      urgency:
        totalMinutes < 10
          ? 'critical'
          : totalMinutes < 60
          ? 'warning'
          : 'normal',
    }
  }, [poll, now, isClosed])

  /* ===========================
     VOTE
  =========================== */

  async function vote(optionSlug: string) {
    if (!poll || submitting || voted) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: poll.id,
          option: optionSlug,
        }),
      })

      if (!res.ok) return

      setVoted(true)
      setVotedOption(optionSlug)

      trackEvent('poll_vote', {
        placement: 'hero_poll',
        page: 'home',
        pollId: poll.id,
        option: optionSlug,
      })

      const resultsRes = await fetch(
        `/api/polls/results?pollId=${poll.id}`,
        { cache: 'no-store' }
      )

      if (resultsRes.ok) {
        const json = await resultsRes.json()
        setResults(json ?? {})
      }
    } finally {
      setSubmitting(false)
    }
  }

  /* ===========================
     RENDER GUARDS
  =========================== */

  if (loading) return <HeroPollSkeleton />
  if (!poll) return null

  /* ===========================
     RENDER
  =========================== */

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.question}>{poll.question}</h3>

      {countdownMeta && (
        <p
          className={`${styles.countdown} ${
            countdownMeta.urgency === 'warning'
              ? styles.warning
              : countdownMeta.urgency === 'critical'
              ? styles.critical
              : ''
          }`}
        >
          {countdownMeta.label}
        </p>
      )}

      {/* ✅ ADDITION (message only) */}
      {hasAlreadyVoted && (
        <p className={styles.alreadyVoted}>
          You’ve already voted!
        </p>
      )}

      {!hasAlreadyVoted && !isClosed ? (
        <ul className={styles.list}>
          {poll.options.map(option => (
            <li key={option.slug}>
              <button
                className={styles.option}
                disabled={submitting}
                onClick={() => vote(option.slug)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.results}>
          {votedOption && (
            <p className={styles.voted}>
              You voted for{' '}
              <strong>
                {
                  poll.options.find(
                    o => o.slug === votedOption
                  )?.label
                }
              </strong>
            </p>
          )}

          {optionsWithVotes.map(option => {
            const percent =
              totalVotes > 0
                ? Math.round(
                    (option.votes / totalVotes) * 100
                  )
                : 0

            const isLeader = option.slug === leaderSlug
            const isUserVote =
              option.slug === votedOption

            return (
              <div
                key={option.slug}
                className={`${styles.resultRow} ${
                  isLeader ? styles.leading : ''
                } ${isUserVote ? styles.userVote : ''}`}
              >
                <div className={styles.resultHeader}>
                  <span>{option.label}</span>
                  <span>{percent}%</span>
                </div>

                <div className={styles.bar}>
                  <span
                    className={styles.fill}
                    style={
                      {
                        '--target': `${percent}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            )
          })}

          <p className={styles.votes}>
            {totalVotes.toLocaleString()} votes
          </p>

          {isClosed && (
            <p className={styles.expired}>
              Poll closed
            </p>
          )}
        </div>
      )}
    </section>
  )
}
