import styles from './page.module.css'
import HomeHero from './(home)/componenets/HomeHero/HomeHero.server'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Homepage Hero System */}
        <HomeHero />
      </main>
    </div>
  )
}
