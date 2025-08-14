'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Video,
  Users,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Eye,
  ClipboardList,
  BookOpen,
  Gamepad2,
  HeadphonesIcon,
  GraduationCap,
  Key,
  Activity
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalVideos: 0,
    totalViews: 0,
    totalUsers: 0,
    totalAssessments: 0,
    activeUsers: 0,
    completedAssessments: 0,
    averageRating: 0,
    growthRate: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState('')

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
        // 获取统计数据
        fetchStats()
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin')
      }
    }

    checkAuth()
  }, [router])

  // 获取仪表板统计数据
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch('/api/admin/dashboard/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        } else {
          setStatsError(data.error || '获取统计数据失败')
        }
      } else {
        setStatsError('获取统计数据失败')
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      setStatsError('网络错误，请稍后重试')
    } finally {
      setIsLoadingStats(false)
    }
  }


  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 清除任何旧的localStorage数据（如果存在）
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      router.push('/admin')
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
              <LayoutDashboard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">智护童行管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">欢迎，{adminUser.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总文章数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总视频数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总浏览量</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">注册用户</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Five Halls Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">五大功能馆管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assessment Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">评估管理</h3>
                  <p className="text-sm text-gray-600">能力评估与成长记录馆</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/assessment">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    管理评估工具
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Knowledge Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">知识内容管理</h3>
                  <p className="text-sm text-gray-600">科学照护知识科普馆</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/knowledge">
                    <BookOpen className="w-4 h-4 mr-2" />
                    管理知识文章
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/videos">
                    <Video className="w-4 h-4 mr-2" />
                    管理视频资源
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Experience Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">体验内容管理</h3>
                  <p className="text-sm text-gray-600">虚拟照护情境体验馆</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/experience">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    管理体验游戏
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Support Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <HeadphonesIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">支持服务管理</h3>
                  <p className="text-sm text-gray-600">专业支持与服务资源馆</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/support">
                    <HeadphonesIcon className="w-4 h-4 mr-2" />
                    管理支持服务
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Training Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">培训课程管理</h3>
                  <p className="text-sm text-gray-600">家庭教育课程培训馆</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/training">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    管理培训课程
                  </Link>
                </Button>
              </div>
            </Card>

            {/* System Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">系统管理</h3>
                  <p className="text-sm text-gray-600">用户管理和系统配置</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    用户管理
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/change-password">
                    <Key className="w-4 h-4 mr-2" />
                    修改密码
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    系统设置
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/operation-logs">
                    <Activity className="w-4 h-4 mr-2" />
                    操作日志
                  </Link>
                </Button>

              </div>
            </Card>
          </div>
        </div>

        {/* Recent Articles */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">最近文章</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/articles">
                查看全部
              </Link>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">家庭安全隐患排查清单</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      安全防护
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      已发布
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025-01-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/admin/articles/edit/1">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">儿童营养均衡饮食指南</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                      生活照护
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      已发布
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025-01-10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/admin/articles/edit/2">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
