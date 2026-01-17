import styles from './Footer.module.css'

import { FooterBrand } from './FooterBrand/FooterBrand'
import { FooterNav } from './FooterNav/FooterNav'
import { FooterContact } from './FooterContact/FooterContact'
import { FooterSocial } from './FooterSocial/FooterSocial'
import { FooterLegal } from './FooterLegal/FooterLegal'
import { MobileFooter } from './MobileFooter/MobileFooter'

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.grid}>
        <FooterBrand />
        <FooterNav />
        <FooterContact />
        <FooterSocial />
      </div>

      <FooterLegal />
      <MobileFooter />
    </footer>
  )
}
