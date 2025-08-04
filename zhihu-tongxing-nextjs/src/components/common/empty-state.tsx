/**
 * 空状态组件
 * 用于显示无数据或空列表的状态
 */

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import Button from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'py-16',
    icon: 'w-20 h-20',
    title: 'text-2xl',
    description: 'text-lg',
  },
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  size = 'md',
}: EmptyStateProps) {
  const classes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        classes.container,
        className
      )}
    >
      {/* 图标 */}
      {Icon && (
        <div className="mb-4">
          <Icon className={cn(classes.icon, 'text-gray-400')} />
        </div>
      )}

      {/* 标题 */}
      <h3 className={cn('font-semibold text-gray-900 mb-2', classes.title)}>
        {title}
      </h3>

      {/* 描述 */}
      {description && (
        <p className={cn('text-gray-600 mb-6 max-w-md', classes.description)}>
          {description}
        </p>
      )}

      {/* 操作按钮 */}
      {action && (
        <div className="mb-4">
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        </div>
      )}

      {/* 自定义内容 */}
      {children && (
        <div className="w-full max-w-md">
          {children}
        </div>
      )}
    </div>
  )
}
