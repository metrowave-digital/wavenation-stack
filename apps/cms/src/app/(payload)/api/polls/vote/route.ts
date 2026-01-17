import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload/getPayloadClient'

export async function POST(req: Request) {
  const body = await req.json()

  const pollId = Number(body.pollId)
  const option = body.option

  if (!pollId || !option) {
    return NextResponse.json(
      { error: 'Invalid vote payload' },
      { status: 400 }
    )
  }

  const payload = await getPayloadClient()

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const ipHash = Buffer.from(ip).toString('base64')

  try {
    await payload.create({
      collection: 'pollVotes',
      data: {
        poll: pollId,
        option,
        ipHash,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Already voted' },
      { status: 409 }
    )
  }

  return NextResponse.json({ success: true })
}
