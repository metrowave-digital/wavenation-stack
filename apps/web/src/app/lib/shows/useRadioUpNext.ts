'use client'

import { useEffect, useState } from 'react'
import { parseHHmm } from '@/lib/time'

/* ================= TYPES ================= */

export type RadioShowSchedule = {
  days?: string[]
  startTime?: string
  endTime?: string
}

export type RadioShow = {
  title: string
  slug: string | null
  showType: string
  schedule?: RadioShowSchedule
}

export type RadioScheduleItem = {
  id: number
  startTime: string | null
  endTime: string | null
  daysOfWeek: string[] | null
  isLive: boolean
  isReplay: boolean
  isAutomation: boolean
  radioShow: RadioShow
}

/**
 * Fully normalized schedule item
 * (internal use only)
 */
type NormalizedScheduleItem = RadioScheduleItem & {
  _days: string[]
  _start: string
  _end: string
}

/* ================= CONSTANTS ================= */

const WEEKDAYS: readonly string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/* ================= HELPERS ================= */

function resolveDays(item: RadioScheduleItem): string[] {
  if (item.daysOfWeek && item.daysOfWeek.length > 0) {
    return item.daysOfWeek
  }

  if (item.radioShow.schedule?.days?.length) {
    return item.radioShow.schedule.days
  }

  return []
}

function resolveStart(item: RadioScheduleItem): string | null {
  return item.startTime ?? item.radioShow.schedule?.startTime ?? null
}

function resolveEnd(item: RadioScheduleItem): string | null {
  return item.endTime ?? item.radioShow.schedule?.endTime ?? null
}

/* ================= HOOK ================= */

export function useRadioUpNext() {
  const [live, setLive] = useState<NormalizedScheduleItem | null>(null)
  const [upNext, setUpNext] = useState<NormalizedScheduleItem | null>(null)
  const [schedule, setSchedule] = useState<NormalizedScheduleItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const res = await fetch('/api/radioSchedule')

        if (!res.ok) {
          throw new Error(`Schedule API failed: ${res.status}`)
        }

        const data: { docs?: RadioScheduleItem[] } = await res.json()
        const docs = data.docs ?? []

        const now = new Date()
        const todayIndex = now.getDay()
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

        /* ===== NORMALIZE ALL ITEMS ===== */
        const normalized: NormalizedScheduleItem[] = docs
          .map((item): NormalizedScheduleItem | null => {
            const days = resolveDays(item)
            const start = resolveStart(item)
            const end = resolveEnd(item)

            if (!days.length || !start || !end) return null

            return {
              ...item,
              _days: days,
              _start: start,
              _end: end,
            }
          })
          .filter(
            (item): item is NormalizedScheduleItem =>
              item !== null
          )

        /* ===== SORT BY START TIME ===== */
        const sorted = [...normalized].sort((a, b) =>
          a._start.localeCompare(b._start)
        )

        setSchedule(sorted)

        /* ===== FIND LIVE + NEXT (TODAY OR FUTURE) ===== */
        let foundLive: NormalizedScheduleItem | null = null
        let foundNext: NormalizedScheduleItem | null = null

        for (let offset = 0; offset < 7; offset++) {
          const dayIndex = (todayIndex + offset) % 7
          const dayName = WEEKDAYS[dayIndex]

          const dayShows = sorted.filter(show =>
            show._days.includes(dayName)
          )

          for (const show of dayShows) {
            const baseDate = new Date(now)
            baseDate.setDate(now.getDate() + offset)

            const start = parseHHmm(show._start, baseDate, tz)
            const end = parseHHmm(show._end, baseDate, tz)

            // LIVE (today only)
            if (offset === 0 && now >= start && now <= end) {
              foundLive = show
              break
            }

            // NEXT (today or future day)
            if (!foundNext && start > now) {
              foundNext = show
            }
          }

          if (foundLive) break
        }

        setLive(foundLive)
        setUpNext(foundNext)
      } catch (err) {
        console.error('[useRadioUpNext]', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    live,
    upNext,
    schedule, // FULL schedule (never empty if data exists)
    loading,
  }
}
