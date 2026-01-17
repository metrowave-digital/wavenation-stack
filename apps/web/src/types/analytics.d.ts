/* ======================================================
   Global Analytics Types — WaveNation
====================================================== */

export {}

declare global {
  interface Window {
    /* ----------------------------------
       Google Analytics (GA4)
    ---------------------------------- */
    gtag?: (
      command: 'event' | 'config' | 'js',
      eventName: string,
      params?: Record<string, unknown>
    ) => void

    /* ----------------------------------
       PostHog
    ---------------------------------- */
    posthog?: {
      capture: (
        event: string,
        properties?: Record<string, unknown>
      ) => void
    }

    /* ----------------------------------
       Segment Analytics
    ---------------------------------- */
    analytics?: {
      track: (
        event: string,
        properties?: Record<string, unknown>
      ) => void
    }
  }
}
