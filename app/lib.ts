import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDir = path.join(process.cwd(), 'content')

export function getAllPosts() {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
  const posts = files.map(filename => {
    const slug = filename.replace('.md', '')
    const filePath = path.join(contentDir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags || [],
    }
  })
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const processed = await remark().use(html).process(content)
  return {
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    content: processed.toString(),
  }
}