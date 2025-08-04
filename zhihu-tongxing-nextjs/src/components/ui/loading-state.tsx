import LoadingSpinner from './loading-spinner'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

export default function LoadingState({ 
  message = '加载中...', 
  size = 'md', 
  className,
  fullScreen = false 
}: LoadingStateProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 text-lg">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <div className="text-center">
        <LoadingSpinner size={size} className="mx-auto mb-3" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// 内联加载状态组件
export function InlineLoadingState({ 
  message = '加载中...', 
  className 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  )
}

// 按钮加载状态
export function ButtonLoadingState({ 
  children, 
  loading = false,
  className,
  ...props 
}: {
  children: React.ReactNode
  loading?: boolean
  className?: string
  [key: string]: any
}) {
  return (
    <button 
      className={cn(
        'relative disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}
