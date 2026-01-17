import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload/getPayloadClient'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pollId = Number(searchParams.get('pollId'))

  if (!pollId || Number.isNaN(pollId)) {
    return NextResponse.json(
      { error: 'Valid pollId required' },
      { status: 400 }
    )
  }

  const payload = await getPayloadClient()

  const votes = await payload.find({
    collection: 'pollVotes',
    where: {
      poll: { equals: pollId },
    },
    limit: 2000,
  })

  const results: Record<string, number> = {}

  for (const vote of votes.docs) {
    if (!vote.option) continue
    results[vote.option] = (results[vote.option] || 0) + 1
  }

  return NextResponse.json(results)
}
