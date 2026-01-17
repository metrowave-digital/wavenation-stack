/* ======================================================
   Time Utilities — Central Time is the Source of Truth
   WaveNation Media
====================================================== */

const CENTRAL_TIMEZONE = 'America/Chicago'

/* ======================================================
   Internal Helper
   Calculates timezone offset (DST-safe)
====================================================== */

function getTimeZoneOffsetMinutes(
  date: Date,
  timeZone: string
): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) =>
    Number(parts.find(p => p.type === type)?.value)

  const utcEquivalent = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  )

  return (utcEquivalent - date.getTime()) / 60000
}

/* ======================================================
   CENTRAL TIME PARSER (AUTHORITATIVE)
====================================================== */

export function parseHHmmCentral(
  time: string,
  baseDate = new Date()
): Date {
  const hours = Number(time.slice(0, 2))
  const minutes = Number(time.slice(2, 4))

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    throw new Error(`Invalid HHmm time string: "${time}"`)
  }

  // Get the Central calendar date for baseDate
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CENTRAL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(baseDate)

  const get = (type: string) =>
    Number(parts.find(p => p.type === type)?.value)

  const year = get('year')
  const month = get('month') - 1
  const day = get('day')

  // Guess UTC, then correct using the actual Central offset (DST-safe)
  const guessedUTC = Date.UTC(year, month, day, hours, minutes, 0)

  const offsetMinutes = getTimeZoneOffsetMinutes(
    new Date(guessedUTC),
    CENTRAL_TIMEZONE
  )

  return new Date(guessedUTC - offsetMinutes * 60000)
}

/* ======================================================
   BACKWARDS-COMPATIBLE API (USED ACROSS APP)
====================================================== */

/**
 * Parses HHmm as CENTRAL TIME.
 * Central Time is always the source of truth.
 */
export function parseHHmm(
  time: string,
  baseDate = new Date()
): Date {
  return parseHHmmCentral(time, baseDate)
}

/**
 * Formats HHmm for the VIEWER (local timezone)
 * Example:
 *   CST 8:30 AM → NY 9:30 AM → LA 6:30 AM
 */
export function formatHHmm(
  time: string,
  baseDate = new Date()
): string {
  const date = parseHHmmCentral(time, baseDate)

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/* ======================================================
   EXPLICIT FORMATTERS (OPTIONAL / RECOMMENDED)
====================================================== */

/**
 * Editorial / schedule label (Central Time)
 * Example: "8:30 AM CST"
 */
export function formatHHmmCentral(
  time: string,
  baseDate = new Date(),
  showZone = true
): string {
  const date = parseHHmmCentral(time, baseDate)

  return date.toLocaleTimeString('en-US', {
    timeZone: CENTRAL_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: showZone ? 'short' : undefined,
  })
}

/**
 * Explicit local-time formatter (for Date objects)
 */
export function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
