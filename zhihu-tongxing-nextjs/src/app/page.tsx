import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import {
  ClipboardList,
  BookOpen,
  Gamepad2,
  HeadphonesIcon,
  GraduationCap,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '智护童行 - 专业的家庭教育与儿童照护平台',
  description: '智护童行为每个家庭提供科学、专业的育儿指导和支持服务。包含能力评估、知识科普、情境体验、专业支持和课程培训五大功能馆，助力孩子健康成长。',
  keywords: ['家庭教育平台', '儿童照护', '育儿指导', '能力评估', '亲子教育', '科学育儿']
})

export default function HomePage() {
  const halls = [
    {
      id: 'assessment',
      title: '能力评估与成长记录馆',
      description: '专业的儿童发展评估工具，记录孩子的成长轨迹',
      icon: ClipboardList,
      href: '/assessment',
      color: 'bg-blue-500',
      features: ['综合能力评估', 'SDQ行为评估', 'EMBU教养方式评估', '成长档案管理']
    },
    {
      id: 'knowledge',
      title: '科学照护知识科普馆',
      description: '涵盖生活、心理、安全、教育四大领域的专业知识',
      icon: BookOpen,
      href: '/knowledge',
      color: 'bg-green-500',
      features: ['生活照护', '心理健康', '安全防护', '教育指导']
    },
    {
      id: 'experience',
      title: '虚拟照护情境体验馆',
      description: '通过游戏化场景，提升实际照护技能',
      icon: Gamepad2,
      href: '/experience',
      color: 'bg-purple-500',
      features: ['情境模拟', '技能训练', '决策练习', '经验积累']
    },
    {
      id: 'support',
      title: '专业支持与服务资源馆',
      description: '提供专业咨询和丰富的服务资源',
      icon: HeadphonesIcon,
      href: '/support',
      color: 'bg-orange-500',
      features: ['在线咨询', '专家问答', '资源导航', '紧急支持']
    },
    {
      id: 'training',
      title: '家庭教育课程培训馆',
      description: '系统化的家庭教育课程和培训内容',
      icon: GraduationCap,
      href: '/training',
      color: 'bg-red-500',
      features: ['在线课程', '专家讲座', '实践指导', '认证培训']
    }
  ]

  const stats = [
    { label: '注册用户', value: '50,000+', icon: Users },
    { label: '专业评估', value: '100,000+', icon: ClipboardList },
    { label: '满意度', value: '98%', icon: Star },
    { label: '专业认证', value: '权威', icon: Award },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              智护童行
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              专业的家庭教育与儿童照护平台
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              为每个家庭提供科学、专业的育儿指导和支持服务，让每个孩子都能健康快乐地成长
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/assessment">
                  开始评估
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/knowledge">
                  浏览知识库
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Halls Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              五大功能馆
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              全方位的家庭教育支持体系，从评估到实践，从知识到技能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {halls.map((hall, index) => (
              <Card key={hall.id} hover className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${hall.color} rounded-lg flex items-center justify-center mr-4`}>
                      <hall.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{hall.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 flex-1">{hall.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">核心功能：</h4>
                    <ul className="space-y-2">
                      {hall.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={hall.href}>
                      进入{hall.title.split('与')[0]}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开始您的智护童行之旅
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            加入我们，为孩子的健康成长提供最专业的支持和指导
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                立即注册
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600" asChild>
              <Link href="/community">
                加入社区
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
