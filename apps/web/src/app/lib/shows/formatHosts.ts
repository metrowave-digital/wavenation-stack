type Host = {
  displayName: string
}

export function formatHosts(
  hosts: Host[] | undefined,
  max = 3
): string | null {
  if (!hosts || hosts.length === 0) return null

  const names = hosts.map(h => h.displayName)

  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`

  if (names.length <= max) {
    return `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`
  }

  return `${names.slice(0, max).join(', ')} +${names.length - max}`
}
