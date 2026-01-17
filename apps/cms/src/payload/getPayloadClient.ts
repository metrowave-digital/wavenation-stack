import 'server-only'

import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '../payload.config'

let cachedPayload: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (cachedPayload) {
    return cachedPayload
  }

  const payload = await getPayload({ config })
  cachedPayload = payload
  return payload
}
