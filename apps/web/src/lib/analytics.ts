'use client'

/* ======================================================
   Base Types
====================================================== */

type AnalyticsPayload = Record<string, unknown>

export type AnalyticsEvent =
  | 'page_view'
  | 'navigation_click'
  | 'content_impression'
  | 'content_click'
  | 'hero_interaction'
  | 'hero_click'
  | 'carousel_interaction'
  | 'news_ticker_impression'
  | 'news_ticker_breaking_active'
  | 'news_ticker_click'
  | 'player_play'
  | 'player_pause'
  | 'volume_change'
  | 'search_perform'
  | 'poll_vote'
  | 'player'
  | 'player_reconnect_scheduled'
  | 'player_reconnect_failed'
  | 'player_reconnect_success'
  | 'player_online_reconnect'
  | 'media_session_play'
  | 'media_session_pause'
  | 'media_session_seek'
  | 'media_session_stop'
  | 'mute_toggle'
  | 'player_play_failed'
  | 'player_expand'
  | 'player_collapse'

/* ======================================================
   Core Dispatcher (GA4 + PostHog)
====================================================== */

export function trackEvent(
  event: AnalyticsEvent,
  payload?: AnalyticsPayload
) {
  if (typeof window === 'undefined') return

  /* -------- GA4 -------- */
  if (
    typeof window.gtag === 'function' &&
    process.env.NEXT_PUBLIC_GA4_ID
  ) {
    window.gtag('event', event, payload)
  }

  /* -------- PostHog -------- */
  if (typeof window.posthog?.capture === 'function') {
    window.posthog.capture(event, payload)
  }
}

/* ======================================================
   Page View
====================================================== */

export function trackPageView(path: string) {
  trackEvent('page_view', {
    path,
  })
}

/* ======================================================
   Hero Analytics
====================================================== */

export function trackHeroImpression(payload: {
  placement: string
  id?: number | string
  position?: number
}) {
  trackEvent('content_impression', payload)
}

export function trackHeroClick(payload: {
  placement: string
  id?: number | string
  position?: number
}) {
  trackEvent('hero_click', payload)
}

/* ======================================================
   Poll Analytics
====================================================== */

export function trackPollVote(payload: {
  pollId: number
  option: string
}) {
  trackEvent('poll_vote', payload)
}

/* ======================================================
   News Ticker Analytics
====================================================== */

export function trackNewsTickerImpression(payload: {
  itemCount: number
  hasBreaking: boolean
}) {
  trackEvent('news_ticker_impression', payload)
}

export function trackNewsTickerBreaking(payload: {
  id: string
}) {
  trackEvent('news_ticker_breaking_active', payload)
}

export function trackNewsTickerClick(payload: {
  id: string
  breaking?: boolean
  external?: boolean
}) {
  trackEvent('news_ticker_click', payload)
}

/* ======================================================
   Global Declarations
====================================================== */

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: Record<string, unknown>
    ) => void
    posthog?: {
      capture: (
        event: string,
        properties?: Record<string, unknown>
      ) => void
    }
  }
}
