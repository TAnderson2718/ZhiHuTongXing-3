/**
 * 通知提供者组件
 * 显示全局通知消息
 */

'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNotificationStore } from '@/store'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// 通知图标映射
const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

// 通知颜色映射
const notificationColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-800',
    message: 'text-green-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    message: 'text-red-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    message: 'text-blue-700',
  },
}

// 单个通知组件
function NotificationItem({ notification }: { notification: any }) {
  const { removeNotification } = useNotificationStore()
  const Icon = notificationIcons[notification.type]
  const colors = notificationColors[notification.type]

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)

      return () => clearTimeout(timer)
    }
  }, [notification.id, notification.duration, removeNotification])

  return (
    <div
      className={cn(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out',
        colors.bg,
        colors.border
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={cn('text-sm font-medium', colors.title)}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={cn('mt-1 text-sm', colors.message)}>
                {notification.message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={cn(
                'rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                colors.message
              )}
              onClick={() => removeNotification(notification.id)}
            >
              <span className="sr-only">关闭</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 通知容器组件
function NotificationContainer() {
  const { notifications } = useNotificationStore()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

// 通知提供者组件
export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(<NotificationContainer />, document.body)}
    </>
  )
}

// 便捷的通知Hook
export function useToast() {
  const { addNotification } = useNotificationStore()

  const toast = {
    success: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'success', title, message, duration })
    },
    error: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'error', title, message, duration })
    },
    warning: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'warning', title, message, duration })
    },
    info: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'info', title, message, duration })
    },
  }

  return toast
}
