import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Simple login request:', body)

    // 简单验证
    if (body.email === 'admin@zhihutongxing.com' && body.password === 'Admin@2025!Secure#') {
      const response = NextResponse.json({
        success: true,
        message: '登录成功'
      })

      // 设置一个非常简单的Cookie
      response.cookies.set('simple-session', 'admin-logged-in', {
        httpOnly: false,  // 设置为false以便JavaScript可以访问
        secure: false,    // 强制设置为false用于HTTP
        sameSite: 'lax',
        maxAge: 3600,     // 1小时
        path: '/',
      })

      console.log('Simple cookie set successfully')
      return response
    } else {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Simple login error:', error)
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    )
  }
}
