import { z } from 'zod'

// 服务器端DOMPurify实例（延迟初始化）
let purify: any = null

// 初始化DOMPurify（仅在需要时）
async function initializePurify() {
  if (purify) return purify

  if (typeof window === 'undefined') {
    // 服务器端
    const { JSDOM } = await import('jsdom')
    const DOMPurify = await import('dompurify')
    const window = new JSDOM('').window
    purify = DOMPurify.default(window as any)
  } else {
    // 客户端
    const DOMPurify = await import('dompurify')
    purify = DOMPurify.default
  }

  return purify
}

// 通用验证规则
export const ValidationRules = {
  // 用户输入长度限制
  MAX_COMMENT_LENGTH: 2000,
  MAX_TITLE_LENGTH: 200,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  
  // 内容验证
  MIN_COMMENT_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const

// 评论/回复验证模式
export const CommentValidationSchema = z.object({
  content: z
    .string()
    .min(ValidationRules.MIN_COMMENT_LENGTH, '评论内容不能为空')
    .max(ValidationRules.MAX_COMMENT_LENGTH, `评论内容不能超过${ValidationRules.MAX_COMMENT_LENGTH}个字符`)
    .refine(
      (content) => content.trim().length > 0,
      '评论内容不能只包含空白字符'
    ),
  author: z
    .string()
    .min(1, '作者名称不能为空')
    .max(ValidationRules.MAX_NAME_LENGTH, `作者名称不能超过${ValidationRules.MAX_NAME_LENGTH}个字符`),
  avatar: z.string().optional(),
})

// 用户注册验证模式
export const UserRegistrationSchema = z.object({
  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(ValidationRules.MAX_EMAIL_LENGTH, '邮箱地址过长'),
  password: z
    .string()
    .min(ValidationRules.MIN_PASSWORD_LENGTH, `密码至少需要${ValidationRules.MIN_PASSWORD_LENGTH}个字符`)
    .max(ValidationRules.MAX_PASSWORD_LENGTH, '密码过长')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '密码必须包含字母和数字'),
  name: z
    .string()
    .min(1, '姓名不能为空')
    .max(ValidationRules.MAX_NAME_LENGTH, `姓名不能超过${ValidationRules.MAX_NAME_LENGTH}个字符`),
})

// 用户登录验证模式
export const UserLoginSchema = z.object({
  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(ValidationRules.MAX_EMAIL_LENGTH, '邮箱地址过长'),
  password: z
    .string()
    .min(1, '密码不能为空')
    .max(ValidationRules.MAX_PASSWORD_LENGTH, '密码过长'),
})

// 文章/帖子验证模式
export const PostValidationSchema = z.object({
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(ValidationRules.MAX_TITLE_LENGTH, `标题不能超过${ValidationRules.MAX_TITLE_LENGTH}个字符`),
  content: z
    .string()
    .min(1, '内容不能为空')
    .max(ValidationRules.MAX_COMMENT_LENGTH, `内容不能超过${ValidationRules.MAX_COMMENT_LENGTH}个字符`),
  category: z.string().min(1, '请选择分类'),
})

// XSS防护 - 清理HTML内容
export async function sanitizeHtml(dirty: string): Promise<string> {
  const purifyInstance = await initializePurify()
  return purifyInstance.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

// XSS防护 - 清理纯文本（移除所有HTML标签）
export async function sanitizeText(dirty: string): Promise<string> {
  const purifyInstance = await initializePurify()
  return purifyInstance.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

// 简单的文本清理（不依赖DOMPurify，用于基本XSS防护）
export function basicSanitizeText(dirty: string): string {
  return dirty
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// 验证和清理评论内容
export async function validateAndSanitizeComment(data: unknown) {
  // 首先进行Zod验证
  const validationResult = CommentValidationSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message,
      data: null,
    }
  }

  // 然后进行XSS清理（使用基本清理避免异步问题）
  const sanitizedData = {
    content: basicSanitizeText(validationResult.data.content),
    author: basicSanitizeText(validationResult.data.author),
    avatar: validationResult.data.avatar || '👤',
  }

  return {
    success: true,
    error: null,
    data: sanitizedData,
  }
}

// 验证和清理用户注册数据
export function validateAndSanitizeRegistration(data: unknown) {
  const validationResult = UserRegistrationSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message,
      data: null,
    }
  }

  const sanitizedData = {
    email: basicSanitizeText(validationResult.data.email.toLowerCase()),
    password: validationResult.data.password, // 密码不需要清理
    name: basicSanitizeText(validationResult.data.name),
  }

  return {
    success: true,
    error: null,
    data: sanitizedData,
  }
}

// 验证和清理用户登录数据
export function validateAndSanitizeLogin(data: unknown) {
  const validationResult = UserLoginSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message,
      data: null,
    }
  }

  const sanitizedData = {
    email: basicSanitizeText(validationResult.data.email.toLowerCase()),
    password: validationResult.data.password, // 密码不需要清理
  }

  return {
    success: true,
    error: null,
    data: sanitizedData,
  }
}

// 通用输入长度检查
export function checkInputLength(input: string, maxLength: number, fieldName: string) {
  if (input.length > maxLength) {
    throw new Error(`${fieldName}长度不能超过${maxLength}个字符`)
  }
}

// API响应数据验证
export function validateApiResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error(`API响应数据验证失败: ${result.error.errors[0].message}`)
  }

  return result.data
}

// 分页参数验证
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 文件上传验证
export function validateFileUpload(file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
  allowedExtensions?: string[]
}) {
  const errors: string[] = []

  // 检查文件大小
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`文件大小不能超过 ${formatFileSize(options.maxSize)}`)
  }

  // 检查文件类型
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`不支持的文件类型: ${file.type}`)
  }

  // 检查文件扩展名
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push(`不支持的文件扩展名: ${extension}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 数据清理和转换
export function sanitizeAndTransformData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  sanitizers?: Record<string, (value: any) => any>
): T {
  // 首先进行基本验证
  const validationResult = schema.safeParse(data)

  if (!validationResult.success) {
    throw new Error(`数据验证失败: ${validationResult.error.errors[0].message}`)
  }

  let transformedData = validationResult.data

  // 应用自定义清理函数
  if (sanitizers && typeof transformedData === 'object' && transformedData !== null) {
    for (const [key, sanitizer] of Object.entries(sanitizers)) {
      if (key in transformedData) {
        (transformedData as any)[key] = sanitizer((transformedData as any)[key])
      }
    }
  }

  return transformedData
}

// 批量数据验证
export function validateBatchData<T>(
  dataArray: unknown[],
  schema: z.ZodSchema<T>
): { valid: T[]; invalid: { index: number; data: unknown; error: string }[] } {
  const valid: T[] = []
  const invalid: { index: number; data: unknown; error: string }[] = []

  dataArray.forEach((data, index) => {
    const result = schema.safeParse(data)

    if (result.success) {
      valid.push(result.data)
    } else {
      invalid.push({
        index,
        data,
        error: result.error.errors[0].message,
      })
    }
  })

  return { valid, invalid }
}

// 检查是否包含恶意脚本
export function containsMaliciousScript(input: string): boolean {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(input))
}



export type ValidationResult<T> = {
  success: boolean
  error: string | null
  data: T | null
}
