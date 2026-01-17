import styles from './CenterRail.module.css'

interface Props {
  children: React.ReactNode
}

export function CenterRail({ children }: Props) {
  return (
    <main className={styles.centerRail}>
      {children}
    </main>
  )
}
