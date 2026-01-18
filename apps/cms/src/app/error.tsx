'use client'

export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div style={{ padding: 32 }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
