'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Lightbulb, Heart, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface Question {
  id: number
  category: string
  question: string
  options: { value: number; label: string }[]
}

export default function ParentalSelfEfficacyAssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions: Question[] = [
    // 育儿信心维度 (7题)
    {
      id: 1,
      category: '育儿信心',
      question: '我相信自己有能力成为一个好父母/母亲',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 2,
      category: '育儿信心',
      question: '我对自己的育儿技能感到自信',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 3,
      category: '育儿信心',
      question: '我相信自己能够满足孩子的各种需求',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 4,
      category: '育儿信心',
      question: '即使遇到育儿挑战，我也相信自己能够应对',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 5,
      category: '育儿信心',
      question: '我觉得自己在育儿方面做得很好',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 6,
      category: '育儿信心',
      question: '我相信自己的育儿决定是正确的',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },
    {
      id: 7,
      category: '育儿信心',
      question: '我对自己作为父母的角色感到满意',
      options: [
        { value: 1, label: '完全不同意' },
        { value: 2, label: '不太同意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较同意' },
        { value: 5, label: '完全同意' }
      ]
    },

    // 问题解决能力维度 (6题)
    {
      id: 8,
      category: '问题解决能力',
      question: '当孩子出现行为问题时，我知道如何处理',
      options: [
        { value: 1, label: '完全不知道' },
        { value: 2, label: '不太知道' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较知道' },
        { value: 5, label: '完全知道' }
      ]
    },
    {
      id: 9,
      category: '问题解决能力',
      question: '我能够找到解决育儿问题的有效方法',
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
      category: '问题解决能力',
      question: '面对新的育儿挑战时，我能够快速适应',
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
      category: '问题解决能力',
      question: '我能够从育儿错误中学习并改进',
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
      category: '问题解决能力',
      question: '我能够制定并执行有效的育儿计划',
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
      category: '问题解决能力',
      question: '我能够灵活调整育儿策略以适应孩子的变化',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 情绪调节维度 (6题)
    {
      id: 14,
      category: '情绪调节',
      question: '在育儿过程中，我能够很好地控制自己的情绪',
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
      category: '情绪调节',
      question: '即使孩子让我感到沮丧，我也能保持冷静',
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
      category: '情绪调节',
      question: '我能够管理育儿带来的压力和焦虑',
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
      category: '情绪调节',
      question: '我能够在育儿中保持积极的心态',
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
      category: '情绪调节',
      question: '我能够从育儿挫折中快速恢复',
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
      category: '情绪调节',
      question: '我能够在孩子面前展现情绪稳定的一面',
      options: [
        { value: 1, label: '完全不能' },
        { value: 2, label: '基本不能' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较能够' },
        { value: 5, label: '完全能够' }
      ]
    },

    // 支持寻求维度 (6题)
    {
      id: 20,
      category: '支持寻求',
      question: '当我需要育儿建议时，我知道向谁求助',
      options: [
        { value: 1, label: '完全不知道' },
        { value: 2, label: '不太知道' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较知道' },
        { value: 5, label: '完全知道' }
      ]
    },
    {
      id: 21,
      category: '支持寻求',
      question: '我愿意向他人寻求育儿帮助',
      options: [
        { value: 1, label: '完全不愿意' },
        { value: 2, label: '不太愿意' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较愿意' },
        { value: 5, label: '完全愿意' }
      ]
    },
    {
      id: 22,
      category: '支持寻求',
      question: '我能够有效利用各种育儿资源',
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
      category: '支持寻求',
      question: '我有可靠的育儿支持网络',
      options: [
        { value: 1, label: '完全没有' },
        { value: 2, label: '基本没有' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较有' },
        { value: 5, label: '完全有' }
      ]
    },
    {
      id: 24,
      category: '支持寻求',
      question: '我能够识别何时需要专业的育儿指导',
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
      category: '支持寻求',
      question: '我会主动学习新的育儿知识和技能',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
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
      type: 'parental-self-efficacy',
      totalScore,
      maxScore,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      categories: {
        '育儿信心': calculateCategoryScore('育儿信心'),
        '问题解决能力': calculateCategoryScore('问题解决能力'),
        '情绪调节': calculateCategoryScore('情绪调节'),
        '支持寻求': calculateCategoryScore('支持寻求')
      }
    }
    
    localStorage.setItem('parental-self-efficacy-result', JSON.stringify(result))
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
            您的父母自我效能感评估已完成，正在为您生成详细的分析报告...
          </p>
          <Button asChild className="w-full bg-purple-500 hover:bg-purple-600">
            <Link href="/assessment/parental-self-efficacy/result">
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
                <Brain className="w-6 h-6 mr-2 text-purple-500" />
                父母自我效能感量表
              </h1>
              <p className="text-gray-600">评估您对自己育儿能力的信心水平</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
              currentQ.category === '育儿信心' ? 'bg-purple-100 text-purple-800' :
              currentQ.category === '问题解决能力' ? 'bg-blue-100 text-blue-800' :
              currentQ.category === '情绪调节' ? 'bg-green-100 text-green-800' :
              'bg-orange-100 text-orange-800'
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
                    ? 'border-purple-500 bg-purple-50'
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
                    ? 'border-purple-500 bg-purple-500'
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
            className="flex items-center bg-purple-500 hover:bg-purple-600"
          >
            {currentQuestion === questions.length - 1 ? '完成评估' : '下一题'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
