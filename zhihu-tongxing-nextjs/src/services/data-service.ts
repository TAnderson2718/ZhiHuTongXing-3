/**
 * 数据服务层
 * 统一管理数据操作，包括API调用、缓存、验证等
 */

import { apiClient, ApiResponse } from '@/lib/api-client'
import { useCacheStore } from '@/store'
import { config } from '@/config/app'
import { getCacheTTL } from '@/lib/config'
import type { SessionUser } from '@/types'

// 分页参数接口
interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 用户相关数据服务
export class UserService {
  private static cachePrefix = 'user:'

  // 获取用户列表
  static async getUsers(params: PaginationParams = {}) {
    const cacheKey = `${this.cachePrefix}list:${JSON.stringify(params)}`
    
    try {
      const response = await apiClient.get<any[]>(config.api.endpoints.users.list, {
        body: params,
        cacheTTL: getCacheTTL('short'),
      })
      
      return response
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  // 获取单个用户
  static async getUser(id: string) {
    const cacheKey = `${this.cachePrefix}${id}`
    
    try {
      const response = await apiClient.get<SessionUser>(`/api/admin/users/${id}`, {
        cacheTTL: getCacheTTL('default'),
      })
      
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 创建用户
  static async createUser(userData: any) {
    try {
      const response = await apiClient.post<SessionUser>(config.api.endpoints.users.create, userData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache()
      
      return response
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  }

  // 更新用户
  static async updateUser(id: string, userData: any) {
    try {
      const response = await apiClient.put<SessionUser>(config.api.endpoints.users.update(id), userData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache(id)
      
      return response
    } catch (error) {
      console.error('更新用户失败:', error)
      throw error
    }
  }

  // 删除用户
  static async deleteUser(id: string) {
    try {
      const response = await apiClient.delete(config.api.endpoints.users.delete(id), {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache(id)
      
      return response
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    }
  }

  // 重置用户密码
  static async resetUserPassword(id: string) {
    try {
      const response = await apiClient.post(config.api.endpoints.users.resetPassword(id), {}, {
        cache: false,
      })
      
      return response
    } catch (error) {
      console.error('重置密码失败:', error)
      throw error
    }
  }

  // 清除缓存
  static clearCache(id?: string) {
    if (id) {
      apiClient.clearCache(`${this.cachePrefix}${id}`)
    } else {
      apiClient.clearCache(this.cachePrefix)
    }
  }
}

// 文章相关数据服务
export class ArticleService {
  private static cachePrefix = 'article:'

  // 获取文章列表
  static async getArticles(params: PaginationParams & { category?: string } = {}) {
    try {
      const response = await apiClient.get<any[]>(config.api.endpoints.articles.list, {
        body: params,
        cacheTTL: getCacheTTL('default'),
      })
      
      return response
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw error
    }
  }

  // 获取单篇文章
  static async getArticle(id: string) {
    try {
      const response = await apiClient.get<any>(config.api.endpoints.articles.byId(id), {
        cacheTTL: getCacheTTL('long'),
      })
      
      return response
    } catch (error) {
      console.error('获取文章失败:', error)
      throw error
    }
  }

  // 创建文章
  static async createArticle(articleData: any) {
    try {
      const response = await apiClient.post<any>(config.api.endpoints.articles.create, articleData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache()
      
      return response
    } catch (error) {
      console.error('创建文章失败:', error)
      throw error
    }
  }

  // 更新文章
  static async updateArticle(id: string, articleData: any) {
    try {
      const response = await apiClient.put<any>(config.api.endpoints.articles.update(id), articleData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache(id)
      
      return response
    } catch (error) {
      console.error('更新文章失败:', error)
      throw error
    }
  }

  // 删除文章
  static async deleteArticle(id: string) {
    try {
      const response = await apiClient.delete(config.api.endpoints.articles.delete(id), {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache(id)
      
      return response
    } catch (error) {
      console.error('删除文章失败:', error)
      throw error
    }
  }

  // 清除缓存
  static clearCache(id?: string) {
    if (id) {
      apiClient.clearCache(`${this.cachePrefix}${id}`)
    } else {
      apiClient.clearCache(this.cachePrefix)
    }
  }
}

// 评估相关数据服务
export class AssessmentService {
  private static cachePrefix = 'assessment:'

  // 获取评估列表
  static async getAssessments(params: PaginationParams & { type?: string; status?: string } = {}) {
    try {
      const response = await apiClient.get<any[]>(config.api.endpoints.assessments.list, {
        body: params,
        cacheTTL: getCacheTTL('short'),
      })
      
      return response
    } catch (error) {
      console.error('获取评估列表失败:', error)
      throw error
    }
  }

  // 获取单个评估
  static async getAssessment(id: string) {
    try {
      const response = await apiClient.get<any>(config.api.endpoints.assessments.byId(id), {
        cacheTTL: getCacheTTL('default'),
      })
      
      return response
    } catch (error) {
      console.error('获取评估失败:', error)
      throw error
    }
  }

  // 创建评估
  static async createAssessment(assessmentData: any) {
    try {
      const response = await apiClient.post<any>(config.api.endpoints.assessments.create, assessmentData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache()
      
      return response
    } catch (error) {
      console.error('创建评估失败:', error)
      throw error
    }
  }

  // 更新评估
  static async updateAssessment(id: string, assessmentData: any) {
    try {
      const response = await apiClient.put<any>(config.api.endpoints.assessments.update(id), assessmentData, {
        cache: false,
      })
      
      // 清除相关缓存
      this.clearCache(id)
      
      return response
    } catch (error) {
      console.error('更新评估失败:', error)
      throw error
    }
  }

  // 清除缓存
  static clearCache(id?: string) {
    if (id) {
      apiClient.clearCache(`${this.cachePrefix}${id}`)
    } else {
      apiClient.clearCache(this.cachePrefix)
    }
  }
}

// 认证相关数据服务
export class AuthService {
  // 登录
  static async login(credentials: { email: string; password: string }) {
    try {
      const response = await apiClient.post<{ user: SessionUser; token: string }>(
        config.api.endpoints.auth.login,
        credentials,
        { cache: false }
      )
      
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 注册
  static async register(userData: { email: string; password: string; name: string }) {
    try {
      const response = await apiClient.post<{ user: SessionUser; token: string }>(
        config.api.endpoints.auth.register,
        userData,
        { cache: false }
      )
      
      return response
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  // 获取当前用户信息
  static async getCurrentUser() {
    try {
      const response = await apiClient.get<SessionUser>(config.api.endpoints.auth.me, {
        cacheTTL: getCacheTTL('short'),
      })
      
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 登出
  static async logout() {
    try {
      const response = await apiClient.post(config.api.endpoints.auth.logout, {}, {
        cache: false,
      })
      
      // 清除所有缓存
      apiClient.clearCache()
      
      return response
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    }
  }
}

// 导出所有服务
export { UserService, ArticleService, AssessmentService, AuthService }
