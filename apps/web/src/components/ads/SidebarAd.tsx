export function SidebarAd() {
  return (
    <div>
      <span
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          opacity: 0.5,
          display: 'block',
          marginBottom: 8,
        }}
      >
        Sponsored
      </span>

      <div
        style={{
          height: 250,
          borderRadius: 12,
          background:
            'linear-gradient(135deg, rgba(0,170,255,0.2), rgba(168,85,247,0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Ad Placement
      </div>
    </div>
  )
}
