'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
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
  Clock,
  Star,
  Award,
  Calendar
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'

// 定义培训课程类型
interface TrainingCourse {
  id: string
  title: string
  type: string
  category: string
  instructor: string
  duration: string
  lessons: number
  enrolled: number
  rating: number
  price: number
  status: string
  level: string
  lastUpdated: string
}

export default function TrainingManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')

  // 从API获取培训课程列表
  useEffect(() => {
    if (adminUser) {
      fetchTrainingCourses()
    }
  }, [adminUser, searchQuery, filterType])

  const fetchTrainingCourses = async () => {
    try {
      setIsLoadingData(true)
      const params = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        ...(filterType !== 'all' && { type: filterType })
      })

      const response = await fetch(`/api/admin/training?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTrainingCourses(data.data.courses || [])
        } else {
          setError(data.error || '获取培训课程列表失败')
        }
      } else {
        setError('获取培训课程列表失败')
      }
    } catch (err) {
      console.error('Error fetching training courses:', err)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoadingData(false)
    }
  }

  const mockTrainingCourses = [
    {
      id: '1',
      title: '0-3岁婴幼儿发展与教育',
      type: 'course',
      category: 'early-childhood',
      instructor: '李教授',
      duration: '8周',
      lessons: 24,
      enrolled: 450,
      rating: 4.8,
      price: 299,
      status: 'active',
      level: 'beginner',
      lastUpdated: '2025-01-15'
    },
    {
      id: '2',
      title: '亲子沟通技巧专题讲座',
      type: 'lecture',
      category: 'communication',
      instructor: '张心理师',
      duration: '2小时',
      lessons: 1,
      enrolled: 280,
      rating: 4.9,
      price: 99,
      status: 'active',
      level: 'intermediate',
      lastUpdated: '2025-01-12'
    },
    {
      id: '3',
      title: '青春期教育指导认证课程',
      type: 'certification',
      category: 'adolescence',
      instructor: '王专家',
      duration: '12周',
      lessons: 36,
      enrolled: 180,
      rating: 4.7,
      price: 599,
      status: 'active',
      level: 'advanced',
      lastUpdated: '2025-01-10'
    },
    {
      id: '4',
      title: '家庭安全教育实践指南',
      type: 'workshop',
      category: 'safety',
      instructor: '陈老师',
      duration: '4周',
      lessons: 12,
      enrolled: 320,
      rating: 4.6,
      price: 199,
      status: 'draft',
      level: 'beginner',
      lastUpdated: '2025-01-08'
    },
    {
      id: '5',
      title: '特殊需求儿童教育支持',
      type: 'course',
      category: 'special-needs',
      instructor: '刘博士',
      duration: '10周',
      lessons: 30,
      enrolled: 95,
      rating: 4.9,
      price: 799,
      status: 'active',
      level: 'advanced',
      lastUpdated: '2025-01-05'
    }
  ] // 保留作为后备数据

  const stats = [
    { label: '培训课程', value: '28', icon: GraduationCap, color: 'bg-red-100 text-red-600' },
    { label: '注册学员', value: '2,450', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: '完成认证', value: '1,280', icon: Award, color: 'bg-yellow-100 text-yellow-600' },
    { label: '平均评分', value: '4.8', icon: Star, color: 'bg-green-100 text-green-600' }
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
      course: { label: '在线课程', color: 'bg-blue-100 text-blue-800', icon: BookOpen },
      lecture: { label: '专家讲座', color: 'bg-purple-100 text-purple-800', icon: Play },
      workshop: { label: '实践指导', color: 'bg-green-100 text-green-800', icon: Users },
      certification: { label: '认证培训', color: 'bg-orange-100 text-orange-800', icon: Award }
    }
    const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-100 text-gray-800', icon: BookOpen }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color} flex items-center`}>
        <typeInfo.icon className="w-3 h-3 mr-1" />
        {typeInfo.label}
      </span>
    )
  }

  const getLevelBadge = (level: string) => {
    const levelMap = {
      beginner: { label: '初级', color: 'bg-green-100 text-green-800' },
      intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: '高级', color: 'bg-red-100 text-red-800' }
    }
    const levelInfo = levelMap[level as keyof typeof levelMap] || { label: level, color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${levelInfo.color}`}>{levelInfo.label}</span>
  }

  const getCategoryName = (category: string) => {
    const categoryMap = {
      'early-childhood': '早期教育',
      'communication': '沟通技巧',
      'adolescence': '青春期教育',
      'safety': '安全教育',
      'special-needs': '特殊需求'
    }
    return categoryMap[category as keyof typeof categoryMap] || category
  }

  const filteredCourses = trainingCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || course.type === filterType
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
          <Button onClick={() => fetchTrainingCourses()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
              <GraduationCap className="w-8 h-8 text-red-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">培训课程管理 - 家庭教育课程培训馆</h1>
            </div>
            <Link href="/admin/training/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建课程
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
                  placeholder="搜索课程或讲师..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">全部类型</option>
                <option value="course">在线课程</option>
                <option value="lecture">专家讲座</option>
                <option value="workshop">实践指导</option>
                <option value="certification">认证培训</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Training Courses List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">培训课程列表</h2>
            <span className="text-sm text-gray-500">共 {filteredCourses.length} 个课程</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    课程信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    讲师
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时长/课时
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学员数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">
                          {getCategoryName(course.category)} • {getLevelBadge(course.level)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(course.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {course.duration}
                      </div>
                      <div className="text-xs text-gray-500">{course.lessons} 课时</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {course.enrolled}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {course.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{course.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/admin/training/edit/${course.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/training/preview/${course.id}`}>
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
