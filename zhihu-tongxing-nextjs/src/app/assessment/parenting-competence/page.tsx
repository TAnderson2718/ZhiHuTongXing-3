'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, GraduationCap, Settings, BookOpen, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface Question {
  id: number
  category: string
  question: string
  options: { value: number; label: string }[]
}

export default function ParentingCompetenceAssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions: Question[] = [
    // 教养策略维度 (12题)
    {
      id: 1,
      category: '教养策略',
      question: '我能够根据孩子的年龄特点选择合适的教养方法',
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
      category: '教养策略',
      question: '我能够制定并执行一致的家庭规则',
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
      category: '教养策略',
      question: '我能够平衡严格管教和温暖关爱',
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
      category: '教养策略',
      question: '我能够根据具体情况灵活调整教养方式',
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
      category: '教养策略',
      question: '我能够使用正面强化来鼓励孩子的良好行为',
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
      category: '教养策略',
      question: '我能够设定合理的期望和目标',
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
      category: '教养策略',
      question: '我能够培养孩子的独立性和自主性',
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
      category: '教养策略',
      question: '我能够教导孩子承担责任和后果',
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
      category: '教养策略',
      question: '我能够建立积极的亲子互动模式',
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
      category: '教养策略',
      question: '我能够尊重孩子的个性和特点',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 11,
      category: '教养策略',
      question: '我能够为孩子提供安全感和归属感',
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
      category: '教养策略',
      question: '我能够在教养中保持耐心和一致性',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 行为管理维度 (12题)
    {
      id: 13,
      category: '行为管理',
      question: '我能够有效预防孩子的问题行为',
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
      category: '行为管理',
      question: '我能够冷静处理孩子的不当行为',
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
      category: '行为管理',
      question: '我能够使用适当的纪律措施',
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
      category: '行为管理',
      question: '我能够帮助孩子理解行为的后果',
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
      category: '行为管理',
      question: '我能够建立有效的奖惩制度',
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
      category: '行为管理',
      question: '我能够教导孩子自我控制的技巧',
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
      category: '行为管理',
      question: '我能够识别孩子行为背后的需求',
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
      category: '行为管理',
      question: '我能够引导孩子发展良好的习惯',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 21,
      category: '行为管理',
      question: '我能够处理孩子的情绪爆发',
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
      category: '行为管理',
      question: '我能够保持管教的一致性',
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
      category: '行为管理',
      question: '我能够使用积极的行为改变策略',
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
      category: '行为管理',
      question: '我能够帮助孩子学会解决问题',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 学习支持维度 (11题)
    {
      id: 25,
      category: '学习支持',
      question: '我能够为孩子创造良好的学习环境',
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
      category: '学习支持',
      question: '我能够帮助孩子制定学习计划',
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
      category: '学习支持',
      question: '我能够激发孩子的学习兴趣',
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
      category: '学习支持',
      question: '我能够指导孩子的学习方法',
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
      category: '学习支持',
      question: '我能够培养孩子的学习习惯',
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
      category: '学习支持',
      question: '我能够适当参与孩子的学习过程',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 31,
      category: '学习支持',
      question: '我能够鼓励孩子面对学习挑战',
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
      category: '学习支持',
      question: '我能够帮助孩子建立学习目标',
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
      category: '学习支持',
      question: '我能够与老师有效沟通孩子的学习情况',
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
      category: '学习支持',
      question: '我能够培养孩子的创造性思维',
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
      category: '学习支持',
      question: '我能够帮助孩子发展批判性思维',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 社交指导维度 (10题)
    {
      id: 36,
      category: '社交指导',
      question: '我能够教导孩子基本的社交礼仪',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 37,
      category: '社交指导',
      question: '我能够帮助孩子建立友谊',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 38,
      category: '社交指导',
      question: '我能够指导孩子处理同伴冲突',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 39,
      category: '社交指导',
      question: '我能够培养孩子的同理心',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 40,
      category: '社交指导',
      question: '我能够教导孩子合作与分享',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 41,
      category: '社交指导',
      question: '我能够帮助孩子发展沟通技巧',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 42,
      category: '社交指导',
      question: '我能够指导孩子适应不同的社交环境',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 43,
      category: '社交指导',
      question: '我能够培养孩子的领导能力',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 44,
      category: '社交指导',
      question: '我能够教导孩子尊重他人的差异',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },
    {
      id: 45,
      category: '社交指导',
      question: '我能够帮助孩子建立健康的人际关系',
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
    
    // 保存结果到localStorage
    const result = {
      type: 'parenting-competence',
      totalScore,
      maxScore,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      categories: {
        '教养策略': calculateCategoryScore('教养策略'),
        '行为管理': calculateCategoryScore('行为管理'),
        '学习支持': calculateCategoryScore('学习支持'),
        '社交指导': calculateCategoryScore('社交指导')
      }
    }
    
    localStorage.setItem('parenting-competence-result', JSON.stringify(result))
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
            您的父母教养能力评估已完成，正在为您生成详细的分析报告...
          </p>
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
            <Link href="/assessment/parenting-competence/result">
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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-orange-500" />
                父母教养能力量表
              </h1>
              <p className="text-gray-600">评估您的教养技能和策略水平</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
            <div className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-4 ${
              currentQ.category === '教养策略' ? 'bg-orange-100 text-orange-800' :
              currentQ.category === '行为管理' ? 'bg-red-100 text-red-800' :
              currentQ.category === '学习支持' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
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
                    ? 'border-orange-500 bg-orange-50'
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
                    ? 'border-orange-500 bg-orange-500'
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
            className="flex items-center bg-orange-500 hover:bg-orange-600"
          >
            {currentQuestion === questions.length - 1 ? '完成评估' : '下一题'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
