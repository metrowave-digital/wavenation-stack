'use client'

type Article = {
  id: string
  title?: string
  excerpt?: string
  slug: string
}

function decode(text?: string | null) {
  if (!text) return ''
  return text
    .replace(/â€™/g, '’')
    .replace(/Ã©/g, 'é')
}

export function ArticleRow({ articles }: { articles: Article[] }) {
  if (!articles?.length) return null

  return (
    <section aria-label="Latest articles">
      <div className="article-grid">
        {articles.map(article => (
          <article key={article.id}>
            <h3>{decode(article.title)}</h3>

            {article.excerpt && (
              <p>{decode(article.excerpt)}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
