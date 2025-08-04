'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, FileText, Lightbulb, Users, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/Input'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    category: '',
    content: '',
    expertise: '',
    experience: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 模拟提交
    console.log('提交的数据:', formData)
    setIsSubmitted(true)
  }

  const categories = [
    { value: 'life', label: '生活照护' },
    { value: 'psychology', label: '心理健康' },
    { value: 'safety', label: '安全防护' },
    { value: 'education', label: '教育指导' }
  ]

  const guidelines = [
    {
      icon: FileText,
      title: '内容原创',
      description: '确保投稿内容为原创，未在其他平台发布过'
    },
    {
      icon: Lightbulb,
      title: '专业性',
      description: '内容应具有专业性和实用性，能为家长提供有价值的指导'
    },
    {
      icon: Users,
      title: '受众明确',
      description: '明确目标受众，内容应适合0-12岁儿童家长阅读'
    },
    {
      icon: CheckCircle,
      title: '格式规范',
      description: '文章结构清晰，语言通俗易懂，配图清晰美观'
    }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              href="/knowledge" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回知识科普馆
            </Link>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">投稿提交成功！</h1>
            <p className="text-gray-600 mb-8">
              感谢您的投稿！我们的编辑团队将在3-5个工作日内审核您的内容，并通过邮件与您联系。
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/knowledge">返回知识科普馆</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    title: '',
                    category: '',
                    content: '',
                    expertise: '',
                    experience: ''
                  })
                }}
                className="w-full sm:w-auto ml-0 sm:ml-4"
              >
                继续投稿
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/knowledge" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回知识科普馆
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">投稿建议</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              分享您的专业知识和经验，帮助更多家庭科学照护孩子
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guidelines */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">投稿指南</h2>
                <div className="space-y-4">
                  {guidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <guideline.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{guideline.title}</h3>
                        <p className="text-sm text-gray-600">{guideline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">审核流程</h3>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>1. 内容初审（1-2个工作日）</p>
                    <p>2. 专家评审（2-3个工作日）</p>
                    <p>3. 编辑润色（1个工作日）</p>
                    <p>4. 发布上线</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">投稿表单</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">个人信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          姓名 *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="请输入您的姓名"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          邮箱 *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="请输入您的邮箱"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          联系电话
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="请输入您的联系电话"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          专业领域
                        </label>
                        <Input
                          type="text"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleInputChange}
                          placeholder="如：儿童心理学、营养学等"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Background */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      从业经验
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请简要介绍您的从业经验和专业背景"
                    />
                  </div>

                  {/* Article Information */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">文章信息</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文章标题 *
                        </label>
                        <Input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          placeholder="请输入文章标题"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文章分类 *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">请选择分类</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文章内容 *
                        </label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          required
                          rows={12}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="请输入文章内容，建议字数在1000-3000字之间。可以包含：&#10;1. 问题背景和重要性&#10;2. 专业知识和理论基础&#10;3. 实用方法和技巧&#10;4. 案例分析&#10;5. 注意事项和建议"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      保存草稿
                    </Button>
                    <Button type="submit">
                      <Send className="w-4 h-4 mr-2" />
                      提交投稿
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
