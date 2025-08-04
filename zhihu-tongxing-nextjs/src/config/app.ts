/**
 * 应用配置管理
 * 统一管理所有应用配置，包括环境变量、常量、API端点等
 */

// 环境变量配置
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  ZHIPU_API_KEY: process.env.ZHIPU_API_KEY,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const

// 应用基础配置
export const app = {
  name: '智护童行',
  description: '专业的家庭教育与儿童照护平台，为每个家庭提供科学、专业的育儿指导和支持服务',
  version: '1.0.0',
  author: '智护童行团队',
  url: env.NODE_ENV === 'production' ? 'https://zhihutongxing.com' : 'http://localhost:3000',
  supportEmail: 'support@zhihutongxing.com',
  supportPhone: '400-123-4567',
  address: '北京市朝阳区智护大厦',
} as const

// API配置
export const api = {
  baseUrl: '/api',
  timeout: 10000,
  retryAttempts: 3,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      register: '/api/auth/register',
      me: '/api/auth/me',
      resetPassword: '/api/auth/reset-password',
    },
    users: {
      list: '/api/admin/users',
      create: '/api/admin/users',
      update: (id: string) => `/api/admin/users/${id}`,
      delete: (id: string) => `/api/admin/users/${id}`,
      resetPassword: (id: string) => `/api/admin/users/${id}/reset-password`,
    },
    articles: {
      list: '/api/articles',
      create: '/api/articles',
      update: (id: string) => `/api/articles/${id}`,
      delete: (id: string) => `/api/articles/${id}`,
      byId: (id: string) => `/api/articles/${id}`,
    },
    assessments: {
      list: '/api/assessments',
      create: '/api/assessments',
      update: (id: string) => `/api/assessments/${id}`,
      delete: (id: string) => `/api/assessments/${id}`,
      byId: (id: string) => `/api/assessments/${id}`,
    },
    operationLogs: {
      list: '/api/admin/operation-logs',
      stats: '/api/admin/operation-logs/stats',
      export: '/api/admin/operation-logs/export',
    },
    chat: {
      send: '/api/chat',
    },
  },
} as const

// 会话配置
export const session = {
  cookieName: 'zhihu-session',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
  secure: env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
  },
} as const

// 文件上传配置
export const upload = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    videos: ['video/mp4', 'video/webm', 'video/ogg'],
  },
  uploadDir: '/uploads',
} as const

// 分页配置
export const pagination = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [10, 20, 50, 100],
} as const

// 缓存配置
export const cache = {
  defaultTTL: 5 * 60 * 1000, // 5分钟
  longTTL: 60 * 60 * 1000, // 1小时
  shortTTL: 30 * 1000, // 30秒
} as const

// 评估配置
export const assessment = {
  types: {
    comprehensive: {
      id: 'comprehensive',
      name: '综合能力评估',
      description: '全面评估儿童的认知、语言、运动、社交等各方面能力',
      duration: 30,
      questionCount: 50,
    },
    sdq: {
      id: 'sdq',
      name: 'SDQ行为评估',
      description: '评估儿童的行为问题和心理健康状况',
      duration: 15,
      questionCount: 25,
    },
    embu: {
      id: 'embu',
      name: 'EMBU教养方式评估',
      description: '评估父母的教养方式对儿童发展的影响',
      duration: 20,
      questionCount: 30,
    },
    caregiving: {
      id: 'caregiving',
      name: '儿童照护能力评估',
      description: '评估照护者的儿童照护知识和技能水平',
      duration: 25,
      questionCount: 40,
    },
  },
  scoreRanges: {
    excellent: { min: 90, max: 100, label: '优秀', color: 'green' },
    good: { min: 80, max: 89, label: '良好', color: 'blue' },
    average: { min: 70, max: 79, label: '一般', color: 'yellow' },
    needsImprovement: { min: 60, max: 69, label: '需要改进', color: 'orange' },
    poor: { min: 0, max: 59, label: '较差', color: 'red' },
  },
} as const

// 主题配置
export const theme = {
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      900: '#134e4a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
} as const



// 功能开关配置
export const features = {
  registration: true,
  emailNotifications: true,
  smsNotifications: false,
  twoFactorAuth: false,
  maintenanceMode: false,
  analytics: true,
  aiChat: !!env.ZHIPU_API_KEY,
  videoUpload: true,
  socialLogin: false,
} as const

// 导出所有配置
export const config = {
  env,
  app,
  api,
  session,
  upload,
  pagination,
  cache,
  assessment,
  theme,
  monitoring,
  features,
} as const

export default config
