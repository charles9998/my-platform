'use client'

import { useState } from 'react'

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  async function handleLogin() {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) { setLoggedIn(true); setStatus('') } else { setStatus('密码错误') }
  }

  async function handlePublish() {
    if (!title || !slug || !content) { setStatus('标题、slug 和正文不能为空'); return }
    setStatus('发布中...')
    const res = await fetch('/api/posts/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, slug, summary, tags, content }) })
    if (res.ok) { setStatus('发布成功！'); setTitle(''); setSlug(''); setSummary(''); setTags(''); setContent('') } else { setStatus('发布失败') }
  }

  async function handleAI(action: string) {
    if (!content) { setStatus('请先输入正文'); return }
    setAiLoading(true)
    setStatus(action === 'summary' ? 'AI 生成中...' : 'AI 润色中...')
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, action }) })
      const data = await res.json()
      if (action === 'summary') { const p = JSON.parse(data.result); setSummary(p.summary); setTags(p.tags.join(', ')); setStatus('已生成') }
      else { setContent(data.result); setStatus('润色完成') }
    } catch { setStatus('AI 请求失败') }
    setAiLoading(false)
  }if (!loggedIn) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-6">管理后台</h1>
        <input type="password" placeholder="输入管理密码" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="border border-gray-300 rounded px-4 py-2 w-80 mb-4" />
        <button onClick={handleLogin} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">登录</button>
        {status && <p className="text-red-500 mt-4">{status}</p>}
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">写文章</h1>
      <div className="flex flex-col gap-4">
        <input placeholder="文章标题" value={title} onChange={e => setTitle(e.target.value)} className="border border-gray-300 rounded px-4 py-2" />
        <input placeholder="slug（英文，用于网址）" value={slug} onChange={e => setSlug(e.target.value)} className="border border-gray-300 rounded px-4 py-2" />
        <input placeholder="摘要（或用AI生成）" value={summary} onChange={e => setSummary(e.target.value)} className="border border-gray-300 rounded px-4 py-2" />
        <input placeholder="标签（逗号分隔，或用AI生成）" value={tags} onChange={e => setTags(e.target.value)} className="border border-gray-300 rounded px-4 py-2" />
        <textarea placeholder="正文（Markdown）" value={content} onChange={e => setContent(e.target.value)} rows={16} className="border border-gray-300 rounded px-4 py-2 font-mono text-sm" />
        <div className="flex gap-3">
          <button onClick={() => handleAI('summary')} disabled={aiLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">AI 生成摘要和标签</button>
          <button onClick={() => handleAI('polish')} disabled={aiLoading} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400">AI 润色文章</button>
          <button onClick={handlePublish} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">发布文章</button>
        </div>
        {status && <p className="mt-4 text-gray-600">{status}</p>}
      </div>
    </main>
  )
}