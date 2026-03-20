import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
    const contentDir = path.join(process.cwd(), 'content')
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true })
    fs.writeFileSync(path.join(contentDir, `${slug}.md`), markdown, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}