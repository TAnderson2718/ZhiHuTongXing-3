'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Play,
  BookOpen,
  Users,
  BarChart3,
  Trophy,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'

// 定义统计数据类型
interface ExperienceStat {
  label: string
  value: string
  icon: string
  color: string
}

export default function ExperienceManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [stats, setStats] = useState<ExperienceStat[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState('')
  const [experiences, setExperiences] = useState<any[]>([])
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // 从API获取体验统计数据和体验内容
  useEffect(() => {
    if (adminUser) {
      fetchExperienceStats()
      fetchExperiences()
    }
  }, [adminUser])

  // 当搜索或筛选条件改变时重新获取数据
  useEffect(() => {
    if (adminUser) {
      fetchExperiences()
    }
  }, [searchQuery, filterType, adminUser])

  const fetchExperienceStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch('/api/admin/experience/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data.stats || [])
        } else {
          setError(data.error || '获取体验统计数据失败')
        }
      } else {
        setError('获取体验统计数据失败')
      }
    } catch (err) {
      console.error('Error fetching experience stats:', err)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchExperiences = async () => {
    try {
      setIsLoadingExperiences(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (filterType && filterType !== 'all') {
        params.append('type', filterType)
      }

      const response = await fetch(`/api/admin/experiences?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setExperiences(data.experiences || [])
        setPagination(data.pagination || pagination)
      } else {
        setError('获取体验内容失败')
      }
    } catch (err) {
      console.error('Error fetching experiences:', err)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoadingExperiences(false)
    }
  }

  // 删除硬编码数据，改为从API获取 // 保留作为后备数据

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
    const typeMap = {
      game: { label: '互动游戏', color: 'bg-purple-100 text-purple-800', icon: Gamepad2 },
      tutorial: { label: '教程指导', color: 'bg-blue-100 text-blue-800', icon: BookOpen }
    }
    const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-100 text-gray-800', icon: Play }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color} flex items-center`}>
        <typeInfo.icon className="w-3 h-3 mr-1" />
        {typeInfo.label}
      </span>
    )
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyMap = {
      beginner: { label: '初级', color: 'bg-green-100 text-green-800' },
      intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: '高级', color: 'bg-red-100 text-red-800' }
    }
    const difficultyInfo = difficultyMap[difficulty as keyof typeof difficultyMap] || { label: difficulty, color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyInfo.color}`}>{difficultyInfo.label}</span>
  }

  // 筛选逻辑已移至API端，直接使用experiences数据

  if (loading || !adminUser) {
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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回仪表板
                </Button>
              </Link>
              <Gamepad2 className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">体验内容管理 - 虚拟照护情境体验馆</h1>
            </div>
            <Link href="/admin/experience/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建体验内容
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
                  placeholder="搜索体验内容..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">全部类型</option>
                <option value="game">互动游戏</option>
                <option value="tutorial">教程指导</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Experience Content List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">体验内容列表</h2>
            <span className="text-sm text-gray-500">共 {pagination.total} 个内容</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    难度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时长
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    完成次数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评分
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
                {isLoadingExperiences ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      加载中...
                    </td>
                  </tr>
                ) : experiences.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      暂无体验内容
                    </td>
                  </tr>
                ) : experiences.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500">{content.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(content.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDifficultyBadge(content.difficulty)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {content.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.completions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                        {content.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(content.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/experience/edit/${content.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/experience/preview/${content.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
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
