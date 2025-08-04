'use client'

import { useEffect } from 'react'

export default function CacheManager() {
  useEffect(() => {
    // 检测ChunkLoadError并自动处理
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      if (error && (
        error.name === 'ChunkLoadError' ||
        error.message?.includes('Loading chunk') ||
        error.message?.includes('Loading CSS chunk') ||
        error.message?.includes('Failed to fetch')
      )) {
        console.warn('检测到资源加载错误，正在清理缓存并重新加载...', error)
        
        // 清理各种缓存
        clearAllCaches().then(() => {
          // 延迟刷新，避免立即刷新导致的循环
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    }

    // 监听全局错误
    window.addEventListener('error', handleChunkError)
    
    // 监听未处理的Promise拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      
      if (reason && typeof reason === 'object' && (
        reason.name === 'ChunkLoadError' ||
        (typeof reason.message === 'string' && (
          reason.message.includes('Loading chunk') ||
          reason.message.includes('Loading CSS chunk') ||
          reason.message.includes('Failed to fetch')
        ))
      )) {
        console.warn('检测到Promise拒绝的资源加载错误，正在处理...', reason)
        event.preventDefault() // 防止错误被抛到控制台
        
        clearAllCaches().then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // 清理函数
    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null // 这个组件不渲染任何内容
}

// 清理所有缓存的函数
async function clearAllCaches() {
  try {
    // 1. 清理Service Worker缓存
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('已清理Service Worker缓存')
    }

    // 2. 清理localStorage
    if (typeof Storage !== 'undefined') {
      // 保留重要的用户数据，只清理可能导致问题的缓存
      const keysToKeep = ['auth-token', 'user-preferences', 'session-data']
      const allKeys = Object.keys(localStorage)
      
      allKeys.forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key)
        }
      })
      console.log('已清理localStorage缓存')
    }

    // 3. 清理sessionStorage
    if (typeof Storage !== 'undefined') {
      // 保留当前会话的重要数据
      const sessionKeysToKeep = ['current-page', 'form-data']
      const allSessionKeys = Object.keys(sessionStorage)
      
      allSessionKeys.forEach(key => {
        if (!sessionKeysToKeep.some(keepKey => key.includes(keepKey))) {
          sessionStorage.removeItem(key)
        }
      })
      console.log('已清理sessionStorage缓存')
    }

    // 4. 清理IndexedDB（如果使用）
    if ('indexedDB' in window) {
      // 这里可以添加特定的IndexedDB清理逻辑
      console.log('IndexedDB清理已跳过（保留用户数据）')
    }

  } catch (error) {
    console.error('清理缓存时出错:', error)
  }
}

// 导出清理函数供其他组件使用
export { clearAllCaches }
