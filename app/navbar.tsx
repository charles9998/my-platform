import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">Charles001</Link>
      <div className="flex gap-6">
        <Link href="/posts" className="text-gray-600 hover:text-black">文章</Link>
        <Link href="/about" className="text-gray-600 hover:text-black">关于</Link>
      </div>
    </nav>
  )
} 