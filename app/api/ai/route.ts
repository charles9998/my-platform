import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const { content, action } = await request.json()

    let prompt = ''
    if (action === 'summary') {
      prompt = `请为以下文章生成一句话中文摘要（不超过50字）和3-5个中文标签。严格按照以下JSON格式返回，不要返回其他内容：{"summary": "摘要内容", "tags": ["标签1", "标签2"]}

文章内容：${content}`
    } else if (action === 'polish') {
      prompt = `请润色以下中文文章，保持原意不变，直接返回润色后的内容：${content}`
    }

    const result = await model.generateContent(prompt)
    const raw = result.response.text()
const text = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    console.log('AI response:', text)
    return NextResponse.json({ result: text })
  } catch (error: unknown) {
    console.error('AI Error:', error)
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}