export function getAirsInLabel(start: Date, now = new Date()): string {
  const diffMs = start.getTime() - now.getTime()
  if (diffMs <= 0) return 'Airing now'

  const mins = Math.round(diffMs / 60000)

  if (mins < 60) return `Airs in ${mins} min`
  if (mins < 1440) {
    const hrs = Math.floor(mins / 60)
    return `Airs in ${hrs} hour${hrs > 1 ? 's' : ''}`
  }

  const days = Math.floor(mins / 1440)
  return `Airs in ${days} day${days > 1 ? 's' : ''}`
}
