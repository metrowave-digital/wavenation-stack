import {
  Compass,
  Radio,
  Newspaper,
  Tv,
  ShoppingBag,
  Users,
} from 'lucide-react'

export const MAIN_NAV = [
  {
    id: 'discover',
    label: 'Discover',
    icon: Compass,
    description:
      'Explore music, culture, creators, playlists, and what’s moving the culture forward.',
    children: [
      { label: 'Playlists', href: '/music/playlists' },
      { label: 'Creators', href: '/creators' },
      { label: 'Trending', href: '/discover/trending' },
      { label: 'Events', href: '/events' },
    ],
    editorial: [
      {
        eyebrow: 'Featured',
        title: 'FreshWave Indie',
        description:
          'Emerging artists shaping the next sound of R&B and Southern Soul.',
        href: '/playlists/freshwave-indie',
      },
    ],
  },

  {
    id: 'onair',
    label: 'On-Air',
    icon: Radio,
    description:
      'Live radio, scheduled shows, hosts, and what’s playing now.',
    children: [
      { label: 'Live Stream', href: '/radio' },
      { label: 'Show Schedule', href: '/radio/schedule' },
      { label: 'Hosts', href: '/radio/hosts' },
    ],
  },

  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    description:
      'Culture-driven journalism covering music, community, and the Black experience.',
    children: [
      { label: 'Music News', href: '/news/music' },
      { label: 'Culture', href: '/news/culture' },
      { label: 'Opinions', href: '/news/opinion' },
    ],
  },

  {
    id: 'watch',
    label: 'Watch',
    icon: Tv,
    description:
      'Original series, interviews, documentaries, and live TV.',
    children: [
      { label: 'Live TV', href: '/tv/live' },
      { label: 'Series', href: '/tv/series' },
      { label: 'Creator Spotlights', href: '/tv/creators' },
    ],
  },

  {
    id: 'merch',
    label: 'Merch',
    icon: ShoppingBag,
    description:
      'WaveNation apparel, show merch, and limited edition drops.',
    children: [
      { label: 'Shop All', href: '/shop' },
      { label: 'Limited Drops', href: '/shop/drops' },
    ],
  },

  {
    id: 'connect',
    label: 'Connect',
    icon: Users,
    description:
      'Community, creators, submissions, and partnerships.',
    children: [
      { label: 'Creator Hub', href: '/creators/join' },
      { label: 'Submit Music', href: '/submit' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]
