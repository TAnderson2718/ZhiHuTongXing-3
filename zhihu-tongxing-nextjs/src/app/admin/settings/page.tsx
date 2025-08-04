'use client'

import { useState } from 'react'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  Settings,
  Save,
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Server,
  Key
} from 'lucide-react'

interface SystemSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportPhone: string
  address: string
  enableRegistration: boolean
  maxFileUploadSize: number
  sessionTimeout: number
  passwordMinLength: number
  maintenanceMode: boolean
  analyticsEnabled: boolean
  logRetentionDays: number
}

export default function AdminSettingsPage() {
  const { user } = useAdminAuth()
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: '智护童行',
    siteDescription: '专业的家庭教育与儿童照护平台，为每个家庭提供科学、专业的育儿指导和支持服务。',
    contactEmail: 'support@zhihutongxing.com',
    supportPhone: '400-123-4567',
    address: '北京市朝阳区智护大厦',
    enableRegistration: true,
    maxFileUploadSize: 10,
    sessionTimeout: 30,
    passwordMinLength: 6,
    maintenanceMode: false,
    analyticsEnabled: true,
    logRetentionDays: 30
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 记录操作日志
      if (user) {
        await fetch('/api/admin/operation-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            operationType: 'SETTINGS_UPDATE',
            operationDescription: '更新系统设置',
            targetResource: 'system-settings',
            result: 'SUCCESS',
            metadata: {
              updatedSettings: Object.keys(settings)
            }
          })
        })
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('设置已保存成功！')
    } catch (error) {
      // 记录失败的操作日志
      if (user) {
        await fetch('/api/admin/operation-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            operationType: 'SETTINGS_UPDATE',
            operationDescription: '更新系统设置失败',
            targetResource: 'system-settings',
            result: 'FAILURE',
            errorMessage: error instanceof Error ? error.message : '未知错误'
          })
        })
      }
      alert('保存失败，请重试。')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          </div>
          <p className="text-gray-600">配置系统参数和功能选项</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站名称
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="输入网站名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系邮箱
                  </label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="输入联系邮箱"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    客服电话
                  </label>
                  <Input
                    value={settings.supportPhone}
                    onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                    placeholder="输入客服电话"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司地址
                  </label>
                  <Input
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="输入公司地址"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站描述
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="输入网站描述"
                />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">用户管理</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">允许用户注册</h3>
                    <p className="text-sm text-gray-500">是否允许新用户注册账户</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableRegistration}
                      onChange={(e) => handleInputChange('enableRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      密码最小长度
                    </label>
                    <Input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会话超时时间（分钟）
                    </label>
                    <Input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Server className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">系统配置</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">维护模式</h3>
                    <p className="text-sm text-gray-500">启用后网站将显示维护页面</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">数据分析</h3>
                    <p className="text-sm text-gray-500">启用用户行为数据分析</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.analyticsEnabled}
                      onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      文件上传限制（MB）
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxFileUploadSize}
                      onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      日志保留天数
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.logRetentionDays}
                      onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white hover:bg-teal-700 h-10 py-2 px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
