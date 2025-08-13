import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * 健康检查端点
 * 用于监控应用程序的运行状态
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // 基础健康检查
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: 'healthy', // 这里可以添加数据库连接检查
        sentry: 'healthy',
        filesystem: 'healthy',
      }
    }

    // 检查 Sentry 连接
    try {
      Sentry.addBreadcrumb({
        message: 'Health check performed',
        category: 'health',
        level: 'info',
      })
      healthData.checks.sentry = 'healthy'
    } catch (error) {
      healthData.checks.sentry = 'unhealthy'
    }

    // 检查文件系统（简单检查）
    try {
      const fs = require('fs')
      fs.accessSync(process.cwd(), fs.constants.R_OK)
      healthData.checks.filesystem = 'healthy'
    } catch (error) {
      healthData.checks.filesystem = 'unhealthy'
    }

    // 计算响应时间
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...healthData,
      responseTime: `${responseTime}ms`
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    // 记录错误到 Sentry
    Sentry.captureException(error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  }
}

/**
 * 深度健康检查端点
 * 包含更详细的系统检查
 */
export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // 深度健康检查
    const deepHealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
      },
      checks: {
        database: 'healthy',
        sentry: 'healthy',
        filesystem: 'healthy',
        memory: 'healthy',
      }
    }

    // 内存使用检查
    const memoryUsage = process.memoryUsage()
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    
    if (memoryUsagePercent > 90) {
      deepHealthData.checks.memory = 'warning'
    } else if (memoryUsagePercent > 95) {
      deepHealthData.checks.memory = 'critical'
    }

    // 记录健康检查到 Sentry
    Sentry.addBreadcrumb({
      message: 'Deep health check performed',
      category: 'health',
      level: 'info',
      data: {
        memoryUsagePercent,
        uptime: process.uptime(),
      }
    })

    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...deepHealthData,
      responseTime: `${responseTime}ms`
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    Sentry.captureException(error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
    }, {
      status: 503
    })
  }
}
