/**
 * 配置工具函数
 * 提供配置验证、获取、更新等功能
 */

import { config } from '@/config/app'
import type { Config, ConfigValidationError, SystemSettings } from '@/types/config'

/**
 * 验证环境变量配置
 */
export function validateEnvironment(): ConfigValidationError[] {
  const errors: ConfigValidationError[] = []

  // 检查必需的环境变量
  if (!config.env.SESSION_SECRET || config.env.SESSION_SECRET === 'default-session-secret') {
    errors.push({
      field: 'SESSION_SECRET',
      message: '生产环境必须设置安全的会话密钥',
      value: config.env.SESSION_SECRET,
    })
  }

  if (config.env.NODE_ENV === 'production') {
    if (!config.env.NEXTAUTH_SECRET) {
      errors.push({
        field: 'NEXTAUTH_SECRET',
        message: '生产环境必须设置NextAuth密钥',
      })
    }

    if (config.app.url.includes('localhost')) {
      errors.push({
        field: 'APP_URL',
        message: '生产环境不应使用localhost URL',
        value: config.app.url,
      })
    }
  }

  return errors
}

/**
 * 获取API端点URL
 */
export function getApiUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${config.api.baseUrl}${endpoint}`
  
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }
  
  return url
}

/**
 * 获取完整的应用URL
 */
export function getAppUrl(path: string = ''): string {
  return `${config.app.url}${path}`
}

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature]
}

/**
 * 获取评估类型配置
 */
export function getAssessmentConfig(type: string) {
  return config.assessment.types[type]
}

/**
 * 根据分数获取评估等级
 */
export function getScoreLevel(score: number) {
  for (const [level, range] of Object.entries(config.assessment.scoreRanges)) {
    if (score >= range.min && score <= range.max) {
      return { level, ...range }
    }
  }
  return null
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, category: 'images' | 'documents' | 'videos'): boolean {
  const allowedTypes = config.upload.allowedTypes[category]
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= config.upload.maxFileSize
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取缓存TTL
 */
export function getCacheTTL(type: 'default' | 'long' | 'short' = 'default'): number {
  switch (type) {
    case 'long':
      return config.cache.longTTL
    case 'short':
      return config.cache.shortTTL
    default:
      return config.cache.defaultTTL
  }
}

/**
 * 生成分页参数
 */
export function getPaginationParams(page: number = 1, pageSize?: number) {
  const size = pageSize || config.pagination.defaultPageSize
  const validSize = Math.min(size, config.pagination.maxPageSize)
  
  return {
    page: Math.max(1, page),
    pageSize: validSize,
    offset: (Math.max(1, page) - 1) * validSize,
  }
}

/**
 * 验证分页参数
 */
export function validatePaginationParams(page?: number, pageSize?: number) {
  const errors: string[] = []
  
  if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
    errors.push('页码必须是大于0的整数')
  }
  
  if (pageSize !== undefined) {
    if (pageSize < 1 || !Number.isInteger(pageSize)) {
      errors.push('页面大小必须是大于0的整数')
    } else if (pageSize > config.pagination.maxPageSize) {
      errors.push(`页面大小不能超过${config.pagination.maxPageSize}`)
    }
  }
  
  return errors
}

/**
 * 获取主题颜色
 */
export function getThemeColor(color: 'primary' | 'gray', shade: keyof typeof config.theme.colors.primary): string {
  return config.theme.colors[color][shade]
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return config.env.NODE_ENV === 'development'
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return config.env.NODE_ENV === 'production'
}

/**
 * 获取错误监控配置
 */
export function getMonitoringConfig() {
  return config.monitoring
}

/**
 * 检查错误监控是否启用
 */
export function isMonitoringEnabled(): boolean {
  return config.monitoring.enabled
}

/**
 * 获取系统设置默认值
 */
export function getDefaultSystemSettings(): SystemSettings {
  return {
    siteName: config.app.name,
    siteDescription: config.app.description,
    contactEmail: config.app.supportEmail,
    supportPhone: config.app.supportPhone,
    address: config.app.address,
    enableRegistration: config.features.registration,
    enableEmailNotifications: config.features.emailNotifications,
    enableSMSNotifications: config.features.smsNotifications,
    maxFileUploadSize: Math.round(config.upload.maxFileSize / (1024 * 1024)), // 转换为MB
    sessionTimeout: Math.round(config.session.maxAge / (60 * 1000)), // 转换为分钟
    passwordMinLength: 6,
    maintenanceMode: config.features.maintenanceMode,
    analyticsEnabled: config.features.analytics,
    logRetentionDays: config.monitoring.retentionDays,
  }
}

/**
 * 验证系统设置
 */
export function validateSystemSettings(settings: Partial<SystemSettings>): ConfigValidationError[] {
  const errors: ConfigValidationError[] = []

  if (settings.siteName && settings.siteName.trim().length === 0) {
    errors.push({
      field: 'siteName',
      message: '站点名称不能为空',
    })
  }

  if (settings.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
    errors.push({
      field: 'contactEmail',
      message: '请输入有效的邮箱地址',
    })
  }

  if (settings.maxFileUploadSize && (settings.maxFileUploadSize < 1 || settings.maxFileUploadSize > 100)) {
    errors.push({
      field: 'maxFileUploadSize',
      message: '文件上传大小限制必须在1-100MB之间',
    })
  }

  if (settings.sessionTimeout && (settings.sessionTimeout < 5 || settings.sessionTimeout > 1440)) {
    errors.push({
      field: 'sessionTimeout',
      message: '会话超时时间必须在5-1440分钟之间',
    })
  }

  if (settings.passwordMinLength && (settings.passwordMinLength < 6 || settings.passwordMinLength > 20)) {
    errors.push({
      field: 'passwordMinLength',
      message: '密码最小长度必须在6-20字符之间',
    })
  }

  if (settings.logRetentionDays && (settings.logRetentionDays < 1 || settings.logRetentionDays > 365)) {
    errors.push({
      field: 'logRetentionDays',
      message: '日志保留天数必须在1-365天之间',
    })
  }

  return errors
}

// 导出配置对象
export { config }
export default config
