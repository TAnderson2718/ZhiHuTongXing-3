'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, BookOpen, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface AssessmentResult {
  type: string
  totalScore: number
  maxScore: number
  percentage: number
  answers: Record<number, number>
  completedAt: string
  categories: Record<string, number>
}

export default function ChildcareAbilityResultPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取评估结果
    const savedResult = localStorage.getItem('childcare-ability-result')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载评估结果...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到评估结果</h2>
          <p className="text-gray-600 mb-6">
            请先完成儿童照护能力评估
          </p>
          <Button asChild className="w-full">
            <Link href="/assessment/childcare-ability">
              开始评估
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 90) return { level: '优秀', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (percentage >= 80) return { level: '良好', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (percentage >= 70) return { level: '中等', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (percentage >= 60) return { level: '及格', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { level: '需要提升', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getCategoryLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'text-green-600' }
    if (score >= 80) return { level: '良好', color: 'text-blue-600' }
    if (score >= 70) return { level: '中等', color: 'text-yellow-600' }
    if (score >= 60) return { level: '及格', color: 'text-orange-600' }
    return { level: '需要提升', color: 'text-red-600' }
  }

  const getRecommendations = (percentage: number, categories: Record<string, number>) => {
    const recommendations = []
    
    if (percentage < 70) {
      recommendations.push({
        title: '整体提升建议',
        content: '建议您系统学习儿童照护相关知识，可以参考我们的知识科普馆获取专业指导。'
      })
    }

    Object.entries(categories).forEach(([category, score]) => {
      if (score < 70) {
        switch (category) {
          case '日常照护':
            recommendations.push({
              title: '日常照护能力提升',
              content: '建议加强学习儿童营养搭配、作息安排、卫生习惯培养等方面的知识和技能。'
            })
            break
          case '健康管理':
            recommendations.push({
              title: '健康管理能力提升',
              content: '建议学习儿童常见疾病识别、预防保健、营养健康等相关知识。'
            })
            break
          case '安全防护':
            recommendations.push({
              title: '安全防护意识提升',
              content: '建议加强家庭安全隐患识别、儿童安全教育、应急处理等方面的学习。'
            })
            break
          case '情感支持':
            recommendations.push({
              title: '情感支持能力提升',
              content: '建议学习儿童心理发展特点、情感沟通技巧、亲子关系建立等方面的知识。'
            })
            break
        }
      }
    })

    return recommendations
  }

  const scoreLevel = getScoreLevel(result.percentage)
  const recommendations = getRecommendations(result.percentage, result.categories)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button asChild variant="outline" size="sm" className="mr-4">
                <Link href="/assessment">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回评估中心
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">儿童照护能力评估结果</h1>
                <p className="text-gray-600">完成时间：{new Date(result.completedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享结果
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="p-8 mb-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-gray-900 mb-2">{result.percentage}</div>
              <div className="text-xl text-gray-600">总体得分</div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${scoreLevel.bgColor} ${scoreLevel.color} mb-4`}>
              {scoreLevel.level}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              您在儿童照护能力方面的表现为{scoreLevel.level}水平。
              {result.percentage >= 80 ? '继续保持，您是一位优秀的照护者！' : '还有提升空间，建议参考下方的改进建议。'}
            </p>
          </div>
        </Card>

        {/* Category Scores */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" />
            各维度得分详情
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result.categories).map(([category, score]) => {
              const categoryLevel = getCategoryLevel(score)
              return (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{category}</h3>
                    <span className={`text-sm font-medium ${categoryLevel.color}`}>
                      {categoryLevel.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{score}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
              个性化提升建议
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{rec.title}</h3>
                  <p className="text-blue-800">{rec.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/knowledge" className="text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="font-semibold">学习知识</div>
              <div className="text-sm text-gray-600">浏览科学照护知识</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/experience" className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="font-semibold">实践体验</div>
              <div className="text-sm text-gray-600">参与情境体验训练</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/support/consultation" className="text-center">
              <Share2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-semibold">专业咨询</div>
              <div className="text-sm text-gray-600">获取个性化指导</div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
