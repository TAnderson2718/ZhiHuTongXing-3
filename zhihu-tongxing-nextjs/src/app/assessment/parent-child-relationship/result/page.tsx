'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, Heart, MessageCircle, Users, Smile, AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react'
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

export default function ParentChildRelationshipResultPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取评估结果
    const savedResult = localStorage.getItem('parent-child-relationship-result')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
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
            请先完成亲子关系评估
          </p>
          <Button asChild className="w-full bg-red-500 hover:bg-red-600">
            <Link href="/assessment/parent-child-relationship">
              开始评估
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 90) return { level: '优秀', color: 'text-green-600', bgColor: 'bg-green-100', description: '您与孩子的关系非常和谐，继续保持！' }
    if (percentage >= 80) return { level: '良好', color: 'text-blue-600', bgColor: 'bg-blue-100', description: '您与孩子的关系总体良好，还有进一步提升的空间。' }
    if (percentage >= 70) return { level: '中等', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: '您与孩子的关系处于中等水平，建议加强沟通和互动。' }
    if (percentage >= 60) return { level: '需要关注', color: 'text-orange-600', bgColor: 'bg-orange-100', description: '您与孩子的关系需要更多关注和改善。' }
    return { level: '需要改善', color: 'text-red-600', bgColor: 'bg-red-100', description: '建议寻求专业指导，改善亲子关系。' }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '亲密度': return <Heart className="w-5 h-5 text-red-500" />
      case '沟通质量': return <MessageCircle className="w-5 h-5 text-blue-500" />
      case '冲突处理': return <Users className="w-5 h-5 text-yellow-500" />
      case '共同活动': return <Smile className="w-5 h-5 text-green-500" />
      default: return <Heart className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'text-green-600' }
    if (score >= 80) return { level: '良好', color: 'text-blue-600' }
    if (score >= 70) return { level: '中等', color: 'text-yellow-600' }
    if (score >= 60) return { level: '需要关注', color: 'text-orange-600' }
    return { level: '需要改善', color: 'text-red-600' }
  }

  const getRecommendations = (percentage: number, categories: Record<string, number>) => {
    const recommendations = []
    
    if (percentage < 70) {
      recommendations.push({
        title: '整体关系改善建议',
        content: '建议您多花时间与孩子相处，增加亲子互动的质量和频率，可以参考我们的专业指导获取更多建议。'
      })
    }

    Object.entries(categories).forEach(([category, score]) => {
      if (score < 70) {
        switch (category) {
          case '亲密度':
            recommendations.push({
              title: '增进亲密关系',
              content: '建议增加与孩子的身体接触（拥抱、亲吻），创建专属的亲子时光，多倾听孩子的想法和感受。'
            })
            break
          case '沟通质量':
            recommendations.push({
              title: '改善沟通方式',
              content: '学习积极倾听技巧，用孩子能理解的语言交流，控制情绪，鼓励孩子表达自己的观点。'
            })
            break
          case '冲突处理':
            recommendations.push({
              title: '优化冲突处理',
              content: '学习冷静处理分歧的方法，尝试理解孩子的立场，与孩子一起寻找解决方案，及时修复关系。'
            })
            break
          case '共同活动':
            recommendations.push({
              title: '增加共同活动',
              content: '主动安排亲子时间，根据孩子的兴趣选择活动，增加户外活动和学习时间，享受共同的快乐时光。'
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
                  <Heart className="w-6 h-6 mr-2 text-red-500" />
                  亲子关系评估结果
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
              <div className="text-xl text-gray-600">亲子关系得分</div>
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
            <Target className="w-6 h-6 mr-2 text-red-500" />
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
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
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
              个性化改善建议
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">{rec.title}</h3>
                  <p className="text-red-800">{rec.content}</p>
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
              <div className="text-sm text-gray-600">了解亲子关系建设</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/experience" className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="font-semibold">情感体验</div>
              <div className="text-sm text-gray-600">参与亲子互动训练</div>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4">
            <Link href="/support/consultation" className="text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-semibold">专业咨询</div>
              <div className="text-sm text-gray-600">获取个性化指导</div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
