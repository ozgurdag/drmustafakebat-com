import { getRecentArticles } from '@/lib/articles'

export default function Home() {
  const articles = getRecentArticles()
  return <main><h1>Articles: {articles.length}</h1></main>
}
