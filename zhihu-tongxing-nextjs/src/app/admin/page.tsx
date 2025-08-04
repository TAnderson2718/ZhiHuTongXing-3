'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // 支持用户名到邮箱的映射
      let loginEmail = formData.username

      // 如果输入的是用户名 "admin"，映射到对应的邮箱地址
      if (formData.username.toLowerCase() === 'admin') {
        loginEmail = 'admin@zhihutongxing.com'
      }

      // 如果输入的不包含@符号，假设是用户名，尝试添加默认域名
      if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail}@zhihutongxing.com`
      }

      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        // 验证是否为管理员
        if (data.data.role !== 'admin') {
          setError('权限不足，只有管理员可以访问')
          return
        }

        // 清除旧的localStorage数据（如果存在）
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')

        // 显示成功消息并跳转
        console.log('登录成功，正在跳转到管理后台...')

        // 跳转到管理员仪表板
        router.push('/admin/dashboard')
      } else {
        setError(data.error || '登录失败，请重试')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理员登录</h1>
          <p className="text-gray-600">智护童行 - 内容管理系统</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="pl-10"
                  placeholder="请输入管理员用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                  title={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  正在登录...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  登录
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">管理员账户信息：</p>
              <p className="text-xs text-gray-500">用户名: admin</p>
              <p className="text-xs text-gray-500">请使用您设置的管理员密码登录</p>
              <p className="text-xs text-blue-500 mt-2">💡 如忘记密码，请联系系统管理员</p>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2025 智护童行. 保留所有权利.
          </p>
        </div>
      </div>
    </div>
  )
}
