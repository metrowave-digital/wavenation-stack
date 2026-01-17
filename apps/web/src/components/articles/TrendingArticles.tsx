import Link from 'next/link'

interface TrendingArticle {
  id: string
  title: string
  slug: string
}

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3000'

export async function TrendingArticles() {
  const res = await fetch(
    `${CMS_URL}/api/articles?where[_status][equals]=published&limit=5&sort=-publishDate`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null

  const data = (await res.json()) as {
    docs?: TrendingArticle[]
  }

  const articles = data.docs ?? []

  if (!articles.length) return null

  return (
    <div>
      <h4
        style={{
          fontSize: 14,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: 0.7,
          marginBottom: 12,
        }}
      >
        Trending
      </h4>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 10,
        }}
      >
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              style={{
                fontSize: 14,
                lineHeight: 1.4,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
