import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Test cookie set successfully'
  })

  // 设置一个简单的测试Cookie，不使用Secure标志
  response.cookies.set('test-cookie', 'test-value', {
    httpOnly: false, // 设置为false以便在浏览器中查看
    secure: false,   // 强制设置为false
    sameSite: 'lax',
    maxAge: 3600,    // 1小时
    path: '/',
  })

  console.log('Test cookie set with options:', {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })

  return response
}
