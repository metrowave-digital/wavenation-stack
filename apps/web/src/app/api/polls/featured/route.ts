import { NextResponse } from 'next/server'

export async function GET() {
  const cmsURL = process.env.NEXT_PUBLIC_CMS_URL

  if (!cmsURL) {
    return NextResponse.json(null, { status: 200 })
  }

  try {
    const res = await fetch(
      `${cmsURL}/api/polls/featured`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return NextResponse.json(null, { status: 200 })
    }

    const poll = await res.json()
    return NextResponse.json(poll)
  } catch {
    return NextResponse.json(null, { status: 200 })
  }
}
