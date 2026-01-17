// apps/cms/src/lib/hashIP.ts
import crypto from 'crypto'

export function hashIP(ip: string) {
  return crypto
    .createHash('sha256')
    .update(ip + process.env.POLL_SALT)
    .digest('hex')
}
