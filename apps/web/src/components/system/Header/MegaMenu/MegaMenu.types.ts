export interface MegaMenuLink {
  label: string
  href: string
  description?: string
}

export interface MegaMenuItem {
  id: string
  label: string
  description?: string
  children?: MegaMenuLink[]
}

export interface FeaturedCard {
  title: string
  description?: string
  eyebrow?: string
  href: string
  image?: { url: string; alt: string } | null
}

export interface MegaMenuSubLink {
  label: string
  href: string
  description?: string
}

export interface MegaMenuLink {
  label: string
  href: string
  description?: string
  sublinks?: MegaMenuSubLink[]
}
