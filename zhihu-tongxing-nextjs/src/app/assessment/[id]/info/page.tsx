'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, Brain, Heart, Shield, BookOpen, CheckCircle, AlertCircle, Info } from 'lucide-react'

const assessmentInfo = {
  comprehensive: {
    title: '儿童照护能力综合评估',
    subtitle: '全面评估您的家庭照护能力',
    description: '这是一个专业的综合性评估工具，旨在帮助家长全面了解自己在儿童照护方面的能力水平。评估涵盖生活照护、心理支持、安全防护和教育引导四个核心维度。',
    duration: '30-45分钟',
    questions: 40,
    icon: Brain,
    color: 'bg-blue-500',
    dimensions: [
      {
        name: '生活照护',
        description: '评估您在日常生活照料方面的能力，包括饮食、睡眠、卫生等',
        icon: Shield
      },
      {
        name: '心理支持',
        description: '评估您理解和支持孩子情感需求的能力',
        icon: Heart
      },
      {
        name: '安全防护',
        description: '评估您在保障孩子安全方面的意识和能力',
        icon: Shield
      },
      {
        name: '教育引导',
        description: '评估您在引导孩子学习和成长方面的能力',
        icon: BookOpen
      }
    ],
    benefits: [
      '获得个性化的照护能力分析报告',
      '了解自己的优势和需要改进的领域',
      '获得针对性的改进建议和资源推荐',
      '建立孩子的成长档案基线'
    ],
    tips: [
      '请在安静的环境中完成评估',
      '根据真实情况诚实回答',
      '每个问题都请仔细思考后再选择',
      '评估过程中可以随时暂停'
    ]
  },
  sdq: {
    title: '长处和困难问卷 (SDQ)',
    subtitle: '儿童行为与情绪筛查工具',
    description: 'SDQ是国际广泛使用的儿童心理健康筛查工具，用于评估4-17岁儿童的情绪、行为和社交能力。通过家长的观察和评价，帮助及早发现孩子可能存在的心理健康问题。',
    duration: '15-20分钟',
    questions: 25,
    icon: Heart,
    color: 'bg-red-500',
    dimensions: [
      {
        name: '情绪症状',
        description: '评估孩子是否存在焦虑、抑郁等情绪问题',
        icon: Heart
      },
      {
        name: '行为问题',
        description: '评估孩子是否存在攻击性、反社会行为等问题',
        icon: AlertCircle
      },
      {
        name: '注意力问题',
        description: '评估孩子的注意力集中程度和多动倾向',
        icon: Brain
      },
      {
        name: '社交能力',
        description: '评估孩子与同伴的交往能力和社交技巧',
        icon: Users
      }
    ],
    benefits: [
      '及早发现孩子的心理健康风险',
      '了解孩子的行为模式和情绪特点',
      '获得专业的干预建议',
      '为后续的专业咨询提供参考'
    ],
    tips: [
      '请基于孩子最近6个月的表现回答',
      '选择最符合孩子实际情况的选项',
      '如有疑虑，建议咨询专业心理健康专家',
      '此评估仅供筛查参考，不能替代专业诊断'
    ]
  },
  embu: {
    title: '父母教育方式量表 (EMBU)',
    subtitle: '了解您的教养方式特点',
    description: 'EMBU量表是评估父母教养方式的专业工具，帮助家长了解自己在教育孩子过程中的行为模式和态度特点。通过评估，您可以更好地认识自己的教养风格，并进行适当的调整。',
    duration: '18-25分钟',
    questions: 30,
    icon: Users,
    color: 'bg-green-500',
    dimensions: [
      {
        name: '情感温暖',
        description: '评估您对孩子表达关爱和支持的程度',
        icon: Heart
      },
      {
        name: '过度保护',
        description: '评估您是否过度干预和保护孩子',
        icon: Shield
      },
      {
        name: '拒绝否认',
        description: '评估您对孩子的接纳程度和批评倾向',
        icon: AlertCircle
      }
    ],
    benefits: [
      '了解自己的教养方式特点',
      '识别可能存在的教养问题',
      '获得改善亲子关系的建议',
      '促进更健康的家庭教育环境'
    ],
    tips: [
      '请根据您平时的真实表现回答',
      '没有标准答案，诚实回答最重要',
      '思考您在不同情况下的典型反应',
      '评估结果将帮助您更好地理解自己'
    ]
  }
}

export default function AssessmentInfoPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  
  const info = assessmentInfo[assessmentId as keyof typeof assessmentInfo]

  if (!info) {
    router.push('/assessment')
    return <div>评估不存在</div>
  }

  const IconComponent = info.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/assessment">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回评估馆
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">评估详情</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Assessment Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-lg ${info.color} text-white`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{info.title}</CardTitle>
                    <CardDescription className="text-lg">{info.subtitle}</CardDescription>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {info.duration}
                  </div>
                  <div>{info.questions} 道题目</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">{info.description}</p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href={`/assessment/${assessmentId}/start`}>
                    开始评估
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/assessment">
                    返回选择
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Dimensions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                评估维度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {info.dimensions.map((dimension, index) => {
                  const DimensionIcon = dimension.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <DimensionIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{dimension.name}</h4>
                        <p className="text-sm text-gray-600">{dimension.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                评估收益
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {info.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                评估须知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {info.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                返回评估馆
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/assessment/${assessmentId}/start`}>
                开始评估
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
