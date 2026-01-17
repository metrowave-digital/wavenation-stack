// app/charts/index/page.tsx

import { EditorialHero } from '@/components/editorial/EditorialHero'
import ChartsArchiveClient from './ChartsArchiveClient'
import { getHomepageCharts } from '@/app/lib/charts/getHomepageCharts'
import type { Chart } from '@/app/lib/types/chart'

export const metadata = {
  title: 'Charts Archive | WaveNation',
  description:
    'Explore WaveNation charts by genre, year, month, and week.',
}

export default async function ChartsIndexPage() {
  const charts: Chart[] = await getHomepageCharts()

  return (
    <main className="page">
      <EditorialHero
        variant="charts"
        eyebrow="Charts & Culture"
        title="Charts Archive"
        lede="Browse every WaveNation chart by genre and week. Updated weekly and curated by editors."
        pills={[
          'All genres',
          'Weekly snapshots',
          'Editorially curated',
        ]}
      />

      <ChartsArchiveClient charts={charts} />
    </main>
  )
}
