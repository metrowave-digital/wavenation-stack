'use client'

import styles from './Header.module.css'
import { HeaderProvider } from './Header.context'

import { BrandBar } from './BrandBar/BrandBar'
import { MainNav } from './MainNav/MainNav'
import { SubNav } from './SubNav/SubNav'
import { HeaderActions } from './HeaderActions/HeaderActions'
import { MegaMenu } from './MegaMenu/MegaMenu'
import { MobileMenu } from './MobileMenu/MobileMenu'
import { SearchPopup } from './Popups/SearchPopup'
import { ProfilePopup } from './Popups/ProfilePopup'

export function Header() {
  return (
    <HeaderProvider>
      <header className={styles.root} role="banner">
        {/* Top Row */}
        <div className={styles.bar}>
          <BrandBar />
          <MainNav />
          <HeaderActions />
        </div>

        {/* Contextual Sub Navigation */}
        <SubNav />
      </header>

      {/* Overlays */}
      <MegaMenu />
      <MobileMenu />
      <SearchPopup />
      <ProfilePopup />
    </HeaderProvider>
  )
}
