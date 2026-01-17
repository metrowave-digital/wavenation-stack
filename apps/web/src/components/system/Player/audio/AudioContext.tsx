'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { trackEvent } from '@/lib/analytics'

/* ======================================================
   STORAGE KEYS
====================================================== */

const LS_VOLUME = 'wn_player_volume'
const LS_MUTED = 'wn_player_muted'
const LS_WANTS_PLAY = 'wn_player_wants_play'

/* ======================================================
   NOW PLAYING (dynamic metadata)
====================================================== */

type NowPlayingPayload = {
  title?: string | null
  artist?: string | null
  album?: string | null
  artwork?: string | null | { url?: string | null }
  isLive?: boolean | null
}

function normalizeArtworkUrl(
  artwork: NowPlayingPayload['artwork']
): string | null {
  if (!artwork) return null
  if (typeof artwork === 'string') return artwork
  if (typeof artwork === 'object' && artwork?.url) return artwork.url
  return null
}

/* ======================================================
   SHOW / SCHEDULE METADATA (lockscreen)
   You can shape your endpoint however you want — this is flexible.
====================================================== */

type ScheduleNowPayload = {
  showTitle?: string | null
  hosts?: string | null
  startTime?: string | null // ISO or "HH:mm"
  endTime?: string | null   // ISO or "HH:mm"
  timezone?: string | null  // optional
  // optional extras
  description?: string | null
  artwork?: string | null
}

/* ======================================================
   TYPES
====================================================== */

export interface AudioState {
  playing: boolean
  isLive: boolean

  muted: boolean
  volume: number

  currentTime: number
  duration: number

  autoplayBlocked: boolean
  showUnmuteToast: boolean
  dismissUnmuteToast: () => void

  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
}

const AudioContext = createContext<AudioState | null>(null)

interface RadioScheduleItem {
  title?: string | null
  hosts?: string | null
  startTime?: string | null
  endTime?: string | null
  description?: string | null
  artwork?: string | { url?: string | null } | null
}

/* ======================================================
   SAFARI / iOS DETECT (no `any`)
====================================================== */

function detectAppleAutoplayConstraints() {
  if (typeof navigator === 'undefined') {
    return { isSafari: false, isIOS: false }
  }

  const ua = navigator.userAgent
  const nav = navigator as Navigator & { maxTouchPoints?: number }

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes('Mac') &&
      typeof nav.maxTouchPoints === 'number' &&
      nav.maxTouchPoints > 1)

  const isSafari =
    /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/.test(ua)

  return { isSafari, isIOS }
}

/* ======================================================
   MEDIA SESSION HELPERS
====================================================== */

function supportsMediaSession(): boolean {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator
}

function safeSetActionHandler(
  action: MediaSessionAction,
  handler: MediaSessionActionHandler | null
) {
  if (!supportsMediaSession()) return
  try {
    navigator.mediaSession.setActionHandler(action, handler)
  } catch {
    // Some browsers throw on unsupported actions
  }
}

function setMediaSessionMetadata(args: {
  title: string
  artist: string
  album: string
  artworkUrl: string | null
}) {
  if (!supportsMediaSession()) return

  const ms = navigator.mediaSession

  const fallback = '/images/player/artwork-512.png'
  const src = args.artworkUrl || fallback

  ms.metadata = new MediaMetadata({
    title: args.title,
    artist: args.artist,
    album: args.album,
    artwork: [
      { src, sizes: '96x96', type: 'image/png' },
      { src, sizes: '128x128', type: 'image/png' },
      { src, sizes: '192x192', type: 'image/png' },
      { src, sizes: '256x256', type: 'image/png' },
      { src, sizes: '512x512', type: 'image/png' },
    ],
  })
}

function setMediaSessionPlaybackState(state: 'none' | 'paused' | 'playing') {
  if (!supportsMediaSession()) return
  navigator.mediaSession.playbackState = state
}

/* ======================================================
   TIME LABEL HELPERS (schedule -> lockscreen)
====================================================== */

function isISODateString(v: string) {
  // very lightweight check
  return /\d{4}-\d{2}-\d{2}T/.test(v)
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatTimeForLockscreen(v?: string | null) {
  if (!v) return null

  // "HH:mm"
  if (/^\d{1,2}:\d{2}$/.test(v)) return v

  // ISO string
  if (isISODateString(v)) {
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return null
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  }

  return null
}

function buildShowLine(show: ScheduleNowPayload | null) {
  if (!show) return null
  const title = (show.showTitle || '').trim()
  const start = formatTimeForLockscreen(show.startTime)
  const end = formatTimeForLockscreen(show.endTime)

  const time =
    start && end ? `${start}–${end}` : start ? `from ${start}` : null

  if (title && time) return `${title} • ${time}`
  if (title) return title
  if (time) return time
  return null
}

/* ======================================================
   PROVIDER
====================================================== */

export function AudioProvider({
  streamUrl,
  children,
  nowPlayingUrl = '/api/now-playing',
  scheduleUrl = '/api/radioSchedule/now',
}: {
  streamUrl: string
  children: React.ReactNode
  nowPlayingUrl?: string
  /**
   * Endpoint that returns “currently airing show” info for lockscreen.
   * Default: /api/radioSchedule/now
   */
  scheduleUrl?: string
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRafRef = useRef<number | null>(null)

  // reconnect refs
  const reconnectTimerRef = useRef<number | null>(null)
  const reconnectAttemptRef = useRef(0)
  const lastSrcRef = useRef<string | null>(null)

  const { isSafari, isIOS } = useMemo(() => detectAppleAutoplayConstraints(), [])

  /* ======================================================
     PERSISTED STATE (lazy init)
  ====================================================== */

  const [volume, setVolumeState] = useState(() => {
    try {
      const v = localStorage.getItem(LS_VOLUME)
      if (v != null && !Number.isNaN(Number(v))) {
        return Math.min(1, Math.max(0, Number(v)))
      }
    } catch {}
    return 0.7
  })

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(LS_MUTED) === 'true'
    } catch {}
    return false
  })

  const wantsPlayRef = useRef<boolean>(
    (() => {
      try {
        const w = localStorage.getItem(LS_WANTS_PLAY)
        return w !== 'false'
      } catch {
        return true
      }
    })()
  )

  /* ======================================================
     RUNTIME STATE
  ====================================================== */

  const [playing, setPlaying] = useState(false)

  // NOTE: live streams often have no stable duration
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [showUnmuteToast, setShowUnmuteToast] = useState(false)

  // Dynamic Now Playing
  const [npTitle, setNpTitle] = useState<string>('WaveNation Live')
  const [npArtist, setNpArtist] = useState<string>('WaveNation FM')
  const [npAlbum, setNpAlbum] = useState<string>('Live Radio')
  const [npArtwork, setNpArtwork] = useState<string | null>(null)

  // Dynamic “Now Airing” show (schedule)
  const [nowShow, setNowShow] = useState<ScheduleNowPayload | null>(null)

  const isLive = true

  /* ======================================================
     PERSIST HELPERS
  ====================================================== */

  const persist = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  }, [])

  const setWantsPlay = useCallback(
    (next: boolean) => {
      wantsPlayRef.current = next
      persist(LS_WANTS_PLAY, String(next))
    },
    [persist]
  )

  /* ======================================================
     CROSS-TAB SYNC (volume/mute)
  ====================================================== */

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== localStorage) return
      if (e.key !== LS_VOLUME && e.key !== LS_MUTED) return

      if (e.key === LS_VOLUME) {
        const raw = e.newValue
        if (raw == null) return
        const n = Number(raw)
        if (Number.isNaN(n)) return
        const vv = Math.min(1, Math.max(0, n))

        setVolumeState(vv)

        const audio = audioRef.current
        if (audio) {
          audio.volume = vv
          if (vv === 0) audio.muted = true
        }
      }

      if (e.key === LS_MUTED) {
        const nextMuted = e.newValue === 'true'
        setMuted(nextMuted)

        const audio = audioRef.current
        if (audio) audio.muted = nextMuted
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /* ======================================================
     FADE UTIL
  ====================================================== */

  const stopFade = useCallback(() => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }, [])

  const fadeInTo = useCallback(
    (target: number, ms = 650) => {
      const audio = audioRef.current
      if (!audio) return

      stopFade()

      const from = 0
      const to = Math.min(1, Math.max(0, target))
      const start = performance.now()

      audio.volume = 0
      audio.muted = false

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms)
        const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
        audio.volume = from + (to - from) * eased

        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          fadeRafRef.current = null
          audio.volume = to
        }
      }

      fadeRafRef.current = requestAnimationFrame(tick)
    },
    [stopFade]
  )

  /* ======================================================
     RECONNECT (after stream drop)
  ====================================================== */

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current != null) {
      window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const computeBackoffMs = useCallback((attempt: number) => {
    // 0 -> 1000ms, 1 -> 2000ms, 2 -> 4000ms ... capped
    const base = 1000 * Math.pow(2, Math.min(6, attempt))
    const jitter = Math.floor(Math.random() * 500)
    return Math.min(30_000, base + jitter)
  }, [])

  const hardReloadStreamSrc = useCallback(
    (audio: HTMLAudioElement) => {
      const sep = streamUrl.includes('?') ? '&' : '?'
      const nextSrc = `${streamUrl}${sep}t=${Date.now()}`
      lastSrcRef.current = nextSrc
      try {
        audio.src = nextSrc
        audio.load()
      } catch {}
    },
    [streamUrl]
  )

  const scheduleReconnect = useCallback(
    (reason: string) => {
      if (!wantsPlayRef.current) return

      const audio = audioRef.current
      if (!audio) return

      clearReconnectTimer()

      const attempt = reconnectAttemptRef.current
      const wait = computeBackoffMs(attempt)

      reconnectAttemptRef.current = attempt + 1

      trackEvent('player_reconnect_scheduled', {
        reason,
        attempt: reconnectAttemptRef.current,
        waitMs: wait,
        placement: 'sticky_player',
        live: true,
      })

      reconnectTimerRef.current = window.setTimeout(() => {
        const a = audioRef.current
        if (!a) return

        if (!a.paused) {
          reconnectAttemptRef.current = 0
          clearReconnectTimer()
          return
        }

        hardReloadStreamSrc(a)

        a.play()
          .then(() => {
            reconnectAttemptRef.current = 0
            clearReconnectTimer()

            trackEvent('player_reconnect_success', {
              placement: 'sticky_player',
              live: true,
            })
          })
          .catch(() => {
            setAutoplayBlocked(true)
            setShowUnmuteToast(true)

            trackEvent('player_reconnect_failed', {
              placement: 'sticky_player',
              live: true,
            })

            scheduleReconnect('retry')
          })
      }, wait)
    },
    [clearReconnectTimer, computeBackoffMs, hardReloadStreamSrc]
  )

  /* ======================================================
     ENSURE AUDIO ELEMENT
  ====================================================== */

  const ensureAudio = useCallback(() => {
    const existing = audioRef.current
    if (existing) {
      if (existing.src && !existing.src.includes(streamUrl)) {
        hardReloadStreamSrc(existing)
      }
      return existing
    }

    const audio = new Audio(streamUrl)

    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    if ('playsInline' in audio) audio.playsInline = true

    audio.volume = volume
    audio.muted = muted

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMeta = () => setDuration(audio.duration || 0)
    const onPlaying = () => {
      setPlaying(true)
      setMediaSessionPlaybackState('playing')
      reconnectAttemptRef.current = 0
      clearReconnectTimer()
    }
    const onPause = () => {
      setPlaying(false)
      setMediaSessionPlaybackState('paused')
    }

    const onError = () => scheduleReconnect('error')
    const onStalled = () => scheduleReconnect('stalled')
    const onWaiting = () => scheduleReconnect('waiting')
    const onEnded = () => scheduleReconnect('ended')

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMeta)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)

    audio.addEventListener('error', onError)
    audio.addEventListener('stalled', onStalled)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('ended', onEnded)

    lastSrcRef.current = audio.src
    audioRef.current = audio
    return audio
  }, [
    clearReconnectTimer,
    hardReloadStreamSrc,
    muted,
    scheduleReconnect,
    streamUrl,
    volume,
  ])

  /* ======================================================
     ONLINE RECOVERY
  ====================================================== */

  useEffect(() => {
    const onOnline = () => {
      if (!wantsPlayRef.current) return
      const audio = audioRef.current
      if (!audio) return
      if (!audio.paused) return

      trackEvent('player_online_reconnect', {
        placement: 'sticky_player',
        live: true,
      })

      scheduleReconnect('online')
    }

    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [scheduleReconnect])

  /* ======================================================
     NOW PLAYING POLLER
  ====================================================== */

  useEffect(() => {
    let alive = true
    const ctrl = new AbortController()

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(nowPlayingUrl, {
          cache: 'no-store',
          signal: ctrl.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as NowPlayingPayload
        if (!alive) return

        const title = (data.title || '').trim()
        const artist = (data.artist || '').trim()
        const album = (data.album || '').trim()
        const artwork = normalizeArtworkUrl(data.artwork)

        if (title) setNpTitle(title)
        if (artist) setNpArtist(artist)
        if (album) setNpAlbum(album)
        if (artwork) setNpArtwork(artwork)
      } catch {
        // ignore; next tick
      }
    }

    fetchNowPlaying()
    const id = window.setInterval(fetchNowPlaying, 15_000)

    return () => {
      alive = false
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [nowPlayingUrl])

  /* ======================================================
     SCHEDULE / “NOW AIRING” POLLER (lockscreen show line)
  ====================================================== */

  useEffect(() => {
    const ctrl = new AbortController()

    const fetchNowShow = async () => {
  try {
    const res = await fetch(scheduleUrl, { cache: 'no-store' })
    if (!res.ok) return

    const json = await res.json()

    const now = new Date()

    const current =
  Array.isArray(json?.docs)
    ? (json.docs as RadioScheduleItem[]).find((show) => {
        if (!show.startTime || !show.endTime) return false

        const start = new Date(show.startTime)
        const end = new Date(show.endTime)

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
          return false
        }

        return now >= start && now <= end
      })
    : null

if (!current) return

    setNowShow({
      showTitle: current.title ?? 'WaveNation Live',
      hosts: current.hosts ?? '',
      startTime: current.startTime ?? null,
      endTime: current.endTime ?? null,
      artwork:
        typeof current.artwork === 'string'
          ? current.artwork
          : current.artwork?.url ?? null,
      description: current.description ?? null,
    })
  } catch {
    // silent fail; next poll will retry
  }
}

    fetchNowShow()
    const id = window.setInterval(fetchNowShow, 30_000)

    return () => {
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [scheduleUrl])

  /* ======================================================
     MEDIA SESSION METADATA (Now Playing + Show Schedule)
     - This is what updates the lockscreen display.
  ====================================================== */

  useEffect(() => {
    if (!supportsMediaSession()) return

    const showLine = buildShowLine(nowShow)
    const showHosts = (nowShow?.hosts || '').trim()

    // You can choose your own mapping, but this hits the goal:
    // - Title/Artist: Now Playing (song/segment)
    // - Album: Current show + time window (schedule)
    const title = (npTitle || 'WaveNation Live').trim()
    const artist = (npArtist || showHosts || 'WaveNation FM').trim()

    // Prefer schedule show line; fall back to npAlbum
    const album =
  playing
    ? `${showLine || 'Live Radio'} • LIVE`
    : `${showLine || 'Live Radio'} • Paused`

    // Prefer Now Playing artwork; fall back to schedule artwork; then default inside helper
    const artworkUrl =
      npArtwork || (nowShow?.artwork ? nowShow.artwork : null)

    setMediaSessionMetadata({
      title,
      artist,
      album,
      artworkUrl,
    })
  }, [npAlbum, npArtist, npArtwork, npTitle, nowShow, playing])

  /* ======================================================
     AUTOPLAY ON LOAD (Safari hardened)
  ====================================================== */

  useEffect(() => {
    if (!wantsPlayRef.current) return

    const audio = ensureAudio()
    if (!audio.paused) return

    const preferMuted = isSafari || isIOS

    const attempt = async () => {
      try {
        if (!preferMuted) {
          audio.muted = false
          audio.volume = muted ? 0 : volume
          // Always reload source when rejoining live
audio.currentTime = 0
          await audio.play()

          trackEvent('player_play', {
            source: 'autoplay_audible',
            placement: 'sticky_player',
            live: true,
          })
          return
        }

        throw new Error('force-muted')
      } catch {
        try {
          audio.muted = true
          audio.volume = 0

          setMuted(true)
          persist(LS_MUTED, 'true')

          // Always reload source when rejoining live
audio.currentTime = 0
          await audio.play()

          setAutoplayBlocked(true)
          setShowUnmuteToast(true)

          trackEvent('player_play', {
            source: 'autoplay_muted_fallback',
            placement: 'sticky_player',
            live: true,
          })
        } catch {
          setAutoplayBlocked(true)
          setShowUnmuteToast(true)

          trackEvent('player_play_failed', {
            placement: 'sticky_player',
            live: true,
          })
        }
      }
    }

    attempt()
  }, [ensureAudio, isIOS, isSafari, muted, persist, volume])

  /* ======================================================
     UNLOCK ON FIRST USER INTERACTION (when blocked)
  ====================================================== */

  useEffect(() => {
    if (!autoplayBlocked) return

    const unlock = () => {
      const audio = audioRef.current
      if (!audio) return

      setWantsPlay(true)

      audio
        .play()
        .then(() => {
          setAutoplayBlocked(false)
          setShowUnmuteToast(false)

          fadeInTo(volume, 650)

          trackEvent('player_play', {
            source: 'unlock_fadein',
            placement: 'sticky_player',
            live: true,
          })
        })
        .catch(() => {
          setAutoplayBlocked(true)
          setShowUnmuteToast(true)
        })
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [autoplayBlocked, fadeInTo, setWantsPlay, volume])

  /* ======================================================
     CONTROLS
  ====================================================== */

  const play = useCallback(async () => {
    const audio = ensureAudio()

    try {
      setWantsPlay(true)

      audio.muted = false
      setMuted(false)
      persist(LS_MUTED, 'false')

      // Always reload source when rejoining live
audio.currentTime = 0
      await audio.play()
      setAutoplayBlocked(false)
      setShowUnmuteToast(false)

      fadeInTo(volume, 320)

      trackEvent('player_play', {
        placement: 'sticky_player',
        live: true,
      })
    } catch {
      setAutoplayBlocked(true)
      setShowUnmuteToast(true)

      trackEvent('player_play_failed', {
        placement: 'sticky_player',
        live: true,
      })
    }
  }, [ensureAudio, fadeInTo, persist, setWantsPlay, volume])

  const pause = useCallback(() => {
  const audio = audioRef.current
  if (!audio) return

  stopFade()

  // Explicitly stop playback
  audio.pause()

  // LIVE STREAM FIX:
  // Reset timeline so resume does NOT imply continuation
  setCurrentTime(0)
  setDuration(0)

  setWantsPlay(false)

  setMediaSessionPlaybackState('paused')

  trackEvent('player_pause', {
    placement: 'sticky_player',
    live: true,
    behavior: 'leave_live',
  })
}, [setWantsPlay, stopFade])

  /* ======================================================
     MEDIA SESSION ACTION HANDLERS
     ✅ FIX: placed AFTER play/pause declarations
  ====================================================== */

  useEffect(() => {
    if (!supportsMediaSession()) return

    safeSetActionHandler('play', () => {
      trackEvent('media_session_play', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      void play()
    })

    safeSetActionHandler('pause', () => {
      trackEvent('media_session_pause', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      pause()
    })

    safeSetActionHandler('stop', () => {
      trackEvent('media_session_stop', {
        source: 'lockscreen',
        placement: 'sticky_player',
        live: true,
      })
      pause()
    })

    // Disable seeking for live radio
    safeSetActionHandler('seekto', null)
    safeSetActionHandler('seekbackward', null)
    safeSetActionHandler('seekforward', null)

    return () => {
      safeSetActionHandler('play', null)
      safeSetActionHandler('pause', null)
      safeSetActionHandler('stop', null)
    }
  }, [pause, play])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback(
    (v: number) => {
      const vv = Math.min(1, Math.max(0, v))
      const audio = ensureAudio()

      stopFade()

      audio.volume = vv
      audio.muted = vv === 0

      setVolumeState(vv)
      setMuted(vv === 0)

      persist(LS_VOLUME, String(vv))
      persist(LS_MUTED, String(vv === 0))

      trackEvent('volume_change', {
        volume: Math.round(vv * 100),
        placement: 'sticky_player',
      })
    },
    [ensureAudio, persist, stopFade]
  )

  const toggleMute = useCallback(() => {
    const audio = ensureAudio()
    stopFade()

    const nextMuted = !audio.muted
    audio.muted = nextMuted

    setMuted(nextMuted)
    persist(LS_MUTED, String(nextMuted))

    if (!nextMuted && playing) {
      fadeInTo(volume, 320)
    }

    trackEvent('mute_toggle', {
      muted: nextMuted,
      placement: 'sticky_player',
    })
  }, [ensureAudio, fadeInTo, persist, playing, stopFade, volume])

  const dismissUnmuteToast = useCallback(() => {
    setShowUnmuteToast(false)
  }, [])

  /* ======================================================
     KEEP ELEMENT IN SYNC WITH STATE
  ====================================================== */

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [muted, volume])

  /* ======================================================
     CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      stopFade()
      clearReconnectTimer()

      const audio = audioRef.current
      if (!audio) return

      try {
        audio.pause()
      } catch {}

      audio.src = ''
      audioRef.current = null
    }
  }, [clearReconnectTimer, stopFade])

  /* ======================================================
     CONTEXT VALUE
  ====================================================== */

  const value = useMemo<AudioState>(
    () => ({
      playing,
      isLive,

      muted,
      volume,

      currentTime,
      duration,

      autoplayBlocked,
      showUnmuteToast,
      dismissUnmuteToast,

      play,
      pause,
      seek,
      setVolume,
      toggleMute,
    }),
    [
      playing,
      isLive,
      muted,
      volume,
      currentTime,
      duration,
      autoplayBlocked,
      showUnmuteToast,
      dismissUnmuteToast,
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
    ]
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

/* ======================================================
   HOOK
====================================================== */

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
