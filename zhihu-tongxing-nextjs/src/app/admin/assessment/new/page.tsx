'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { ArrowLeft, Save, Eye } from 'lucide-react'

export default function NewAssessmentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'behavior',
    description: '',
    ageRange: '',
    questions: '',
    category: 'behavior',
    difficulty: 'medium',
    estimatedTime: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-admin-token'
        },
        body: JSON.stringify({
          ...formData,
          questions: parseInt(formData.questions) || 0
        })
      })

      if (response.ok) {
        router.push('/admin/assessment')
      } else {
        console.error('Failed to create assessment')
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/assessment">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回评估管理
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">创建新评估工具</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                预览
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评估工具名称 *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入评估工具名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评估类型 *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="behavior">行为评估</option>
                  <option value="parenting">教养方式</option>
                  <option value="development">发展评估</option>
                  <option value="environment">环境评估</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  适用年龄范围
                </label>
                <Input
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  placeholder="例如：3-16岁"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  题目数量
                </label>
                <Input
                  name="questions"
                  type="number"
                  value={formData.questions}
                  onChange={handleInputChange}
                  placeholder="请输入题目数量"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  难度等级
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">简单</option>
                  <option value="medium">中等</option>
                  <option value="high">困难</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预计完成时间
                </label>
                <Input
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="例如：10-15分钟"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评估描述 *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请详细描述该评估工具的用途、特点和适用场景"
                required
              />
            </div>
          </Card>

          {/* Assessment Configuration */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">评估配置</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">评估题目设置</h3>
                <p className="text-sm text-blue-700">
                  保存基本信息后，您可以继续添加具体的评估题目、选项和评分标准。
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm font-medium text-green-900 mb-2">结果解读设置</h3>
                <p className="text-sm text-green-700">
                  配置评估结果的解读标准、建议和后续指导方案。
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-900 mb-2">权限设置</h3>
                <p className="text-sm text-yellow-700">
                  设置评估工具的使用权限、可见性和数据隐私保护级别。
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/assessment">
              <Button variant="outline">
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '创建中...' : '创建评估工具'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
