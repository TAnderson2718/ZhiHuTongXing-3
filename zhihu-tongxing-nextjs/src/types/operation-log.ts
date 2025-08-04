/**
 * 操作日志系统类型定义
 * 用于记录和追踪用户和管理员的各种操作活动
 */

// 操作类型枚举
export enum OperationType {
  // 认证相关
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  
  // 用户管理
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ACTIVATE = 'USER_ACTIVATE',
  USER_DEACTIVATE = 'USER_DEACTIVATE',
  
  // 内容管理
  ARTICLE_CREATE = 'ARTICLE_CREATE',
  ARTICLE_UPDATE = 'ARTICLE_UPDATE',
  ARTICLE_DELETE = 'ARTICLE_DELETE',
  ARTICLE_PUBLISH = 'ARTICLE_PUBLISH',
  ARTICLE_UNPUBLISH = 'ARTICLE_UNPUBLISH',
  
  // 评估工具管理
  ASSESSMENT_CREATE = 'ASSESSMENT_CREATE',
  ASSESSMENT_UPDATE = 'ASSESSMENT_UPDATE',
  ASSESSMENT_DELETE = 'ASSESSMENT_DELETE',
  ASSESSMENT_TAKE = 'ASSESSMENT_TAKE',
  
  // 讨论和回复
  DISCUSSION_CREATE = 'DISCUSSION_CREATE',
  DISCUSSION_UPDATE = 'DISCUSSION_UPDATE',
  DISCUSSION_DELETE = 'DISCUSSION_DELETE',
  REPLY_CREATE = 'REPLY_CREATE',
  REPLY_UPDATE = 'REPLY_UPDATE',
  REPLY_DELETE = 'REPLY_DELETE',
  
  // 系统设置
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
  SYSTEM_CONFIG_UPDATE = 'SYSTEM_CONFIG_UPDATE',
  
  // 文件操作
  FILE_UPLOAD = 'FILE_UPLOAD',
  FILE_DELETE = 'FILE_DELETE',
  
  // 安全相关
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  // 其他
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_IMPORT = 'DATA_IMPORT',
  BACKUP_CREATE = 'BACKUP_CREATE',
  BACKUP_RESTORE = 'BACKUP_RESTORE'
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// 操作结果枚举
export enum OperationResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
}

// 操作日志接口
export interface OperationLog {
  id: string
  timestamp: string
  
  // 用户信息
  userId?: string
  username?: string
  userRole: UserRole
  
  // 操作信息
  operationType: OperationType
  operationDescription: string
  targetResource?: string
  targetResourceId?: string
  
  // 网络信息
  ipAddress: string
  userAgent: string
  
  // 操作结果
  result: OperationResult
  errorMessage?: string
  
  // 额外的元数据
  metadata?: Record<string, any>
  
  // 操作前后的数据变化（可选）
  beforeData?: Record<string, any>
  afterData?: Record<string, any>
}

// 操作日志创建参数
export interface CreateOperationLogParams {
  userId?: string
  username?: string
  userRole: UserRole
  operationType: OperationType
  operationDescription: string
  targetResource?: string
  targetResourceId?: string
  ipAddress: string
  userAgent: string
  result: OperationResult
  errorMessage?: string
  metadata?: Record<string, any>
  beforeData?: Record<string, any>
  afterData?: Record<string, any>
}

// 操作日志查询参数
export interface OperationLogQuery {
  // 分页参数
  page?: number
  limit?: number
  
  // 时间范围
  startDate?: string
  endDate?: string
  
  // 筛选条件
  userId?: string
  username?: string
  userRole?: UserRole
  operationType?: OperationType
  targetResource?: string
  result?: OperationResult
  
  // 搜索关键词
  searchKeyword?: string
  
  // 排序
  sortBy?: 'timestamp' | 'operationType' | 'userRole' | 'result'
  sortOrder?: 'asc' | 'desc'
}

// 操作日志统计信息
export interface OperationLogStats {
  totalLogs: number
  logsByType: Record<OperationType, number>
  logsByRole: Record<UserRole, number>
  logsByResult: Record<OperationResult, number>
  logsByDate: Record<string, number>
  recentLogs: OperationLog[]
  topUsers: Array<{
    userId: string
    username: string
    operationCount: number
  }>
}

// 操作日志分页响应
export interface OperationLogPaginatedResponse {
  logs: OperationLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 操作日志API响应
export interface OperationLogApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 操作日志过滤器选项
export interface OperationLogFilterOptions {
  operationTypes: Array<{
    value: OperationType
    label: string
  }>
  userRoles: Array<{
    value: UserRole
    label: string
  }>
  results: Array<{
    value: OperationResult
    label: string
  }>
  targetResources: Array<{
    value: string
    label: string
  }>
}

// 操作日志导出参数
export interface OperationLogExportParams {
  format: 'csv' | 'json' | 'xlsx'
  query: OperationLogQuery
  includeMetadata?: boolean
}

// 操作日志配置
export interface OperationLogConfig {
  enabled: boolean
  maxLogs: number
  retentionDays: number
  enableRealTimeUpdates: boolean
  logLevels: OperationType[]
  excludeOperations: OperationType[]
}
