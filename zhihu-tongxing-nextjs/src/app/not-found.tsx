'use client'

'use client'

import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'


export default function NotFound() {


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FileQuestion className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600">
            很抱歉，您访问的页面不存在或已被移动。请检查网址是否正确，或返回首页继续浏览。
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上一页
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            您可能在寻找：
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Link
              href="/assessment"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              能力评估
            </Link>
            <Link
              href="/knowledge"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              知识科普
            </Link>
            <Link
              href="/experience"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              情境体验
            </Link>
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              专业支持
            </Link>
            <Link
              href="/training"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              课程培训
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            需要帮助？联系我们的客服团队
          </p>
          <p className="text-xs text-gray-400 mt-1">
            support@zhihutongxing.com | 400-123-4567
          </p>
        </div>
      </div>
    </div>
  )
}
