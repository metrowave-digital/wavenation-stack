import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const cmsURL = process.env.NEXT_PUBLIC_CMS_URL

  if (!cmsURL) {
    return NextResponse.json(
      { error: 'CMS not available' },
      { status: 500 }
    )
  }

  const body = await req.json()

  if (!body?.pollId || !body?.option) {
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `${cmsURL}/api/polls/vote`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    const json = await res.json()

    return NextResponse.json(json, {
      status: res.status,
    })
  } catch {
    return NextResponse.json(
      { error: 'Vote failed' },
      { status: 500 }
    )
  }
}
