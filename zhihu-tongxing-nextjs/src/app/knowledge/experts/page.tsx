'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Users, Star, BookOpen, Award, Mail, Phone, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

// 模拟专家团队数据
const mockExperts = [
  {
    id: '1',
    name: '李明华',
    title: '儿童心理发展专家',
    specialties: ['儿童心理', '情绪管理', '行为矫正'],
    experience: '15年',
    education: '北京师范大学心理学博士',
    rating: 4.9,
    articlesCount: 28,
    consultations: 1200,
    avatar: 'https://picsum.photos/seed/expert1/200/200',
    bio: '专注于儿童心理发展研究15年，擅长处理儿童情绪问题和行为矫正。曾在多家知名医院担任儿童心理科主任，发表学术论文50余篇。',
    achievements: [
      '国家级儿童心理健康专家',
      '中国心理学会会员',
      '儿童心理治疗师资格认证'
    ],
    contact: {
      email: 'li.minghua@zhihutongxing.com',
      phone: '400-123-4567',
      location: '北京市朝阳区'
    }
  },
  {
    id: '2',
    name: '张雅琴',
    title: '儿童营养与健康专家',
    specialties: ['营养搭配', '辅食添加', '健康管理'],
    experience: '12年',
    education: '中国农业大学营养学硕士',
    rating: 4.8,
    articlesCount: 35,
    consultations: 980,
    avatar: 'https://picsum.photos/seed/expert2/200/200',
    bio: '资深儿童营养师，专注于0-12岁儿童营养健康管理。在婴幼儿辅食添加、儿童营养不良干预等方面有丰富经验。',
    achievements: [
      '注册营养师',
      '儿童营养专业委员会委员',
      '营养健康科普专家'
    ],
    contact: {
      email: 'zhang.yaqin@zhihutongxing.com',
      phone: '400-123-4568',
      location: '上海市浦东新区'
    }
  },
  {
    id: '3',
    name: '王建国',
    title: '家庭安全防护专家',
    specialties: ['家庭安全', '意外防护', '急救知识'],
    experience: '18年',
    education: '清华大学安全工程博士',
    rating: 4.7,
    articlesCount: 22,
    consultations: 750,
    avatar: 'https://picsum.photos/seed/expert3/200/200',
    bio: '家庭安全领域资深专家，曾任职于国家安全生产监督管理总局。专注于儿童家庭安全防护体系建设和意外伤害预防。',
    achievements: [
      '国家注册安全工程师',
      '家庭安全防护标准制定专家',
      '儿童意外伤害预防专家'
    ],
    contact: {
      email: 'wang.jianguo@zhihutongxing.com',
      phone: '400-123-4569',
      location: '深圳市南山区'
    }
  },
  {
    id: '4',
    name: '陈美玲',
    title: '早期教育专家',
    specialties: ['早期教育', '认知发展', '语言启蒙'],
    experience: '20年',
    education: '华东师范大学学前教育博士',
    rating: 4.9,
    articlesCount: 42,
    consultations: 1500,
    avatar: 'https://picsum.photos/seed/expert4/200/200',
    bio: '早期教育领域权威专家，从事学前教育研究20年。在儿童认知发展、语言启蒙、创造力培养等方面有独到见解。',
    achievements: [
      '学前教育专业委员会主任',
      '早期教育课程标准制定专家',
      '国际蒙台梭利教育认证师'
    ],
    contact: {
      email: 'chen.meiling@zhihutongxing.com',
      phone: '400-123-4570',
      location: '广州市天河区'
    }
  }
]

export default function ExpertsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  // 获取所有专业领域
  const allSpecialties = Array.from(
    new Set(mockExperts.flatMap(expert => expert.specialties))
  )

  const filteredExperts = selectedSpecialty === 'all' 
    ? mockExperts 
    : mockExperts.filter(expert => expert.specialties.includes(selectedSpecialty))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/knowledge" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回知识科普馆
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">专家团队</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              汇聚国内顶尖的儿童照护专家，为您提供专业、权威的指导和建议
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Specialty Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">专业领域</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSpecialty === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSpecialty('all')}
            >
              全部专家
            </Button>
            {allSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Expert Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{expert.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{expert.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{expert.articlesCount} 篇文章</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{expert.consultations} 次咨询</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">专业领域</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">专家简介</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{expert.bio}</p>
                </div>

                {/* Education & Experience */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">教育背景：</span>
                      <span className="text-gray-600">{expert.education}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">从业经验：</span>
                      <span className="text-gray-600">{expert.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">专业认证</h4>
                  <div className="space-y-1">
                    {expert.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Award className="w-3 h-3 text-yellow-500" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">联系方式</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{expert.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{expert.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{expert.contact.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <Button size="sm" className="flex-1">
                      预约咨询
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      查看文章
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">需要专业指导？</h3>
              <p className="text-gray-600 mb-6">
                我们的专家团队随时为您提供个性化的专业建议和指导
              </p>
              <div className="flex justify-center space-x-4">
                <Button>
                  预约专家咨询
                </Button>
                <Button variant="outline">
                  了解咨询流程
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
