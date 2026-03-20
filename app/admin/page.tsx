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

  async function handleLogin() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setLoggedIn(true)
      setStatus('')
    } else {
      setStatus('密码错误')
    }
  }

  async function handlePublish() {
    if (!title || !slug || !content) {
      setStatus('标题、slug 和正文不能为空')
      return
    }
    setStatus('发布中...')
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, summary, tags, content }),
    })
    if (res.ok) {
      setStatus('发布成功！文章将在几分钟后上线')
      setTitle('')
      setSlug('')
      setSummary('')
      setTags('')
      setContent('')
    } else {
      setStatus('发布失败，请重试')
    }
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-6">管理后台</h1>
        <input
          type="password"
          placeholder="输入管理密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="border border-gray-300 rounded px-4 py-2 w-80 mb-4"
        />
        <button onClick={handleLogin} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          登录
        </button>
        {status && <p className="text-red-500 mt-4">{status}</p>}
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">写文章</h1>
      <div className="flex flex-col gap-4">
        <input
          placeholder="文章标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          placeholder="slug（英文，用于网址，如 my-new-post）"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          placeholder="摘要（一句话描述）"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          placeholder="标签（用逗号分隔，如：投资,AI）"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <textarea
          placeholder="正文（支持 Markdown 语法）"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={16}
          className="border border-gray-300 rounded px-4 py-2 font-mono text-sm"
        />
        <button onClick={handlePublish} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 self-start">
          发布文章
        </button>
        {status && <p className="mt-4 text-gray-600">{status}</p>}
      </div>
    </main>
  )
}