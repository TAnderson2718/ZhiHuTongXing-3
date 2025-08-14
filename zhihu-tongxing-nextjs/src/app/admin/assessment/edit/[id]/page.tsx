'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { ArrowLeft, Save, Eye, Loader2, Edit3 } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function EditAssessmentPage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    type: 'behavior',
    description: '',
    ageRange: '',
    questions: '',
    category: 'behavior',
    difficulty: 'medium',
    estimatedTime: '',
    status: 'active'
  })

  // Mock assessment data - in real app this would come from API
  const mockAssessments = {
    '1': {
      id: '1',
      name: 'SDQ行为评估量表',
      type: 'behavior',
      description: '儿童行为问题筛查量表，适用于3-16岁儿童',
      ageRange: '3-16岁',
      questions: '25',
      category: 'behavior',
      difficulty: 'medium',
      estimatedTime: '15-20分钟',
      status: 'active'
    },
    '2': {
      id: '2',
      name: 'EMBU教养方式评估',
      type: 'parenting',
      description: '评估父母教养方式对儿童发展的影响',
      ageRange: '6-18岁',
      questions: '81',
      category: 'parenting',
      difficulty: 'hard',
      estimatedTime: '25-30分钟',
      status: 'active'
    },
    '3': {
      id: '3',
      name: '儿童发展里程碑评估',
      type: 'development',
      description: '评估儿童在各个发展阶段的能力表现',
      ageRange: '0-6岁',
      questions: '45',
      category: 'development',
      difficulty: 'medium',
      estimatedTime: '20-25分钟',
      status: 'active'
    },
    '4': {
      id: '4',
      name: '家庭环境评估量表',
      type: 'environment',
      description: '评估家庭环境对儿童成长的影响因素',
      ageRange: '全年龄',
      questions: '32',
      category: 'environment',
      difficulty: 'easy',
      estimatedTime: '10-15分钟',
      status: 'draft'
    }
  }

  useEffect(() => {
    // 只有在用户认证完成后才获取评估数据
    if (adminUser) {
      // Load assessment data
      const loadAssessmentData = async () => {
        setIsLoadingData(true)

        try {
          const response = await fetch(`/api/admin/assessments?limit=100`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const data = await response.json()
            const assessment = data.assessments?.find((a: any) => a.id === assessmentId)

            if (assessment) {
              setFormData({
                name: assessment.name,
                type: assessment.type,
                description: assessment.description,
                ageRange: assessment.ageRange,
                questions: assessment.questions,
                category: assessment.category,
                difficulty: assessment.difficulty,
                estimatedTime: assessment.estimatedTime,
                status: assessment.status
              })
            } else {
              console.error('Assessment not found')
            }
          } else {
            console.error('Failed to fetch assessment data')
          }
        } catch (error) {
          console.error('Error loading assessment data:', error)
        } finally {
          setIsLoadingData(false)
        }
      }

      loadAssessmentData()
    }
  }, [adminUser, assessmentId])

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: assessmentId,
          ...formData
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Assessment updated successfully:', result)
        // Redirect back to assessment list
        router.push('/admin/assessment')
      } else {
        const error = await response.json()
        console.error('Error updating assessment:', error)
        alert(error.error || '更新失败，请重试')
      }
    } catch (error) {
      console.error('Error updating assessment:', error)
      alert('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Navigate to preview page
    router.push(`/admin/assessment/preview/${assessmentId}`)
  }

  if (authLoading || !adminUser || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{authLoading || !adminUser ? '验证登录状态...' : '加载评估工具数据...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button asChild variant="outline" size="sm" className="mr-4">
              <Link href="/admin/assessment">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回评估管理
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">编辑评估工具</h1>
              <p className="text-gray-600">修改评估工具的基本信息和配置</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  评估工具名称 *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入评估工具名称"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  评估类型 *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="behavior">行为评估</option>
                  <option value="parenting">教养方式</option>
                  <option value="development">发展评估</option>
                  <option value="environment">环境评估</option>
                </select>
              </div>

              <div>
                <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
                  适用年龄 *
                </label>
                <Input
                  id="ageRange"
                  name="ageRange"
                  type="text"
                  required
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  placeholder="例如：3-16岁"
                />
              </div>

              <div>
                <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-2">
                  题目数量 *
                </label>
                <Input
                  id="questions"
                  name="questions"
                  type="number"
                  required
                  value={formData.questions}
                  onChange={handleInputChange}
                  placeholder="请输入题目数量"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  难度等级
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>

              <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
                  预计用时
                </label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="例如：15-20分钟"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                评估描述 *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入评估工具的详细描述"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">启用</option>
                <option value="draft">草稿</option>
                <option value="archived">归档</option>
              </select>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                预览
              </Button>
              <Button asChild variant="outline" className="flex items-center">
                <Link href={`/admin/assessment/edit/${assessmentId}/questions`}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  编辑题目
                </Link>
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href="/admin/assessment">
                  取消
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? '保存中...' : '保存修改'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
