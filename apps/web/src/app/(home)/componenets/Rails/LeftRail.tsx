import styles from './LeftRail.module.css'

interface Props {
  children: React.ReactNode
}

export function LeftRail({ children }: Props) {
  return (
    <aside className={styles.leftRail}>
      {children}
    </aside>
  )
}
