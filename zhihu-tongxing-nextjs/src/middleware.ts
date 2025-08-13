import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export function middleware(request: NextRequest) {
  // 创建响应
  const response = NextResponse.next()

  // 添加安全头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // 添加请求追踪
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)

  // 记录请求到 Sentry
  Sentry.addBreadcrumb({
    message: `${request.method} ${request.nextUrl.pathname}`,
    category: 'navigation',
    level: 'info',
    data: {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      requestId,
    },
  })

  // 设置用户上下文（如果有认证信息）
  const sessionCookie = request.cookies.get('session')
  if (sessionCookie) {
    Sentry.setTag('authenticated', 'true')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
