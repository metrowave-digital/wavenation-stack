import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/radioSchedule`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch radio schedule' },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
