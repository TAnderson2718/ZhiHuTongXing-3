/**
 * 数据获取和状态管理Hooks
 * 提供统一的数据获取、缓存、错误处理和加载状态管理
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiResponse } from '@/lib/api-client'
import { useNotifications } from '@/store'

// Hook选项接口
interface UseDataOptions<T> {
  initialData?: T
  enabled?: boolean
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  retryOnError?: boolean
  retryDelay?: number
  maxRetries?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  cacheKey?: string
  cacheTTL?: number
}

// Hook返回值接口
interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  mutate: (newData: T | ((prevData: T | null) => T)) => void
  reset: () => void
}

// 通用数据获取Hook
export function useData<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: UseDataOptions<T> = {}
): UseDataResult<T> {
  const {
    initialData = null,
    enabled = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    retryOnError = true,
    retryDelay = 1000,
    maxRetries = 3,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const retryCountRef = useRef(0)
  const mountedRef = useRef(true)
  const { showError } = useNotifications()

  // 执行数据获取
  const fetchData = useCallback(async () => {
    if (!enabled || !mountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetcher()
      
      if (!mountedRef.current) return

      setData(response.data)
      retryCountRef.current = 0
      
      if (onSuccess) {
        onSuccess(response.data)
      }
    } catch (err) {
      if (!mountedRef.current) return

      const error = err instanceof Error ? err : new Error('未知错误')
      setError(error)
      
      // 重试逻辑
      if (retryOnError && retryCountRef.current < maxRetries) {
        retryCountRef.current++
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData()
          }
        }, retryDelay * retryCountRef.current)
        return
      }
      
      if (onError) {
        onError(error)
      } else {
        showError('数据获取失败', error.message)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetcher, enabled, retryOnError, maxRetries, retryDelay, onSuccess, onError, showError])

  // 手动刷新数据
  const refetch = useCallback(async () => {
    retryCountRef.current = 0
    await fetchData()
  }, [fetchData])

  // 手动更新数据
  const mutate = useCallback((newData: T | ((prevData: T | null) => T)) => {
    if (typeof newData === 'function') {
      setData(prevData => (newData as (prevData: T | null) => T)(prevData))
    } else {
      setData(newData)
    }
  }, [])

  // 重置状态
  const reset = useCallback(() => {
    setData(initialData)
    setLoading(false)
    setError(null)
    retryCountRef.current = 0
  }, [initialData])

  // 初始化数据获取
  useEffect(() => {
    if (refetchOnMount) {
      fetchData()
    }
  }, [fetchData, refetchOnMount])

  // 窗口焦点重新获取数据
  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      if (enabled && !loading) {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, enabled, loading, fetchData])

  // 清理函数
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
    reset,
  }
}

// 分页数据Hook
interface UsePaginatedDataOptions<T> extends UseDataOptions<T[]> {
  pageSize?: number
  initialPage?: number
}

interface UsePaginatedDataResult<T> extends UseDataResult<T[]> {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePaginatedData<T>(
  fetcher: (page: number, pageSize: number) => Promise<ApiResponse<T[]>>,
  options: UsePaginatedDataOptions<T> = {}
): UsePaginatedDataResult<T> {
  const { pageSize: initialPageSize = 10, initialPage = 1, ...dataOptions } = options
  
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const paginatedFetcher = useCallback(async () => {
    const response = await fetcher(page, pageSize)
    
    if (response.pagination) {
      setTotal(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    }
    
    return response
  }, [fetcher, page, pageSize])

  const dataResult = useData(paginatedFetcher, dataOptions)

  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1)
    }
  }, [hasPreviousPage])

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }, [totalPages])

  const handleSetPageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPage(1) // 重置到第一页
  }, [])

  return {
    ...dataResult,
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: handleSetPageSize,
  }
}

// 表单提交Hook
interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  showSuccessMessage?: boolean
  showErrorMessage?: boolean
  successMessage?: string
  resetOnSuccess?: boolean
}

interface UseFormSubmitResult<T> {
  submit: (data: any) => Promise<void>
  loading: boolean
  error: Error | null
  reset: () => void
}

export function useFormSubmit<T>(
  submitter: (data: any) => Promise<ApiResponse<T>>,
  options: UseFormSubmitOptions<T> = {}
): UseFormSubmitResult<T> {
  const {
    onSuccess,
    onError,
    showSuccessMessage = true,
    showErrorMessage = true,
    successMessage = '操作成功',
    resetOnSuccess = false,
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { showSuccess, showError } = useNotifications()

  const submit = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await submitter(data)
      
      if (showSuccessMessage) {
        showSuccess(successMessage)
      }
      
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      if (resetOnSuccess) {
        setError(null)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('提交失败')
      setError(error)
      
      if (showErrorMessage) {
        showError('操作失败', error.message)
      }
      
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }, [submitter, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage, resetOnSuccess, showSuccess, showError])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return {
    submit,
    loading,
    error,
    reset,
  }
}

// 导出所有Hooks
export { useData, usePaginatedData, useFormSubmit }
export type { UseDataOptions, UseDataResult, UsePaginatedDataOptions, UsePaginatedDataResult, UseFormSubmitOptions, UseFormSubmitResult }
