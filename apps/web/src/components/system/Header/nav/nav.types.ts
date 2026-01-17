import type { LucideIcon } from 'lucide-react'

export interface NavEditorialFeature {
  eyebrow?: string
  title: string
  description: string
  image?: string
  href: string
}

export interface NavItem {
  id: string
  label: string
  href?: string
  icon: LucideIcon
  description: string

  children?: {
    label: string
    href: string
    description?: string
  }[]

  editorial?: NavEditorialFeature[]
}
