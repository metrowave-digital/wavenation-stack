// lib/charts/getFeaturedChart.ts

export async function getFeaturedChart() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/charts?where[status][equals]=published&limit=1&sort=-publishDate`,
    { cache: 'no-store' }
  )

  const json = await res.json()
  return json.docs?.[0] ?? null
}
