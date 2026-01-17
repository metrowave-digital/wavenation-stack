import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../..//payload.config'

export async function GET() {
  const payload = await getPayload({ config })

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
