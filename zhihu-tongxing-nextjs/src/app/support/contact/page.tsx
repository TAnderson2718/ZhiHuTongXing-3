'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const subjects = [
    '技术支持',
    '账户问题',
    '功能建议',
    '投诉反馈',
    '合作咨询',
    '其他问题'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('请填写所有必填信息')
      return
    }
    setIsSubmitted(true)
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">消息已发送！</h2>
            <p className="text-gray-600 mb-6">
              感谢您的联系。我们已收到您的消息，将在24小时内回复您。
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">您的消息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">主题：</span>
                  <span className="text-gray-900">{formData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">优先级：</span>
                  <span className="text-gray-900">
                    {formData.priority === 'high' ? '高' : formData.priority === 'low' ? '低' : '普通'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">联系邮箱：</span>
                  <span className="text-gray-900">{formData.email}</span>
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/support" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回支持中心
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-gray-600">
            有任何问题或建议？请通过以下方式联系我们，我们会尽快回复您。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">发送消息</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
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
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入您的手机号（可选）"
                  />
                </div>

                {/* Subject and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主题 *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择主题</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      优先级
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">低</option>
                      <option value="normal">普通</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细描述 *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请详细描述您的问题或建议..."
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <Send className="w-4 h-4 mr-2" />
                  发送消息
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">联系方式</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">咨询热线</p>
                    <p className="text-gray-600">400-123-4567</p>
                    <p className="text-sm text-gray-500">24小时服务热线</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">邮箱地址</p>
                    <p className="text-gray-600">support@zhihutongxing.com</p>
                    <p className="text-sm text-gray-500">24小时内回复</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">办公地址</p>
                    <p className="text-gray-600">北京市朝阳区智护大厦</p>
                    <p className="text-sm text-gray-500">100020</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">服务时间</p>
                    <p className="text-gray-600">周一至周日</p>
                    <p className="text-sm text-gray-500">9:00 - 21:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">微信公众号</p>
                    <p className="text-gray-600">育见未来ing</p>
                    <p className="text-sm text-gray-500">关注获取更多育儿资讯</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">快速响应承诺</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>紧急问题：2小时内响应</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>一般问题：24小时内响应</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>建议反馈：48小时内响应</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                微信联系
              </h3>
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://i.postimg.cc/XJLd4fQ4/SCR-20250802-lxua.png"
                    alt="微信二维码"
                    className="w-32 h-32 mx-auto rounded-lg border border-green-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="w-32 h-32 mx-auto rounded-lg border border-green-200 bg-green-100 flex items-center justify-center text-green-600 hidden"
                  >
                    <MessageSquare className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-green-900">天天向上</p>
                  <p className="text-sm text-green-700">扫码添加微信好友</p>
                  <p className="text-xs text-green-600">获得一对一专业指导</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">其他帮助方式</h3>
              <div className="space-y-3">
                <Link href="/support/consultation">
                  <Button variant="outline" className="w-full">
                    在线咨询
                  </Button>
                </Link>
                <Link href="/support/appointment">
                  <Button variant="outline" className="w-full">
                    预约专家
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    社区求助
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
