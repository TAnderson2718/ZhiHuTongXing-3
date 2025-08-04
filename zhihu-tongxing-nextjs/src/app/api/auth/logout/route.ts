import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // 删除会话cookie
    const cookieStore = cookies()
    cookieStore.delete('session')

    return NextResponse.json({
      success: true,
      message: '登出成功',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: '登出失败' },
      { status: 500 }
    )
  }
}
