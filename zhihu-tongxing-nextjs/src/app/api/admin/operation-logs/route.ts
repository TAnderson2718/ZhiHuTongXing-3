import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  queryOperationLogs, 
  getOperationLogStats,
  logOperation,
  exportOperationLogs,
  getClientIP,
  getUserAgent
} from '@/lib/operation-log'
import { 
  OperationLogQuery, 
  OperationType, 
  UserRole, 
  OperationResult 
} from '@/types/operation-log'

/**
 * GET /api/admin/operation-logs
 * 获取操作日志列表
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

    // 解析查询参数
    const { searchParams } = new URL(request.url)
    
    const query: OperationLogQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      userId: searchParams.get('userId') || undefined,
      username: searchParams.get('username') || undefined,
      userRole: searchParams.get('userRole') as UserRole || undefined,
      operationType: searchParams.get('operationType') as OperationType || undefined,
      targetResource: searchParams.get('targetResource') || undefined,
      result: searchParams.get('result') as OperationResult || undefined,
      searchKeyword: searchParams.get('searchKeyword') || undefined,
      sortBy: searchParams.get('sortBy') as any || 'timestamp',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
    }

    // 查询操作日志
    const result = await queryOperationLogs(query)

    // 记录查看操作日志的操作
    await logOperation({
      userId: session.userId,
      username: session.username,
      userRole: UserRole.ADMIN,
      operationType: OperationType.DATA_EXPORT,
      operationDescription: '查看操作日志',
      targetResource: 'operation-logs',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result: OperationResult.SUCCESS,
      metadata: {
        query,
        resultCount: result.logs.length
      }
    })

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error fetching operation logs:', error)
    
    return NextResponse.json(
      { success: false, error: '获取操作日志失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/operation-logs
 * 手动记录操作日志（用于测试或特殊情况）
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      operationType,
      operationDescription,
      targetResource,
      targetResourceId,
      result,
      errorMessage,
      metadata
    } = body

    // 验证必需字段
    if (!operationType || !operationDescription || !result) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    // 记录操作日志
    const log = await logOperation({
      userId: session.userId,
      username: session.username,
      userRole: UserRole.ADMIN,
      operationType,
      operationDescription,
      targetResource,
      targetResourceId,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result,
      errorMessage,
      metadata
    })

    return NextResponse.json({
      success: true,
      data: log,
      message: '操作日志记录成功'
    })

  } catch (error) {
    console.error('Error creating operation log:', error)
    
    return NextResponse.json(
      { success: false, error: '记录操作日志失败' },
      { status: 500 }
    )
  }
}
