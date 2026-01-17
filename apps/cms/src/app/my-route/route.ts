import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../payload/getPayloadClient'

export async function GET() {
  const payload = await getPayloadClient()

  return NextResponse.json({
    message: 'This is an example of a custom route.',
  })
}
