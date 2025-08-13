'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Video,
  Users,
  BarChart3
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function KnowledgeManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('articles')
  const [stats, setStats] = useState([
    { label: '知识文章', value: '0', icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { label: '视频资源', value: '0', icon: Video, color: 'bg-purple-100 text-purple-600' },
    { label: '总浏览量', value: '0', icon: Eye, color: 'bg-green-100 text-green-600' },
    { label: '活跃用户', value: '0', icon: Users, color: 'bg-orange-100 text-orange-600' }
  ])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState('')

  // 从API获取统计数据
  useEffect(() => {
    if (adminUser) {
      fetchStats()
    }
  }, [adminUser])

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch('/api/admin/knowledge/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data.stats)
        } else {
          setStatsError(data.error || '获取统计数据失败')
        }
      } else {
        setStatsError('获取统计数据失败')
      }
    } catch (err) {
      console.error('Error fetching knowledge stats:', err)
      setStatsError('网络错误，请稍后重试')
    } finally {
      setIsLoadingStats(false)
    }
  }

  const quickActions = [
    {
      title: '创建新文章',
      description: '添加新的知识科普文章',
      href: '/admin/articles/new',
      icon: Plus,
      color: 'bg-blue-500'
    },
    {
      title: '管理文章',
      description: '查看和编辑现有文章',
      href: '/admin/articles',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: '管理视频',
      description: '上传和管理视频资源',
      href: '/admin/videos',
      icon: Video,
      color: 'bg-purple-500'
    },
    {
      title: '内容分析',
      description: '查看内容表现数据',
      href: '/admin/knowledge/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ]

  const categories = [
    { id: 'life', name: '生活照护', count: 45, color: 'bg-pink-100 text-pink-800' },
    { id: 'psychology', name: '心理健康', count: 38, color: 'bg-blue-100 text-blue-800' },
    { id: 'safety', name: '安全防护', count: 42, color: 'bg-red-100 text-red-800' },
    { id: 'education', name: '教育指导', count: 31, color: 'bg-green-100 text-green-800' }
  ]

  if (loading || isLoadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">加载失败</p>
          <p className="text-gray-600 mb-4">{statsError}</p>
          <Button onClick={() => fetchStats()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
              <BookOpen className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">知识内容管理 - 科学照护知识科普馆</h1>
            </div>
            <Link href="/admin/articles/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建新内容
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <Link href={action.href}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${action.color} rounded-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            </Card>
          ))}
        </div>

        {/* Content Categories */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">内容分类概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.color}`}>
                    {category.count}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>文章数量</span>
                  <Link href={`/admin/articles?category=${category.id}`} className="text-blue-600 hover:text-blue-800">
                    查看详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">最新文章</h2>
              <Link href="/admin/articles">
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: '家庭安全隐患排查清单', category: '安全防护', status: '已发布', date: '2025-01-15' },
                { title: '儿童营养均衡饮食指南', category: '生活照护', status: '已发布', date: '2025-01-10' },
                { title: '亲子沟通技巧大全', category: '心理健康', status: '草稿', date: '2025-01-08' }
              ].map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-600">{article.category} • {article.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    article.status === '已发布' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Videos */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">最新视频</h2>
              <Link href="/admin/videos">
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: '客厅安全检查演示', category: '安全防护', duration: '5:30', date: '2025-01-12' },
                { title: '婴儿辅食制作指南', category: '生活照护', duration: '8:15', date: '2025-01-09' },
                { title: '儿童情绪管理技巧', category: '心理健康', duration: '6:45', date: '2025-01-06' }
              ].map((video, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-gray-300 rounded mr-3 flex items-center justify-center">
                      <Video className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-600">{video.category} • {video.duration}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{video.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
