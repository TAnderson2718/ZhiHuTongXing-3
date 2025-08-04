/**
 * 配置相关的类型定义
 */

// 环境类型
export type Environment = 'development' | 'production' | 'test'

// API端点配置类型
export interface ApiEndpoints {
  auth: {
    login: string
    logout: string
    register: string
    me: string
    resetPassword: string
  }
  users: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
    resetPassword: (id: string) => string
  }
  articles: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
    byId: (id: string) => string
  }
  assessments: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
    byId: (id: string) => string
  }
  monitoring: {
    errors: string
    stats: string
    log: string
  }
  chat: {
    send: string
  }
}

// 评估类型配置
export interface AssessmentTypeConfig {
  id: string
  name: string
  description: string
  duration: number
  questionCount: number
}

// 评估分数范围配置
export interface ScoreRange {
  min: number
  max: number
  label: string
  color: string
}

// 主题颜色配置
export interface ColorPalette {
  50: string
  100: string
  500: string
  600: string
  700: string
  900: string
}

// 会话配置类型
export interface SessionConfig {
  cookieName: string
  maxAge: number
  secure: boolean
  httpOnly: boolean
  sameSite: 'strict' | 'lax' | 'none'
  encryption: {
    algorithm: string
    keyLength: number
    ivLength: number
    tagLength: number
  }
}

// 文件上传配置类型
export interface UploadConfig {
  maxFileSize: number
  allowedTypes: {
    images: string[]
    documents: string[]
    videos: string[]
  }
  uploadDir: string
}

// 分页配置类型
export interface PaginationConfig {
  defaultPageSize: number
  maxPageSize: number
  pageSizeOptions: number[]
}

// 缓存配置类型
export interface CacheConfig {
  defaultTTL: number
  longTTL: number
  shortTTL: number
}



// 功能开关配置类型
export interface FeatureFlags {
  registration: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  twoFactorAuth: boolean
  maintenanceMode: boolean
  analytics: boolean
  aiChat: boolean
  videoUpload: boolean
  socialLogin: boolean
}

// 应用配置类型
export interface AppConfig {
  name: string
  description: string
  version: string
  author: string
  url: string
  supportEmail: string
  supportPhone: string
  address: string
}

// API配置类型
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  endpoints: ApiEndpoints
}

// 主配置类型
export interface Config {
  env: {
    NODE_ENV: string
    SESSION_SECRET: string
    DATABASE_URL: string
    ZHIPU_API_KEY?: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET?: string
  }
  app: AppConfig
  api: ApiConfig
  session: SessionConfig
  upload: UploadConfig
  pagination: PaginationConfig
  cache: CacheConfig
  assessment: {
    types: Record<string, AssessmentTypeConfig>
    scoreRanges: Record<string, ScoreRange>
  }
  theme: {
    colors: {
      primary: ColorPalette
      gray: ColorPalette
    }
    spacing: Record<string, string>
    borderRadius: Record<string, string>
  }
  monitoring: MonitoringConfig
  features: FeatureFlags
}

// 系统设置类型（用于管理员设置页面）
export interface SystemSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportPhone: string
  address: string
  enableRegistration: boolean
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  maxFileUploadSize: number
  sessionTimeout: number
  passwordMinLength: number
  maintenanceMode: boolean
  analyticsEnabled: boolean
  logRetentionDays: number
}

// 配置验证错误类型
export interface ConfigValidationError {
  field: string
  message: string
  value?: any
}

// 配置更新结果类型
export interface ConfigUpdateResult {
  success: boolean
  errors?: ConfigValidationError[]
  updatedFields?: string[]
}

export default Config
