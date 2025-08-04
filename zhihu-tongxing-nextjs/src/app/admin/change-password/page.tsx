'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Key,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import {
  validatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  generatePasswordSuggestions,
  isPasswordCompromised
} from '@/lib/password-validation'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordValidation, setPasswordValidation] = useState({
    requirements: [],
    strength: 0,
    level: 'weak' as const,
    isValid: false,
    score: 0
  })

  useEffect(() => {
    // 检查管理员登录状态
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (!data.success || !data.data || data.data.role !== 'admin') {
          router.push('/admin')
          return
        }
        
        setAdminUser(data.data)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin')
      }
    }
    
    checkAuth()
  }, [router])

  // 监听新密码变化，实时验证强度
  useEffect(() => {
    if (formData.newPassword) {
      const validation = validatePasswordStrength(formData.newPassword)
      setPasswordValidation(validation)
    } else {
      setPasswordValidation({ requirements: [], strength: 0, level: 'weak', isValid: false, score: 0 })
    }
  }, [formData.newPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // 验证表单
      if (!formData.currentPassword) {
        setError('请输入当前密码')
        return
      }

      if (!formData.newPassword) {
        setError('请输入新密码')
        return
      }

      if (!passwordValidation.isValid) {
        setError('新密码不符合安全要求')
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('新密码和确认密码不匹配')
        return
      }

      if (formData.currentPassword === formData.newPassword) {
        setError('新密码不能与当前密码相同')
        return
      }

      // 检查密码是否在泄露数据库中
      if (isPasswordCompromised(formData.newPassword)) {
        setError('此密码已在数据泄露中被发现，请选择其他密码')
        return
      }

      // 调用密码修改API
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('密码修改成功！系统将在3秒后自动跳转到登录页面...')
        
        // 清空表单
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/admin')
        }, 3000)
      } else {
        setError(data.error || '密码修改失败，请重试')
      }
    } catch (err) {
      console.error('Change password error:', err)
      setError('密码修改失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }



  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">验证登录状态...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <Key className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">修改管理员密码</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">欢迎，{adminUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">安全密码修改</h2>
            </div>
            <p className="text-sm text-gray-600">
              为了保护您的账户安全，请定期更新密码。新密码必须符合安全要求。
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 当前密码 */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                当前密码 *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="请输入当前密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 新密码 */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                新密码 *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="请输入新密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 密码强度指示器 */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">密码强度:</span>
                  <span className={`text-sm font-medium ${
                    passwordValidation.level === 'weak' ? 'text-red-600' :
                    passwordValidation.level === 'medium' ? 'text-yellow-600' :
                    passwordValidation.level === 'strong' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText(passwordValidation.level)} ({passwordValidation.score}/100)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordValidation.level)}`}
                    style={{ width: `${passwordValidation.strength * 100}%` }}
                  ></div>
                </div>
                <div className="mt-3 space-y-1">
                  {passwordValidation.requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.test ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                      )}
                      <span className={req.test ? 'text-green-600' : 'text-red-600'}>
                        {req.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 确认新密码 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                确认新密码 *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="请再次输入新密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  密码不匹配
                </p>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  密码匹配
                </p>
              )}
            </div>

            {/* 密码安全建议 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-2">密码安全建议</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {generatePasswordSuggestions().slice(0, 6).map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">重要提醒</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 密码修改成功后，您需要重新登录</li>
                    <li>• 请确保新密码的安全性，不要与其他网站密码相同</li>
                    <li>• 建议定期更换密码以保护账户安全</li>
                    <li>• 请妥善保管新密码，避免泄露给他人</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isLoading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    修改中...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    修改密码
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
