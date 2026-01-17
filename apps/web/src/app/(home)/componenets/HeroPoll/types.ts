export type PollOption = {
  label: string
  slug: string
}

export type Poll = {
  id: number
  question: string
  description?: string

  options: PollOption[]

  // status / visibility
  status?: 'draft' | 'live' | 'closed'
  featureOnHomepage?: boolean

  // scheduling
  startDate?: string | null
  endDate?: string | null

  // metadata
  createdAt?: string
  updatedAt?: string
}


export type PollResults = Record<string, number>
