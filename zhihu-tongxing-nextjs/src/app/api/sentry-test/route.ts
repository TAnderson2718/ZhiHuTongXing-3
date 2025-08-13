import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Sentry 测试端点
 * 用于验证错误监控是否正常工作
 * 仅在开发环境或测试环境中可用
 */
export async function GET(request: NextRequest) {
  // 生产环境禁用此端点
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is not available in production'
    }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const testType = searchParams.get('type') || 'error'

  try {
    switch (testType) {
      case 'error':
        // 测试错误捕获
        throw new Error('This is a test error for Sentry monitoring')

      case 'warning':
        // 测试警告消息
        Sentry.captureMessage('This is a test warning message', 'warning')
        return NextResponse.json({
          message: 'Warning message sent to Sentry',
          type: 'warning'
        })

      case 'info':
        // 测试信息消息
        Sentry.captureMessage('This is a test info message', 'info')
        return NextResponse.json({
          message: 'Info message sent to Sentry',
          type: 'info'
        })

      case 'breadcrumb':
        // 测试面包屑
        Sentry.addBreadcrumb({
          message: 'Test breadcrumb added',
          category: 'test',
          level: 'info',
          data: {
            timestamp: new Date().toISOString(),
            testData: 'This is test data'
          }
        })
        
        // 然后触发一个错误来查看面包屑
        throw new Error('Test error with breadcrumb context')

      case 'user':
        // 测试用户上下文
        Sentry.setUser({
          id: 'test-user-123',
          email: 'test@example.com',
          username: 'testuser'
        })
        
        Sentry.captureMessage('Test message with user context', 'info')
        return NextResponse.json({
          message: 'Message with user context sent to Sentry',
          type: 'user'
        })

      case 'tag':
        // 测试标签
        Sentry.setTag('test-tag', 'test-value')
        Sentry.setTag('api-endpoint', '/api/sentry-test')
        
        Sentry.captureMessage('Test message with tags', 'info')
        return NextResponse.json({
          message: 'Message with tags sent to Sentry',
          type: 'tag'
        })

      case 'performance':
        // 测试性能监控
        const transaction = Sentry.startTransaction({
          name: 'test-transaction',
          op: 'test'
        })
        
        // 模拟一些工作
        const span = transaction.startChild({
          op: 'test-operation',
          description: 'Test operation for performance monitoring'
        })
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        span.finish()
        transaction.finish()
        
        return NextResponse.json({
          message: 'Performance transaction sent to Sentry',
          type: 'performance'
        })

      default:
        return NextResponse.json({
          error: 'Invalid test type',
          availableTypes: ['error', 'warning', 'info', 'breadcrumb', 'user', 'tag', 'performance']
        }, { status: 400 })
    }

  } catch (error) {
    // 这里的错误会被 Sentry 自动捕获
    Sentry.captureException(error)
    
    return NextResponse.json({
      message: 'Test error sent to Sentry',
      error: error instanceof Error ? error.message : 'Unknown error',
      type: testType
    }, { status: 500 })
  }
}

/**
 * 客户端错误测试端点
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'This endpoint is not available in production'
    }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { errorType, message, stack, userAgent } = body

    // 记录客户端错误到 Sentry
    Sentry.withScope((scope) => {
      scope.setTag('source', 'client')
      scope.setTag('errorType', errorType)
      scope.setContext('client', {
        userAgent,
        timestamp: new Date().toISOString()
      })

      if (stack) {
        scope.setContext('stack', { stack })
      }

      Sentry.captureMessage(`Client Error: ${message}`, 'error')
    })

    return NextResponse.json({
      message: 'Client error logged to Sentry',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    Sentry.captureException(error)
    
    return NextResponse.json({
      error: 'Failed to log client error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
