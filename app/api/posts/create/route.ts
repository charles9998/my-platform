import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { title, slug, summary, tags, content } = await request.json()
    const today = new Date().toISOString().split('T')[0]
    const tagList = tags ? tags.split(',').map((t: string) => `"${t.trim()}"`) : []

    const markdown = `---
title: "${title}"
date: "${today}"
summary: "${summary}"
tags: [${tagList.join(', ')}]
---

${content}
`

    const token = process.env.GITHUB_TOKEN
    const repo = 'charles9998/my-platform'
    const path = `content/${slug}.md`
    const base64Content = Buffer.from(markdown).toString('base64')

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `新文章：${title}`,
        content: base64Content,
      }),
    })

    if (res.ok) {
      return NextResponse.json({ success: true })
    } else {
      const err = await res.json()
      console.error('GitHub API Error:', err)
      return NextResponse.json({ error: '发布失败' }, { status: 500 })
    }
  } catch (error) {
    console.error('Create Error:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}