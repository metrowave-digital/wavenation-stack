const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function getNextAirLabel(days: string[]): string {
  const todayIndex = new Date().getDay()

  // If today is included, just say Today
  if (days.includes(WEEKDAYS[todayIndex])) {
    return 'Today'
  }

  // Find next upcoming day
  for (let offset = 1; offset <= 7; offset++) {
    const day = WEEKDAYS[(todayIndex + offset) % 7]
    if (days.includes(day)) {
      return `Next: ${day}`
    }
  }

  return ''
}
