'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin panel error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="relative">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-2" />
            <AlertTriangle className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            管理面板错误
          </h1>
          <p className="text-gray-600">
            管理面板遇到了错误。这可能是由于权限问题、数据加载失败或系统故障导致的。
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              管理面板错误详情 (开发模式):
            </h3>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重试
          </button>
          
          <Link
            href="/admin"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            返回管理首页
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            返回网站首页
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            可能的解决方案：
          </h3>
          <ul className="text-xs text-gray-600 text-left space-y-1">
            <li>• 检查您的管理员权限是否有效</li>
            <li>• 确认网络连接正常</li>
            <li>• 尝试重新登录管理账户</li>
            <li>• 清除浏览器缓存后重试</li>
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            如需技术支持，请联系系统管理员
          </p>
          <p className="text-xs text-gray-400 mt-1">
            admin@zhihutongxing.com
          </p>
        </div>
      </div>
    </div>
  )
}
