'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { ArrowLeft, Edit, Play, Users, Clock, BarChart3, Loader2 } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function PreviewAssessmentPage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const params = useParams()
  const assessmentId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [assessment, setAssessment] = useState<any>(null)

  // Mock assessment data - in real app this would come from API
  const mockAssessments = {
    '1': {
      id: '1',
      name: 'SDQ行为评估量表',
      type: 'behavior',
      description: '儿童行为问题筛查量表，适用于3-16岁儿童',
      ageRange: '3-16岁',
      questions: 25,
      completions: 1250,
      status: 'active',
      lastUpdated: '2025-01-15',
      difficulty: 'medium',
      estimatedTime: '15-20分钟',
      category: 'behavior',
      averageScore: 78,
      completionRate: 92
    },
    '2': {
      id: '2',
      name: 'EMBU教养方式评估',
      type: 'parenting',
      description: '评估父母教养方式对儿童发展的影响',
      ageRange: '6-18岁',
      questions: 81,
      completions: 890,
      status: 'active',
      lastUpdated: '2025-01-10',
      difficulty: 'hard',
      estimatedTime: '25-30分钟',
      category: 'parenting',
      averageScore: 85,
      completionRate: 88
    },
    '3': {
      id: '3',
      name: '儿童发展里程碑评估',
      type: 'development',
      description: '评估儿童在各个发展阶段的能力表现',
      ageRange: '0-6岁',
      questions: 45,
      completions: 2100,
      status: 'active',
      lastUpdated: '2025-01-08',
      difficulty: 'medium',
      estimatedTime: '20-25分钟',
      category: 'development',
      averageScore: 82,
      completionRate: 95
    },
    '4': {
      id: '4',
      name: '家庭环境评估量表',
      type: 'environment',
      description: '评估家庭环境对儿童成长的影响因素',
      ageRange: '全年龄',
      questions: 32,
      completions: 567,
      status: 'draft',
      lastUpdated: '2025-01-05',
      difficulty: 'easy',
      estimatedTime: '10-15分钟',
      category: 'environment',
      averageScore: 76,
      completionRate: 90
    }
  }

  useEffect(() => {
    // 只有在用户认证完成后才获取评估数据
    if (adminUser) {
      // Load assessment data
      const loadAssessmentData = () => {
        setIsLoading(true)

        // Simulate API call delay
        setTimeout(() => {
          const assessmentData = mockAssessments[assessmentId as keyof typeof mockAssessments]

          if (assessmentData) {
            setAssessment(assessmentData)
          }
          setIsLoading(false)
        }, 1000)
      }

      loadAssessmentData()
    }
  }, [adminUser, assessmentId])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: '启用', className: 'bg-green-100 text-green-800' },
      draft: { label: '草稿', className: 'bg-yellow-100 text-yellow-800' },
      archived: { label: '归档', className: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      behavior: { label: '行为评估', className: 'bg-blue-100 text-blue-800' },
      parenting: { label: '教养方式', className: 'bg-purple-100 text-purple-800' },
      development: { label: '发展评估', className: 'bg-green-100 text-green-800' },
      environment: { label: '环境评估', className: 'bg-orange-100 text-orange-800' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.behavior
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      easy: { label: '简单', className: 'bg-green-100 text-green-800' },
      medium: { label: '中等', className: 'bg-yellow-100 text-yellow-800' },
      hard: { label: '困难', className: 'bg-red-100 text-red-800' }
    }
    
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (authLoading || !adminUser || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{authLoading || !adminUser ? '验证登录状态...' : '加载评估工具预览...'}</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">评估工具不存在</p>
          <Button asChild variant="outline">
            <Link href="/admin/assessment">
              返回评估管理
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button asChild variant="outline" size="sm" className="mr-4">
                <Link href="/admin/assessment">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回评估管理
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">评估工具预览</h1>
                <p className="text-gray-600">查看评估工具的详细信息和统计数据</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/admin/assessment/edit/${assessmentId}`}>
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{assessment.name}</h2>
                <div className="flex items-center space-x-2 mb-4">
                  {getTypeBadge(assessment.type)}
                  {getDifficultyBadge(assessment.difficulty)}
                  {getStatusBadge(assessment.status)}
                </div>
                <p className="text-gray-600">{assessment.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{assessment.completions}</div>
                <div className="text-sm text-gray-600">完成次数</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{assessment.estimatedTime}</div>
                <div className="text-sm text-gray-600">预计用时</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{assessment.completionRate}%</div>
                <div className="text-sm text-gray-600">完成率</div>
              </div>
            </div>
          </Card>

          {/* Detailed Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">详细信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">适用年龄</label>
                <p className="text-gray-900">{assessment.ageRange}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">题目数量</label>
                <p className="text-gray-900">{assessment.questions} 题</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">平均得分</label>
                <p className="text-gray-900">{assessment.averageScore} 分</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最后更新</label>
                <p className="text-gray-900">{assessment.lastUpdated}</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/admin/assessment">
                返回列表
              </Link>
            </Button>
            
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href={`/assessment/${assessmentId}/info`}>
                  <Play className="w-4 h-4 mr-2" />
                  体验评估
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/assessment/edit/${assessmentId}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑工具
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
