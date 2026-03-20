import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD || 'charles001'

  if (password === adminPassword) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: '密码错误' }, { status: 401 })
}