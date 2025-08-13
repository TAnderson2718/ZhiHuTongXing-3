'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedExpert, setSelectedExpert] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    issue: '',
    description: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [experts, setExperts] = useState<any[]>([])
  const [isLoadingExperts, setIsLoadingExperts] = useState(true)

  // 从API获取专家数据
  useEffect(() => {
    fetchExperts()
  }, [])

  const fetchExperts = async () => {
    try {
      setIsLoadingExperts(true)
      const response = await fetch('/api/experts?available=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setExperts(result.data || [])
        } else {
          setExperts(fallbackExperts) // 使用备用数据
        }
      } else {
        setExperts(fallbackExperts) // 使用备用数据
      }
    } catch (err) {
      console.error('Error fetching experts:', err)
      setExperts(fallbackExperts) // 使用备用数据
    } finally {
      setIsLoadingExperts(false)
    }
  }

  const fallbackExperts = [
    {
      id: 'dr-wang',
      name: '王教授',
      title: '儿童心理学专家',
      experience: '15年经验',
      specialties: ['情绪管理', '行为引导', '亲子关系']
    },
    {
      id: 'dr-li',
      name: '李医生',
      title: '儿童发展专家',
      experience: '12年经验',
      specialties: ['早期教育', '认知发展', '语言发展']
    },
    {
      id: 'dr-zhang',
      name: '张老师',
      title: '家庭教育专家',
      experience: '10年经验',
      specialties: ['家庭沟通', '教育方法', '习惯培养']
    }
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '19:00', '19:30', '20:00', '20:30'
  ]

  const issues = [
    '睡眠问题',
    '饮食问题',
    '行为问题',
    '情绪管理',
    '学习困难',
    '社交问题',
    '亲子关系',
    '其他问题'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !selectedExpert || !formData.name || !formData.phone) {
      alert('请填写所有必填信息')
      return
    }
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/support" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回支持中心
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">预约成功！</h2>
            <p className="text-gray-600 mb-6">
              您的预约已成功提交，我们将在24小时内与您联系确认预约详情。
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">预约信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">专家：</span>
                  <span className="text-gray-900">{experts.find(e => e.id === selectedExpert)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">日期：</span>
                  <span className="text-gray-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">时间：</span>
                  <span className="text-gray-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">联系电话：</span>
                  <span className="text-gray-900">{formData.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/support">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  返回支持中心
                </Button>
              </Link>
              <Link href="/support/consultation">
                <Button variant="outline" className="w-full">
                  在线咨询
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/support" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回支持中心
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">预约专家咨询</h1>
          <p className="text-gray-600">
            选择合适的专家和时间，获得一对一的专业指导
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expert Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">选择专家</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingExperts ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    加载专家信息中...
                  </div>
                ) : experts.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    暂无可用专家
                  </div>
                ) : experts.map((expert) => (
                  <div
                    key={expert.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedExpert === expert.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedExpert(expert.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{expert.name}</h4>
                        <p className="text-sm text-gray-600">{expert.title}</p>
                        <p className="text-sm text-gray-500">{expert.experience}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {expert.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Date and Time Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">选择日期和时间</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    选择日期
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    选择时间
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择时间</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">联系信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号 *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入手机号"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入邮箱地址"
                  />
                </div>
              </div>
            </Card>

            {/* Issue Description */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">咨询问题</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    问题类型
                  </label>
                  <select
                    value={formData.issue}
                    onChange={(e) => handleInputChange('issue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择问题类型</option>
                    {issues.map((issue) => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请详细描述您遇到的问题，这将帮助专家更好地为您提供建议"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">预约须知</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>咨询时长：30-60分钟</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>咨询方式：电话或视频通话</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>确认时间：24小时内电话确认</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <p>取消政策：提前4小时可免费取消</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">需要紧急帮助？</h3>
              <p className="text-sm text-blue-700 mb-4">
                如果您遇到紧急情况，请直接拨打我们的24小时热线
              </p>
              <div className="flex items-center space-x-2 text-blue-800">
                <Phone className="w-4 h-4" />
                <span className="font-medium">400-123-4567</span>
              </div>
            </Card>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              提交预约
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
