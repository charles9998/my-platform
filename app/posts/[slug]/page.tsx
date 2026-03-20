import { getPostBySlug, getAllPosts } from '../../lib'
import Giscus from '../../giscus'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-2">{post.date}</p>
      <div className="flex gap-2 mb-8">
        {post.tags.map((tag: string) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
      <article className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      <Giscus />
    </main>
  )
}