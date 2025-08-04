import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  exportOperationLogs,
  logOperation,
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
 * POST /api/admin/operation-logs/export
 * 导出操作日志
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
    const { query, format = 'json' } = body

    // 导出操作日志
    const logs = await exportOperationLogs(query as OperationLogQuery)

    // 记录导出操作
    await logOperation({
      userId: session.userId,
      username: session.username,
      userRole: UserRole.ADMIN,
      operationType: OperationType.DATA_EXPORT,
      operationDescription: `导出操作日志 (${format} 格式)`,
      targetResource: 'operation-logs',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result: OperationResult.SUCCESS,
      metadata: {
        exportFormat: format,
        exportCount: logs.length,
        query
      }
    })

    // 根据格式返回数据
    if (format === 'csv') {
      // 生成CSV格式
      const csvHeaders = [
        'ID', '时间戳', '用户ID', '用户名', '用户角色', '操作类型', 
        '操作描述', '目标资源', '目标资源ID', 'IP地址', '用户代理', 
        '操作结果', '错误信息'
      ]
      
      const csvRows = logs.map(log => [
        log.id,
        log.timestamp,
        log.userId || '',
        log.username || '',
        log.userRole,
        log.operationType,
        log.operationDescription,
        log.targetResource || '',
        log.targetResourceId || '',
        log.ipAddress,
        log.userAgent,
        log.result,
        log.errorMessage || ''
      ])

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="operation-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // 默认返回JSON格式
    return NextResponse.json({
      success: true,
      data: logs,
      message: `成功导出 ${logs.length} 条操作日志`
    })

  } catch (error) {
    console.error('Error exporting operation logs:', error)
    
    return NextResponse.json(
      { success: false, error: '导出操作日志失败' },
      { status: 500 }
    )
  }
}
