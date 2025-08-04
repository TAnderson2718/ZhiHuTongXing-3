'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Award, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Users,
  Star
} from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface DashboardStats {
  assessmentsCompleted: number
  articlesRead: number
  communityPosts: number
  trainingHours: number
  achievements: number
  lastLoginDate: string
}

interface RecentActivity {
  id: string
  type: 'assessment' | 'article' | 'community' | 'training'
  title: string
  date: string
  status: 'completed' | 'in-progress' | 'new'
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 获取用户信息
      const userResponse = await fetch('/api/auth/me')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      } else if (userResponse.status === 401) {
        router.push('/login')
        return
      }

      // 模拟获取统计数据
      setStats({
        assessmentsCompleted: 5,
        articlesRead: 23,
        communityPosts: 8,
        trainingHours: 12,
        achievements: 3,
        lastLoginDate: new Date().toISOString()
      })

      // 模拟获取最近活动
      setRecentActivities([
        {
          id: '1',
          type: 'assessment',
          title: '儿童安全意识评估',
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: '2',
          type: 'article',
          title: '如何培养孩子的独立性',
          date: '2024-01-14',
          status: 'completed'
        },
        {
          id: '3',
          type: 'community',
          title: '分享育儿心得',
          date: '2024-01-13',
          status: 'completed'
        },
        {
          id: '4',
          type: 'training',
          title: '亲子沟通技巧课程',
          date: '2024-01-12',
          status: 'in-progress'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <Target className="w-4 h-4" />
      case 'article':
        return <BookOpen className="w-4 h-4" />
      case 'community':
        return <MessageSquare className="w-4 h-4" />
      case 'training':
        return <Award className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'new':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'in-progress':
        return '进行中'
      case 'new':
        return '新的'
      default:
        return '未知'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">无法加载用户信息</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            返回登录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 欢迎信息 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            欢迎回来，{user.name}！
          </h1>
          <p className="mt-2 text-gray-600">
            这里是您的个人学习面板，查看您的学习进度和最新动态
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="text-center">
            <Target className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.assessmentsCompleted}</h3>
            <p className="text-gray-600">完成评估</p>
          </Card>

          <Card className="text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.articlesRead}</h3>
            <p className="text-gray-600">阅读文章</p>
          </Card>

          <Card className="text-center">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.communityPosts}</h3>
            <p className="text-gray-600">社区发帖</p>
          </Card>

          <Card className="text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.trainingHours}</h3>
            <p className="text-gray-600">培训时长</p>
          </Card>

          <Card className="text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{stats?.achievements}</h3>
            <p className="text-gray-600">获得成就</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 最近活动 */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 快速操作 */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <Link href="/assessment">
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    开始新评估
                  </Button>
                </Link>
                <Link href="/knowledge">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    浏览知识库
                  </Button>
                </Link>
                <Link href="/community">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    参与社区讨论
                  </Button>
                </Link>
                <Link href="/training">
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    查看培训课程
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    编辑个人资料
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 学习进度 */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">本月学习进度</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>评估完成度</span>
                    <span>5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>知识学习</span>
                    <span>23/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '77%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>社区参与</span>
                    <span>8/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
