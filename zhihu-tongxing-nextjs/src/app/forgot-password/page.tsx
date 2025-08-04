'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/Input'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, always succeed
      setIsSubmitted(true)
    } catch (error) {
      setError('发送失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">邮件已发送</h2>
            <p className="text-gray-600 mb-6">
              我们已向 <strong>{email}</strong> 发送了密码重置链接
            </p>
          </div>

          <Card>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">接下来的步骤：</h3>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>检查您的邮箱（包括垃圾邮件文件夹）</li>
                    <li>点击邮件中的重置密码链接</li>
                    <li>设置新密码并确认</li>
                    <li>使用新密码登录账户</li>
                  </ol>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    没有收到邮件？
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail('')
                      }}
                      className="w-full"
                    >
                      重新发送
                    </Button>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回登录
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              如果您持续遇到问题，请联系我们的客服团队
            </p>
            <p className="text-sm text-teal-600 mt-1">
              support@zhihutongxing.com | 400-123-4567
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">忘记密码</h2>
          <p className="text-gray-600">
            输入您的邮箱地址，我们将发送密码重置链接给您
          </p>
        </div>

        {/* Form */}
        <Card>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱地址"
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    发送中...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    发送重置链接
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回登录页面
          </Link>
        </div>

        {/* Help */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">需要帮助？</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 确保输入的邮箱地址正确</p>
            <p>• 检查垃圾邮件文件夹</p>
            <p>• 重置链接有效期为24小时</p>
            <p>• 如果仍有问题，请联系客服</p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            遇到问题？联系我们：
            <a href="mailto:support@zhihutongxing.com" className="text-teal-600 hover:text-teal-700 ml-1">
              support@zhihutongxing.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
