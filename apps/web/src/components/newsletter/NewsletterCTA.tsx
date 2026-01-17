'use client'

export function NewsletterCta() {
  return (
    <>
      <h3>Stay in the Wave 🌊</h3>
      <p>
        Get the latest culture drops, exclusive interviews,
        playlists, and WaveNation updates delivered straight
        to your inbox.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          // Hook this into Resend / API later
        }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          required
        />
        <button type="submit">
          Subscribe
        </button>
      </form>
    </>
  )
}
