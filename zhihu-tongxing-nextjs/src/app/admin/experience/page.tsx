'use client'

import { useState } from 'react'
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

export default function ExperienceManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const experienceContent = [
    {
      id: '1',
      title: '日常照护挑战',
      type: 'game',
      description: '通过模拟日常照护场景，提升实际操作技能',
      category: 'daily-care',
      difficulty: 'beginner',
      duration: '15-20分钟',
      completions: 2450,
      rating: 4.8,
      status: 'active',
      lastUpdated: '2025-01-15'
    },
    {
      id: '2',
      title: '情绪管理大冒险',
      type: 'game',
      description: '帮助孩子学习情绪识别和管理技巧',
      category: 'emotion',
      difficulty: 'intermediate',
      duration: '20-25分钟',
      completions: 1890,
      rating: 4.7,
      status: 'active',
      lastUpdated: '2025-01-12'
    },
    {
      id: '3',
      title: '安全小卫士',
      type: 'game',
      description: '通过互动游戏学习家庭和户外安全知识',
      category: 'safety',
      difficulty: 'beginner',
      duration: '10-15分钟',
      completions: 3200,
      rating: 4.9,
      status: 'active',
      lastUpdated: '2025-01-10'
    },
    {
      id: '4',
      title: '榜样力量',
      type: 'game',
      description: '通过角色扮演培养良好的行为习惯',
      category: 'behavior',
      difficulty: 'advanced',
      duration: '25-30分钟',
      completions: 1250,
      rating: 4.6,
      status: 'active',
      lastUpdated: '2025-01-08'
    },
    {
      id: '5',
      title: '亲子沟通训练营',
      type: 'tutorial',
      description: '提供亲子沟通的实用技巧和方法',
      category: 'communication',
      difficulty: 'intermediate',
      duration: '30-40分钟',
      completions: 980,
      rating: 4.5,
      status: 'draft',
      lastUpdated: '2025-01-05'
    }
  ]

  const stats = [
    { label: '体验内容', value: '24', icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
    { label: '总完成次数', value: '12,450', icon: Play, color: 'bg-blue-100 text-blue-600' },
    { label: '平均评分', value: '4.7', icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
    { label: '活跃用户', value: '3,280', icon: Users, color: 'bg-green-100 text-green-600' }
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

  const filteredContent = experienceContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || content.type === filterType
    return matchesSearch && matchesFilter
  })

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
            <span className="text-sm text-gray-500">共 {filteredContent.length} 个内容</span>
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
                {filteredContent.map((content) => (
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
