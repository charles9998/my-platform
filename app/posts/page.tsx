import Link from 'next/link'
import { getAllPosts } from '../lib'

export default function Posts() {
  const posts = getAllPosts()
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">所有文章</h1>
      {posts.map(post => (
        <article key={post.slug} className="mb-8 border-b border-gray-100 pb-6">
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-xl font-semibold hover:text-blue-600">{post.title}</h2>
          </Link>
          <p className="text-gray-400 text-sm mt-1">{post.date}</p>
          <p className="text-gray-600 mt-2">{post.summary}</p>
          <div className="flex gap-2 mt-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </main>
  )
}