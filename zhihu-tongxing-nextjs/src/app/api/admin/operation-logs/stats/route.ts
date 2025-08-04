import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getOperationLogStats,
  logOperation,
  getClientIP,
  getUserAgent
} from '@/lib/operation-log'
import { 
  OperationType, 
  UserRole, 
  OperationResult 
} from '@/types/operation-log'

/**
 * GET /api/admin/operation-logs/stats
 * 获取操作日志统计信息
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      )
    }

    // 获取统计信息
    const stats = await getOperationLogStats()

    // 记录查看统计信息的操作
    await logOperation({
      userId: session.userId,
      username: session.username,
      userRole: UserRole.ADMIN,
      operationType: OperationType.DATA_EXPORT,
      operationDescription: '查看操作日志统计信息',
      targetResource: 'operation-logs-stats',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result: OperationResult.SUCCESS,
      metadata: {
        totalLogs: stats.totalLogs
      }
    })

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching operation log stats:', error)
    
    return NextResponse.json(
      { success: false, error: '获取统计信息失败' },
      { status: 500 }
    )
  }
}
