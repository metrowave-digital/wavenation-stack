import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../../payload/getPayloadClient'

export async function GET() {
  const payload = await getPayloadClient()

  const now = new Date()

  const polls = await payload.find({
    collection: 'polls',
    limit: 1,
    where: {
      status: { equals: 'live' },
      featureOnHomepage: { equals: true },
      or: [
        { startDate: { exists: false } },
        { startDate: { less_than_equal: now } },
      ],
    },
    sort: '-updatedAt',
  })

  return NextResponse.json(polls.docs[0] ?? null)
}
