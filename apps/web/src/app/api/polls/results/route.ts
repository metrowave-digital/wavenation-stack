import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pollId = searchParams.get('pollId')

  // 🚫 Never call CMS without a pollId
  if (!pollId) {
    return NextResponse.json({}, { status: 200 })
  }

  const cmsURL = process.env.NEXT_PUBLIC_CMS_URL

  if (!cmsURL) {
    return NextResponse.json({}, { status: 200 })
  }

  try {
    const res = await fetch(
      `${cmsURL}/api/polls/results?pollId=${pollId}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return NextResponse.json({}, { status: 200 })
    }

    const results = await res.json()
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({}, { status: 200 })
  }
}
