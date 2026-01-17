'use client'

import styles from './HomeHero.module.css'

import { LeftRail } from '../Rails/LeftRail'
import { CenterRail } from '../Rails/CenterRail'
import { RightRail } from '../Rails/RightRail'

import { ChartInsightCards } from '../HeroCharts/ChartInsightCards'
import { SpotlightArticles } from '../SpotlightArticles/SpotlightArticles'
import { HeroSlider } from '../HeroSlider/HeroSlider'
import { HeroFeaturedArtist } from '../HeroFeaturedArtist/HeroFeaturedArtist'
import { HeroUpNext } from '../HeroUpNext/HeroUpNext'
import { HeroPoll } from '../HeroPoll/HeroPoll'

/* ======================================================
   Types
====================================================== */

type ChartEntry = {
  rank: number
  movement?: 'up' | 'down' | 'same' | 'new'
  trackTitle: string
  artist: string
}

type Chart = {
  id: number | string
  title: string
  chartKey:
    | 'hitlist'
    | 'southern-soul'
    | 'gospel'
    | 'rnb-soul'
    | 'hip-hop'
  week: string
  entries: ChartEntry[]
}

interface Props {
  charts: Chart[]
}

/* ======================================================
   Component
====================================================== */

export default function HomeHeroClient({ charts }: Props) {
  return (
    <section
      className={styles.root}
      aria-label="Homepage hero"
    >
      <div className={styles.heroGrid}>
        {/* ================= LEFT RAIL ================= */}
        <LeftRail>
          {charts.length > 0 && (
            <ChartInsightCards charts={charts} />
          )}
        </LeftRail>

        {/* ================= CENTER RAIL ================= */}
        <CenterRail>
          <HeroSlider />
          <SpotlightArticles />
        </CenterRail>

        {/* ================= RIGHT RAIL ================= */}
        <RightRail>
          <HeroFeaturedArtist />
          <HeroUpNext />
          <HeroPoll />
        </RightRail>
      </div>
    </section>
  )
}
