/**
 * 操作日志核心库
 * 提供操作日志的记录、查询和管理功能
 */

import { 
  OperationLog, 
  CreateOperationLogParams, 
  OperationLogQuery,
  OperationLogPaginatedResponse,
  OperationLogStats,
  OperationType,
  UserRole,
  OperationResult
} from '@/types/operation-log'

// 内存存储的操作日志（在实际应用中应该使用数据库）
let operationLogs: OperationLog[] = []

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取客户端IP地址（在服务器端使用）
 */
export function getClientIP(request?: Request): string {
  if (typeof window !== 'undefined') {
    return 'client-side'
  }
  
  if (request) {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    if (realIP) {
      return realIP
    }
  }
  
  return 'unknown'
}

/**
 * 获取用户代理信息
 */
export function getUserAgent(request?: Request): string {
  if (typeof window !== 'undefined') {
    return navigator.userAgent
  }
  
  if (request) {
    return request.headers.get('user-agent') || 'unknown'
  }
  
  return 'unknown'
}

/**
 * 记录操作日志
 */
export async function logOperation(params: CreateOperationLogParams): Promise<OperationLog> {
  const log: OperationLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    userId: params.userId,
    username: params.username,
    userRole: params.userRole,
    operationType: params.operationType,
    operationDescription: params.operationDescription,
    targetResource: params.targetResource,
    targetResourceId: params.targetResourceId,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    result: params.result,
    errorMessage: params.errorMessage,
    metadata: params.metadata,
    beforeData: params.beforeData,
    afterData: params.afterData
  }

  // 添加到内存存储
  operationLogs.unshift(log)

  // 限制内存中的日志数量（保留最新的10000条）
  if (operationLogs.length > 10000) {
    operationLogs = operationLogs.slice(0, 10000)
  }

  // 在实际应用中，这里应该将日志保存到数据库
  console.info('Operation logged:', {
    id: log.id,
    type: log.operationType,
    user: log.username,
    result: log.result
  })

  return log
}

/**
 * 查询操作日志
 */
export async function queryOperationLogs(query: OperationLogQuery = {}): Promise<OperationLogPaginatedResponse> {
  let filteredLogs = [...operationLogs]

  // 应用筛选条件
  if (query.userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === query.userId)
  }

  if (query.username) {
    filteredLogs = filteredLogs.filter(log => 
      log.username?.toLowerCase().includes(query.username!.toLowerCase())
    )
  }

  if (query.userRole) {
    filteredLogs = filteredLogs.filter(log => log.userRole === query.userRole)
  }

  if (query.operationType) {
    filteredLogs = filteredLogs.filter(log => log.operationType === query.operationType)
  }

  if (query.targetResource) {
    filteredLogs = filteredLogs.filter(log => log.targetResource === query.targetResource)
  }

  if (query.result) {
    filteredLogs = filteredLogs.filter(log => log.result === query.result)
  }

  if (query.startDate) {
    const startDate = new Date(query.startDate)
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate)
  }

  if (query.endDate) {
    const endDate = new Date(query.endDate)
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate)
  }

  if (query.searchKeyword) {
    const keyword = query.searchKeyword.toLowerCase()
    filteredLogs = filteredLogs.filter(log => 
      log.operationDescription.toLowerCase().includes(keyword) ||
      log.username?.toLowerCase().includes(keyword) ||
      log.targetResource?.toLowerCase().includes(keyword)
    )
  }

  // 排序
  const sortBy = query.sortBy || 'timestamp'
  const sortOrder = query.sortOrder || 'desc'

  filteredLogs.sort((a, b) => {
    let aValue: any = a[sortBy]
    let bValue: any = b[sortBy]

    if (sortBy === 'timestamp') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // 分页
  const page = query.page || 1
  const limit = query.limit || 20
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

  return {
    logs: paginatedLogs,
    pagination: {
      page,
      limit,
      total: filteredLogs.length,
      totalPages: Math.ceil(filteredLogs.length / limit)
    }
  }
}

/**
 * 获取操作日志统计信息
 */
export async function getOperationLogStats(): Promise<OperationLogStats> {
  const totalLogs = operationLogs.length

  // 按类型统计
  const logsByType: Record<OperationType, number> = {} as Record<OperationType, number>
  Object.values(OperationType).forEach(type => {
    logsByType[type] = operationLogs.filter(log => log.operationType === type).length
  })

  // 按角色统计
  const logsByRole: Record<UserRole, number> = {} as Record<UserRole, number>
  Object.values(UserRole).forEach(role => {
    logsByRole[role] = operationLogs.filter(log => log.userRole === role).length
  })

  // 按结果统计
  const logsByResult: Record<OperationResult, number> = {} as Record<OperationResult, number>
  Object.values(OperationResult).forEach(result => {
    logsByResult[result] = operationLogs.filter(log => log.result === result).length
  })

  // 按日期统计（最近7天）
  const logsByDate: Record<string, number> = {}
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    logsByDate[dateStr] = operationLogs.filter(log => 
      log.timestamp.startsWith(dateStr)
    ).length
  }

  // 最近的日志
  const recentLogs = operationLogs.slice(0, 10)

  // 活跃用户统计
  const userOperationCounts: Record<string, { username: string; count: number }> = {}
  operationLogs.forEach(log => {
    if (log.userId && log.username) {
      if (!userOperationCounts[log.userId]) {
        userOperationCounts[log.userId] = { username: log.username, count: 0 }
      }
      userOperationCounts[log.userId].count++
    }
  })

  const topUsers = Object.entries(userOperationCounts)
    .map(([userId, data]) => ({
      userId,
      username: data.username,
      operationCount: data.count
    }))
    .sort((a, b) => b.operationCount - a.operationCount)
    .slice(0, 10)

  return {
    totalLogs,
    logsByType,
    logsByRole,
    logsByResult,
    logsByDate,
    recentLogs,
    topUsers
  }
}

/**
 * 删除过期的操作日志
 */
export async function cleanupExpiredLogs(retentionDays: number = 30): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  const initialCount = operationLogs.length
  operationLogs = operationLogs.filter(log => 
    new Date(log.timestamp) > cutoffDate
  )

  const deletedCount = initialCount - operationLogs.length
  
  if (deletedCount > 0) {
    console.info(`Cleaned up ${deletedCount} expired operation logs`)
  }

  return deletedCount
}

/**
 * 获取单个操作日志
 */
export async function getOperationLogById(id: string): Promise<OperationLog | null> {
  return operationLogs.find(log => log.id === id) || null
}

/**
 * 导出操作日志
 */
export async function exportOperationLogs(query: OperationLogQuery = {}): Promise<OperationLog[]> {
  const result = await queryOperationLogs({ ...query, limit: 10000 })
  return result.logs
}
