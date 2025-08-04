/**
 * 页面标题组件
 * 提供统一的页面标题样式和布局
 */

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  backUrl?: string
  backText?: string
  actions?: ReactNode
}

export default function PageHeader({
  title,
  description,
  children,
  className,
  backUrl,
  backText = '返回',
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {/* 返回链接 */}
      {backUrl && (
        <div className="mb-4">
          <Link
            href={backUrl}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {backText}
          </Link>
        </div>
      )}

      {/* 标题区域 */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        {/* 操作按钮区域 */}
        {actions && (
          <div className="flex-shrink-0 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
