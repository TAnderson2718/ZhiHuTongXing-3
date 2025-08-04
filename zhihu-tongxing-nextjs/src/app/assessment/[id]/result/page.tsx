'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Share2, BookOpen, TrendingUp, AlertCircle, CheckCircle, Users } from 'lucide-react'

// 模拟评估结果数据
const mockResults = {
  comprehensive: {
    title: '儿童照护能力综合评估结果',
    overallScore: 78,
    level: '良好',
    levelColor: 'bg-green-500',
    completedAt: '2025-01-01',
    dimensions: [
      { name: '生活照护', score: 85, description: '您在日常生活照料方面表现优秀' },
      { name: '心理支持', score: 72, description: '在情感支持方面有提升空间' },
      { name: '安全防护', score: 80, description: '安全意识较强，继续保持' },
      { name: '教育引导', score: 75, description: '教育方法基本合适，可进一步优化' }
    ],
    strengths: [
      '在日常生活照料方面表现出色，能够很好地满足孩子的基本需求',
      '安全防护意识较强，能够为孩子创造相对安全的环境',
      '具备基本的教育引导能力，能够适当地指导孩子'
    ],
    improvements: [
      '可以更多关注孩子的情感需求，提供更多的心理支持',
      '学习更多的沟通技巧，更好地理解孩子的内心世界',
      '可以尝试更多样化的教育方法，激发孩子的学习兴趣'
    ],
    recommendations: [
      '参加"情感沟通技巧"相关课程',
      '阅读儿童心理发展相关书籍',
      '加入家长交流群，分享育儿经验'
    ]
  },
  sdq: {
    title: '长处和困难问卷 (SDQ) 结果',
    overallScore: 12,
    level: '正常范围',
    levelColor: 'bg-green-500',
    completedAt: '2025-01-01',
    dimensions: [
      { name: '情绪症状', score: 2, description: '孩子情绪状态良好' },
      { name: '行为问题', score: 3, description: '行为表现在正常范围内' },
      { name: '注意力问题', score: 4, description: '注意力集中程度正常' },
      { name: '社交能力', score: 8, description: '社交能力表现优秀' }
    ],
    strengths: [
      '孩子的社交能力表现优秀，能够很好地与同伴相处',
      '情绪状态稳定，很少出现情绪问题',
      '行为表现良好，符合年龄特点'
    ],
    improvements: [
      '可以适当关注孩子的注意力训练',
      '继续保持良好的情绪引导'
    ],
    recommendations: [
      '继续保持现有的教养方式',
      '可以适当增加一些注意力训练游戏',
      '定期观察孩子的行为变化'
    ]
  },
  embu: {
    title: '父母教育方式量表 (EMBU) 结果',
    overallScore: 75,
    level: '均衡型',
    levelColor: 'bg-blue-500',
    completedAt: '2025-01-01',
    dimensions: [
      { name: '情感温暖', score: 82, description: '您能够给予孩子充分的关爱' },
      { name: '过度保护', score: 45, description: '保护程度适中，给孩子适当自主空间' },
      { name: '拒绝否认', score: 35, description: '对孩子的接纳程度较高' }
    ],
    strengths: [
      '能够给予孩子充分的情感温暖和支持',
      '在保护和自主之间找到了较好的平衡',
      '对孩子的接纳程度较高，很少出现拒绝否认的行为'
    ],
    improvements: [
      '可以继续保持现有的教养方式',
      '适当关注孩子的独立性培养'
    ],
    recommendations: [
      '继续保持温暖的教养风格',
      '学习如何在关爱和独立之间找到更好的平衡',
      '参与家庭教育相关的学习活动'
    ]
  }
}

export default function AssessmentResultPage() {
  const params = useParams()
  const assessmentId = params.id as string
  
  const result = mockResults[assessmentId as keyof typeof mockResults]

  if (!result) {
    return <div>评估结果不存在</div>
  }

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
              <h1 className="text-2xl font-bold text-gray-900">评估结果</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Result */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{result.title}</CardTitle>
                  <CardDescription>完成时间：{result.completedAt}</CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{result.overallScore}</div>
                  <Badge className={`${result.levelColor} text-white`}>
                    {result.level}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Dimension Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                各维度得分
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.dimensions.map((dimension, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{dimension.name}</span>
                      <span className="text-2xl font-bold text-gray-900">{dimension.score}</span>
                    </div>
                    <Progress value={dimension.score} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">{dimension.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                您的优势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                改进建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                推荐资源
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                返回评估馆
              </Link>
            </Button>
            <Button asChild>
              <Link href="/assessment/history">
                查看历史记录
              </Link>
            </Button>
            <Button asChild>
              <Link href="/knowledge">
                探索知识馆
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
