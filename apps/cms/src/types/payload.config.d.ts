declare module '@payload-config' {
  import type { SanitizedConfig } from 'payload'

  // Payload's Next integration expects the config in layouts/admin
  // as a SanitizedConfig (often provided as a Promise).
  const config: Promise<SanitizedConfig>

  export default config
}
