'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, Brain, Heart, Shield, BookOpen } from 'lucide-react'

const assessmentTypes = [
  {
    id: 'comprehensive',
    title: '儿童照护能力综合评估',
    description: '全面评估您在生活、心理、安全、教育四大核心照护维度的综合能力水平。',
    duration: '30-45分钟',
    questions: '40题',
    icon: Brain,
    color: 'bg-blue-500',
    features: ['生活照护能力', '心理健康支持', '安全防护意识', '教育引导技巧']
  },
  {
    id: 'sdq',
    title: '长处和困难问卷 (SDQ)',
    description: '关注孩子的情绪与行为表现，及时发现潜在的心理健康问题。',
    duration: '15-20分钟',
    questions: '25题',
    icon: Heart,
    color: 'bg-red-500',
    features: ['情绪问题筛查', '行为问题识别', '社交能力评估', '注意力评估']
  },
  {
    id: 'embu',
    title: '父母教育方式量表 (EMBU)',
    description: '了解您自身的教养方式特点，如情感温暖、过度保护等。',
    duration: '18-25分钟',
    questions: '30题',
    icon: Users,
    color: 'bg-green-500',
    features: ['教养方式分析', '情感温暖度', '过度保护倾向', '拒绝否认程度']
  }
]

export default function NewAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

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
              <h1 className="text-2xl font-bold text-gray-900">开始新评估</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">选择评估类型</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              请根据您的需求选择合适的评估工具。每个评估都经过专业设计，帮助您更好地了解自己和孩子。
            </p>
          </div>

          {/* Assessment Cards */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 mb-8">
            {assessmentTypes.map((assessment) => {
              const IconComponent = assessment.icon
              const isSelected = selectedAssessment === assessment.id
              
              return (
                <Card 
                  key={assessment.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${assessment.color} text-white`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{assessment.title}</CardTitle>
                          <CardDescription className="text-base">
                            {assessment.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {assessment.duration}
                        </div>
                        <div>{assessment.questions}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {assessment.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                取消
              </Link>
            </Button>
            <Button 
              disabled={!selectedAssessment}
              asChild={!!selectedAssessment}
            >
              {selectedAssessment ? (
                <Link href={`/assessment/${selectedAssessment}/start`}>
                  开始评估
                </Link>
              ) : (
                <span>请选择评估类型</span>
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">评估小贴士</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 请在安静的环境中完成评估，确保能够专注思考</li>
              <li>• 根据真实情况回答问题，这样才能获得准确的评估结果</li>
              <li>• 评估过程中可以随时暂停，您的进度会自动保存</li>
              <li>• 完成评估后，您将获得详细的个性化报告和建议</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
