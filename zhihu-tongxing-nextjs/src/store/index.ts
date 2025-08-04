/**
 * 全局状态管理
 * 使用Zustand管理应用状态
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SessionUser } from '@/types'

// 用户状态接口
interface UserState {
  user: SessionUser | null
  isLoading: boolean
  setUser: (user: SessionUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

// 通知状态接口
interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// 通知类型
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  timestamp: number
  duration?: number
}

// UI状态接口
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

// 缓存状态接口
interface CacheState {
  cache: Record<string, {
    data: any
    timestamp: number
    ttl: number
  }>
  setCache: (key: string, data: any, ttl?: number) => void
  getCache: (key: string) => any | null
  clearCache: (key?: string) => void
  cleanupExpiredCache: () => void
}

// 创建用户状态store
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null }),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: 'user-store' }
  )
)

// 创建通知状态store
export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        const timestamp = Date.now()
        const newNotification: Notification = {
          id,
          timestamp,
          duration: 5000,
          ...notification,
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))

        // 自动移除通知
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'notification-store' }
  )
)

// 创建UI状态store
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarOpen: false,
        theme: 'light',
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: 'ui-store' }
  )
)

// 创建缓存状态store
export const useCacheStore = create<CacheState>()(
  devtools(
    (set, get) => ({
      cache: {},
      setCache: (key, data, ttl = 5 * 60 * 1000) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: {
              data,
              timestamp: Date.now(),
              ttl,
            },
          },
        }))
      },
      getCache: (key) => {
        const state = get()
        const entry = state.cache[key]
        
        if (!entry) return null
        
        const now = Date.now()
        if (now - entry.timestamp > entry.ttl) {
          // 缓存已过期，删除并返回null
          set((state) => {
            const newCache = { ...state.cache }
            delete newCache[key]
            return { cache: newCache }
          })
          return null
        }
        
        return entry.data
      },
      clearCache: (key) => {
        if (key) {
          set((state) => {
            const newCache = { ...state.cache }
            delete newCache[key]
            return { cache: newCache }
          })
        } else {
          set({ cache: {} })
        }
      },
      cleanupExpiredCache: () => {
        const state = get()
        const now = Date.now()
        const newCache: Record<string, any> = {}
        
        Object.entries(state.cache).forEach(([key, entry]) => {
          if (now - entry.timestamp <= entry.ttl) {
            newCache[key] = entry
          }
        })
        
        set({ cache: newCache })
      },
    }),
    { name: 'cache-store' }
  )
)

// 便捷的通知hooks
export const useNotifications = () => {
  const { addNotification, removeNotification, clearNotifications, notifications } = useNotificationStore()

  const showSuccess = (title: string, message?: string) => {
    addNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    addNotification({ type: 'error', title, message })
  }

  const showWarning = (title: string, message?: string) => {
    addNotification({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message?: string) => {
    addNotification({ type: 'info', title, message })
  }

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications,
  }
}

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    useCacheStore.getState().cleanupExpiredCache()
  }, 5 * 60 * 1000) // 每5分钟清理一次
}

// 导出类型
export type { Notification, UserState, NotificationState, UIState, CacheState }
