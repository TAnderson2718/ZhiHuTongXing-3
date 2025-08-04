'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionUser } from '@/types'

interface UseAdminAuthReturn {
  user: SessionUser | null
  loading: boolean
  error: string | null
}

/**
 * 管理员权限验证Hook
 * 使用统一的会话系统验证管理员权限
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        setLoading(true)
        setError(null)

        // 调用统一的会话验证API
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // 确保包含cookies
        })

        const data = await response.json()

        if (data.success && data.data) {
          // 验证是否为管理员
          if (data.data.role === 'admin') {
            setUser(data.data)
          } else {
            setError('权限不足，只有管理员可以访问')
            router.push('/admin')
          }
        } else {
          setError(data.error || '未登录')
          router.push('/admin')
        }
      } catch (error) {
        console.error('Admin auth check failed:', error)
        setError('认证验证失败')
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [router])

  return { user, loading, error }
}
