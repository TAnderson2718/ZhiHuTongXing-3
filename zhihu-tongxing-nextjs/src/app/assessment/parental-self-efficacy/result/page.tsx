'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, Brain, Lightbulb, Heart, Users, AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react'
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

export default function ParentalSelfEfficacyResultPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取评估结果
    const savedResult = localStorage.getItem('parental-self-efficacy-result')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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
            请先完成父母自我效能感评估
          </p>
          <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
            <Link href="/assessment/parental-self-efficacy">
              开始评估
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 90) return { level: '非常自信', color: 'text-green-600', bgColor: 'bg-green-100', description: '您对自己的育儿能力非常有信心，继续保持这种积极的心态！' }
    if (percentage >= 80) return { level: '比较自信', color: 'text-blue-600', bgColor: 'bg-blue-100', description: '您对自己的育儿能力比较有信心，还有进一步提升的空间。' }
    if (percentage >= 70) return { level: '一般自信', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: '您的育儿自信心处于中等水平，建议加强学习和实践。' }
    if (percentage >= 60) return { level: '缺乏自信', color: 'text-orange-600', bgColor: 'bg-orange-100', description: '您对育儿能力缺乏信心，建议寻求支持和指导。' }
    return { level: '非常缺乏自信', color: 'text-red-600', bgColor: 'bg-red-100', description: '建议寻求专业帮助，提升育儿信心和能力。' }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '育儿信心': return <Brain className="w-5 h-5 text-purple-500" />
      case '问题解决能力': return <Lightbulb className="w-5 h-5 text-blue-500" />
      case '情绪调节': return <Heart className="w-5 h-5 text-green-500" />
      case '支持寻求': return <Users className="w-5 h-5 text-orange-500" />
      default: return <Brain className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'text-green-600' }
    if (score >= 80) return { level: '良好', color: 'text-blue-600' }
    if (score >= 70) return { level: '中等', color: 'text-yellow-600' }
    if (score >= 60) return { level: '需要提升', color: 'text-orange-600' }
    return { level: '需要加强', color: 'text-red-600' }
  }

  const getRecommendations = (percentage: number, categories: Record<string, number>) => {
    const recommendations = []
    
    if (percentage < 70) {
      recommendations.push({
        title: '整体自信心提升',
        content: '建议您多关注自己的育儿成就，记录成功的育儿经历，逐步建立对自己能力的信心。'
      })
    }

    Object.entries(categories).forEach(([category, score]) => {
      if (score < 70) {
        switch (category) {
          case '育儿信心':
            recommendations.push({
              title: '增强育儿信心',
              content: '多关注自己的育儿优点，设定小目标并逐步实现，与其他成功的父母交流经验。'
            })
            break
          case '问题解决能力':
            recommendations.push({
              title: '提升问题解决能力',
              content: '学习系统的问题解决方法，多实践和反思，从错误中学习，制定具体的行动计划。'
            })
            break
          case '情绪调节':
            recommendations.push({
              title: '改善情绪管理',
              content: '学习情绪调节技巧，如深呼吸、正念练习，建立健康的压力释放方式，保持积极心态。'
            })
            break
          case '支持寻求':
            recommendations.push({
              title: '建立支持网络',
              content: '主动寻求家人朋友的支持，加入育儿社群，不要害怕寻求专业帮助，持续学习新知识。'
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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-500" />
                  父母自我效能感评估结果
                </h1>
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
              <div className="text-xl text-gray-600">自我效能感得分</div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${scoreLevel.bgColor} ${scoreLevel.color} mb-4`}>
              {scoreLevel.level}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {scoreLevel.description}
            </p>
          </div>
        </Card>

        {/* Category Scores */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-500" />
            各维度得分详情
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result.categories).map(([category, score]) => {
              const categoryLevel = getCategoryLevel(score)
              return (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <h3 className="font-semibold text-gray-900 ml-2">{category}</h3>
                    </div>
                    <span className={`text-sm font-medium ${categoryLevel.color}`}>
                      {categoryLevel.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                <div key={index} className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">{rec.title}</h3>
                  <p className="text-purple-800">{rec.content}</p>
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
              <div className="text-sm text-gray-600">提升育儿技能</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/training" className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="font-semibold">技能培训</div>
              <div className="text-sm text-gray-600">参与专业培训</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/support/consultation" className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-semibold">寻求支持</div>
              <div className="text-sm text-gray-600">获取专业指导</div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
