import { NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const chartKey = searchParams.get('chartKey')

  if (!chartKey) {
    return NextResponse.json([], { status: 400 })
  }

  const res = await fetch(
    `${CMS_URL}/api/charts?where[chartKey][equals]=${chartKey}&where[status][equals]=published&limit=50&sort=-week`,
    { cache: 'no-store' },
  )

  if (!res.ok) return NextResponse.json([])

  const json = await res.json()
  return NextResponse.json(json.docs ?? [])
}
