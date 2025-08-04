'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Users, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface Question {
  id: number
  category: string
  question: string
  options: { value: number; label: string }[]
}

export default function ChildcareAbilityAssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions: Question[] = [
    // 日常照护维度 (10题)
    {
      id: 1,
      category: '日常照护',
      question: '您能够熟练地为孩子准备营养均衡的餐食吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 2,
      category: '日常照护',
      question: '您能够根据孩子的年龄特点安排合适的作息时间吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 3,
      category: '日常照护',
      question: '您能够正确地为孩子选择和搭配衣物吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 4,
      category: '日常照护',
      question: '您能够培养孩子良好的个人卫生习惯吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 5,
      category: '日常照护',
      question: '您能够帮助孩子建立规律的睡眠习惯吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 6,
      category: '日常照护',
      question: '您能够合理安排孩子的游戏和学习时间吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 7,
      category: '日常照护',
      question: '您能够耐心地教导孩子生活自理技能吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 8,
      category: '日常照护',
      question: '您能够根据天气变化为孩子做好防护准备吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 9,
      category: '日常照护',
      question: '您能够创造温馨舒适的家庭环境吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 10,
      category: '日常照护',
      question: '您能够合理控制孩子使用电子设备的时间吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 健康管理维度 (10题)
    {
      id: 11,
      category: '健康管理',
      question: '您能够及时发现孩子身体不适的症状吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 12,
      category: '健康管理',
      question: '您能够正确处理孩子的常见疾病吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 13,
      category: '健康管理',
      question: '您能够按时带孩子进行健康检查和疫苗接种吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 14,
      category: '健康管理',
      question: '您能够为孩子制定合理的运动计划吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 15,
      category: '健康管理',
      question: '您能够关注并保护孩子的视力健康吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 16,
      category: '健康管理',
      question: '您能够合理安排孩子的饮食营养吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 17,
      category: '健康管理',
      question: '您能够教导孩子正确的健康知识吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 18,
      category: '健康管理',
      question: '您能够关注孩子的心理健康状况吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 19,
      category: '健康管理',
      question: '您能够为孩子建立健康的生活方式吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 20,
      category: '健康管理',
      question: '您能够在紧急情况下正确处理孩子的健康问题吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 安全防护维度 (10题)
    {
      id: 21,
      category: '安全防护',
      question: '您能够识别家庭环境中的安全隐患吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 22,
      category: '安全防护',
      question: '您能够教导孩子基本的安全知识吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 23,
      category: '安全防护',
      question: '您能够在外出时确保孩子的安全吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 24,
      category: '安全防护',
      question: '您能够正确使用和存放家庭药品吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 25,
      category: '安全防护',
      question: '您能够教导孩子网络安全知识吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 26,
      category: '安全防护',
      question: '您能够处理孩子的意外伤害吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 27,
      category: '安全防护',
      question: '您能够为孩子选择安全的玩具和用品吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 28,
      category: '安全防护',
      question: '您能够教导孩子如何应对陌生人吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 29,
      category: '安全防护',
      question: '您能够确保孩子在交通出行中的安全吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 30,
      category: '安全防护',
      question: '您能够建立家庭应急预案吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 情感支持维度 (5题)
    {
      id: 31,
      category: '情感支持',
      question: '您能够理解和回应孩子的情感需求吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 32,
      category: '情感支持',
      question: '您能够给予孩子足够的关爱和陪伴吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 33,
      category: '情感支持',
      question: '您能够帮助孩子建立自信心吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 34,
      category: '情感支持',
      question: '您能够在孩子遇到困难时给予适当的支持吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 35,
      category: '情感支持',
      question: '您能够与孩子建立良好的亲子关系吗？',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    }
  ]

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // 计算得分和生成结果
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = questions.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)
    
    // 保存结果到localStorage（实际项目中应该保存到数据库）
    const result = {
      type: 'childcare-ability',
      totalScore,
      maxScore,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      categories: {
        '日常照护': calculateCategoryScore('日常照护'),
        '健康管理': calculateCategoryScore('健康管理'),
        '安全防护': calculateCategoryScore('安全防护'),
        '情感支持': calculateCategoryScore('情感支持')
      }
    }
    
    localStorage.setItem('childcare-ability-result', JSON.stringify(result))
    setIsCompleted(true)
  }

  const calculateCategoryScore = (category: string) => {
    const categoryQuestions = questions.filter(q => q.category === category)
    const categoryAnswers = categoryQuestions.map(q => answers[q.id] || 0)
    const categoryTotal = categoryAnswers.reduce((sum, score) => sum + score, 0)
    const categoryMax = categoryQuestions.length * 5
    return Math.round((categoryTotal / categoryMax) * 100)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">评估完成！</h2>
          <p className="text-gray-600 mb-6">
            您的儿童照护能力评估已完成，正在为您生成详细的分析报告...
          </p>
          <Button asChild className="w-full">
            <Link href="/assessment/childcare-ability/result">
              查看评估结果
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button asChild variant="outline" size="sm" className="mr-4">
              <Link href="/assessment">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回评估中心
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">儿童照护能力评估</h1>
              <p className="text-gray-600">评估您在儿童照护方面的能力水平</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>第 {currentQuestion + 1} 题，共 {questions.length} 题</span>
            <span>{Math.round(progress)}% 完成</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8">
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">
              {currentQ.category}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQ.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={() => handleAnswer(currentQ.id, option.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  answers[currentQ.id] === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQ.id] === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </div>
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一题
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="flex items-center"
          >
            {currentQuestion === questions.length - 1 ? '完成评估' : '下一题'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
