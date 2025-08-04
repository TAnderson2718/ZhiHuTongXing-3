'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HeadphonesIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  MessageCircle,
  Calendar,
  Mail,
  Phone,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function SupportManagementPage() {
  const { user: adminUser, loading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('consultations')

  const stats = [
    { label: '在线咨询', value: '156', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
    { label: '预约咨询', value: '89', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { label: '邮件咨询', value: '234', icon: Mail, color: 'bg-green-100 text-green-600' },
    { label: '专家团队', value: '12', icon: Users, color: 'bg-orange-100 text-orange-600' }
  ]

  const consultations = [
    {
      id: '1',
      type: 'online',
      user: '张女士',
      expert: '李心理师',
      topic: '儿童分离焦虑问题',
      status: 'ongoing',
      priority: 'high',
      createdAt: '2025-01-15 14:30',
      duration: '45分钟'
    },
    {
      id: '2',
      type: 'appointment',
      user: '王先生',
      expert: '陈教育专家',
      topic: '青春期叛逆行为指导',
      status: 'scheduled',
      priority: 'medium',
      createdAt: '2025-01-15 10:15',
      scheduledAt: '2025-01-16 15:00'
    },
    {
      id: '3',
      type: 'email',
      user: '刘女士',
      expert: '待分配',
      topic: '新生儿护理咨询',
      status: 'pending',
      priority: 'low',
      createdAt: '2025-01-15 09:20'
    },
    {
      id: '4',
      type: 'online',
      user: '赵先生',
      expert: '孙发展专家',
      topic: '儿童语言发育迟缓',
      status: 'completed',
      priority: 'high',
      createdAt: '2025-01-14 16:45',
      completedAt: '2025-01-14 17:30'
    }
  ]

  const experts = [
    {
      id: '1',
      name: '李心理师',
      specialty: '儿童心理',
      status: 'online',
      consultations: 45,
      rating: 4.9,
      experience: '8年'
    },
    {
      id: '2',
      name: '陈教育专家',
      specialty: '家庭教育',
      status: 'busy',
      consultations: 38,
      rating: 4.8,
      experience: '12年'
    },
    {
      id: '3',
      name: '孙发展专家',
      specialty: '儿童发展',
      status: 'offline',
      consultations: 52,
      rating: 4.7,
      experience: '10年'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">进行中</span>
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">已预约</span>
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">待处理</span>
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">已完成</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">未知</span>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">高</span>
      case 'medium':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">中</span>
      case 'low':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">低</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeMap = {
      online: { label: '在线咨询', color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
      appointment: { label: '预约咨询', color: 'bg-purple-100 text-purple-800', icon: Calendar },
      email: { label: '邮件咨询', color: 'bg-green-100 text-green-800', icon: Mail },
      phone: { label: '电话咨询', color: 'bg-orange-100 text-orange-800', icon: Phone }
    }
    const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-100 text-gray-800', icon: MessageCircle }
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color} flex items-center`}>
        <typeInfo.icon className="w-3 h-3 mr-1" />
        {typeInfo.label}
      </span>
    )
  }

  const getExpertStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">在线</span>
      case 'busy':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">忙碌</span>
      case 'offline':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">离线</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">未知</span>
    }
  }

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
              <HeadphonesIcon className="w-8 h-8 text-orange-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">支持服务管理 - 专业支持与服务资源馆</h1>
            </div>
            <Link href="/admin/support/experts/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加专家
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

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('consultations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'consultations'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                咨询管理
              </button>
              <button
                onClick={() => setActiveTab('experts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'experts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                专家管理
              </button>
            </nav>
          </div>
        </div>

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">咨询记录</h2>
              <span className="text-sm text-gray-500">共 {consultations.length} 条记录</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户/专家
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      咨询主题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      优先级
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{consultation.user}</div>
                          <div className="text-sm text-gray-500">专家: {consultation.expert}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.topic}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(consultation.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(consultation.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(consultation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{consultation.createdAt}</div>
                        {consultation.scheduledAt && (
                          <div className="text-xs text-blue-600">预约: {consultation.scheduledAt}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/admin/support/consultations/${consultation.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Experts Tab */}
        {activeTab === 'experts' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">专家团队</h2>
              <span className="text-sm text-gray-500">共 {experts.length} 位专家</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <Card key={expert.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.specialty}</p>
                      </div>
                    </div>
                    {getExpertStatusBadge(expert.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>咨询次数:</span>
                      <span className="font-medium">{expert.consultations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>评分:</span>
                      <span className="font-medium">{expert.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>经验:</span>
                      <span className="font-medium">{expert.experience}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/admin/support/experts/edit/${expert.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                    </Link>
                    <Link href={`/admin/support/experts/${expert.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        详情
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
