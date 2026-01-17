import styles from './RightRail.module.css'

interface Props {
  children: React.ReactNode
}

export function RightRail({ children }: Props) {
  return (
    <aside className={styles.rightRail}>
      {children}
    </aside>
  )
}
