'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Users,
  BarChart3
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'

// 定义评估工具类型
interface AssessmentTool {
  id: string
  name: string
  type: string
  description: string
  ageRange: string
  questions: number
  completions: number
  status: string
  lastUpdated: string
  category?: string
  difficulty?: string
  estimatedTime?: string
}

export default function AssessmentManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [assessmentTools, setAssessmentTools] = useState<AssessmentTool[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')

  // 从API获取评估工具列表
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoadingData(true)
        const response = await fetch('/api/admin/assessments', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          // API返回格式：{ assessments: [...], pagination: {...} }
          if (data.assessments) {
            setAssessmentTools(data.assessments || [])
          } else if (data.success && data.data?.assessments) {
            // 备用格式支持
            setAssessmentTools(data.data.assessments || [])
          } else {
            setError(data.error || '获取评估工具列表失败')
          }
        } else {
          setError('获取评估工具列表失败')
        }
      } catch (err) {
        console.error('Error fetching assessments:', err)
        setError('网络错误，请稍后重试')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (adminUser) {
      fetchAssessments()
    }
  }, [adminUser])

  const stats = [
    { label: '评估工具', value: '4', icon: ClipboardList, color: 'bg-blue-100 text-blue-600' },
    { label: '总完成次数', value: '4,890', icon: BarChart3, color: 'bg-green-100 text-green-600' },
    { label: '活跃用户', value: '1,250', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: '平均完成率', value: '87%', icon: Eye, color: 'bg-orange-100 text-orange-600' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">已发布</span>
      case 'draft':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">草稿</span>
      case 'archived':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">已归档</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">未知</span>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      behavior: { label: '行为评估', color: 'bg-blue-100 text-blue-800' },
      parenting: { label: '教养方式', color: 'bg-purple-100 text-purple-800' },
      development: { label: '发展评估', color: 'bg-green-100 text-green-800' },
      environment: { label: '环境评估', color: 'bg-orange-100 text-orange-800' },
      relationship: { label: '关系评估', color: 'bg-pink-100 text-pink-800' },
      'self-efficacy': { label: '自我效能', color: 'bg-indigo-100 text-indigo-800' },
      competence: { label: '能力评估', color: 'bg-teal-100 text-teal-800' },
      caregiving: { label: '照护评估', color: 'bg-yellow-100 text-yellow-800' }
    }
    const typeInfo = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
  }

  const filteredTools = assessmentTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || tool.type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">加载失败</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            重新加载
          </Button>
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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回仪表板
                </Button>
              </Link>
              <ClipboardList className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">评估管理 - 能力评估与成长记录馆</h1>
            </div>
            <Link href="/admin/assessment/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建评估工具
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="搜索评估工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="behavior">行为评估</option>
                <option value="parenting">教养方式</option>
                <option value="development">发展评估</option>
                <option value="environment">环境评估</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Assessment Tools List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">评估工具列表</h2>
            <span className="text-sm text-gray-500">共 {filteredTools.length} 个工具</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评估工具
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    适用年龄
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    题目数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    完成次数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(tool.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tool.ageRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tool.questions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tool.completions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tool.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/assessment/edit/${tool.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/assessment/preview/${tool.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
