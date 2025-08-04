/**
 * API客户端库
 * 提供统一的API调用、缓存、错误处理和重试机制
 */

import { config } from '@/config/app'
import { getCacheTTL } from '@/lib/config'

// API响应类型
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// API错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 缓存接口
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// 内存缓存实现
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 全局缓存实例
const cache = new MemoryCache()

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000) // 每5分钟清理一次
}

// API客户端配置
interface ApiClientConfig {
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
  defaultHeaders?: Record<string, string>
}

// API请求选项
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  cache?: boolean
  cacheTTL?: number
  retryAttempts?: number
  timeout?: number
}

class ApiClient {
  private baseUrl: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number
  private defaultHeaders: Record<string, string>

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || ''
    this.timeout = config.timeout || 10000
    this.retryAttempts = config.retryAttempts || 3
    this.retryDelay = config.retryDelay || 1000
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    }
  }

  // 生成缓存键
  private getCacheKey(url: string, options: RequestOptions): string {
    const method = options.method || 'GET'
    const body = options.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 执行HTTP请求
  private async executeRequest(url: string, options: RequestOptions): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // 带重试的请求
  private async requestWithRetry(url: string, options: RequestOptions): Promise<Response> {
    const maxAttempts = options.retryAttempts ?? this.retryAttempts
    let lastError: Error

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.executeRequest(url, options)
        
        // 如果是服务器错误且还有重试次数，则重试
        if (response.status >= 500 && attempt < maxAttempts) {
          await this.delay(this.retryDelay * attempt)
          continue
        }

        return response
      } catch (error) {
        lastError = error as Error
        
        // 如果是网络错误且还有重试次数，则重试
        if (attempt < maxAttempts) {
          await this.delay(this.retryDelay * attempt)
          continue
        }
      }
    }

    throw lastError!
  }

  // 主要的请求方法
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const cacheKey = this.getCacheKey(url, options)

    // 检查缓存（仅对GET请求）
    if (options.cache !== false && (options.method || 'GET') === 'GET') {
      const cachedData = cache.get<ApiResponse<T>>(cacheKey)
      if (cachedData) {
        return cachedData
      }
    }

    try {
      const response = await this.requestWithRetry(url, options)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code,
          errorData
        )
      }

      const data: ApiResponse<T> = await response.json()

      // 缓存成功的GET请求响应
      if (options.cache !== false && (options.method || 'GET') === 'GET') {
        const ttl = options.cacheTTL || getCacheTTL('default')
        cache.set(cacheKey, data, ttl)
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // 处理网络错误
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('请求超时', 408, 'TIMEOUT')
        }
        throw new ApiError(`网络错误: ${error.message}`, 0, 'NETWORK_ERROR')
      }

      throw new ApiError('未知错误', 0, 'UNKNOWN_ERROR')
    }
  }

  // 便捷方法
  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // 清除缓存
  clearCache(pattern?: string): void {
    if (pattern) {
      // 清除匹配模式的缓存
      for (const key of cache['cache'].keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient({
  baseUrl: config.api.baseUrl,
  timeout: config.api.timeout,
  retryAttempts: config.api.retryAttempts,
})

// 导出类型和实例
export { ApiClient, cache }
export type { ApiResponse, RequestOptions, ApiClientConfig }
