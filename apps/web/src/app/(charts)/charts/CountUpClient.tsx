// app/charts/CountUpClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'

type Props = {
  value: number
  durationMs?: number
}

export default function CountUpClient({
  value,
  durationMs = 750,
}: Props) {
  const target = useMemo(() => Math.max(0, value), [value])
  const [display, setDisplay] = useState<number>(() => target)

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches

    if (reduced) {
      // ✅ schedule state update safely
      queueMicrotask(() => setDisplay(target))
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(
        1,
        (now - start) / durationMs,
      )
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return <span aria-label={`${target}`}>{display}</span>
}
