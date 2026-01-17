import { getHomepageCharts } from '../../../lib/charts/getHomepageCharts'
import HomeHeroClient from './HomeHero.client'

export default async function HomeHero() {
  const charts = await getHomepageCharts()

  return <HomeHeroClient charts={charts} />
}
