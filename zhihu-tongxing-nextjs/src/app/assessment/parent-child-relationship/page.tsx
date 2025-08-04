'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Heart, MessageCircle, Users, Smile } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface Question {
  id: number
  category: string
  question: string
  options: { value: number; label: string }[]
}

export default function ParentChildRelationshipAssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const questions: Question[] = [
    // 亲密度维度 (8题)
    {
      id: 1,
      category: '亲密度',
      question: '您和孩子之间有很多亲密的时刻吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 2,
      category: '亲密度',
      question: '孩子愿意主动与您分享他/她的想法和感受吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 3,
      category: '亲密度',
      question: '您感觉与孩子的关系很亲近吗？',
      options: [
        { value: 1, label: '完全不亲近' },
        { value: 2, label: '不太亲近' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较亲近' },
        { value: 5, label: '非常亲近' }
      ]
    },
    {
      id: 4,
      category: '亲密度',
      question: '孩子遇到困难时会主动寻求您的帮助吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 5,
      category: '亲密度',
      question: '您和孩子经常有身体接触（如拥抱、亲吻）吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 6,
      category: '亲密度',
      question: '您觉得孩子信任您吗？',
      options: [
        { value: 1, label: '完全不信任' },
        { value: 2, label: '不太信任' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较信任' },
        { value: 5, label: '非常信任' }
      ]
    },
    {
      id: 7,
      category: '亲密度',
      question: '您和孩子之间有特殊的亲子仪式或传统吗？',
      options: [
        { value: 1, label: '完全没有' },
        { value: 2, label: '很少' },
        { value: 3, label: '有一些' },
        { value: 4, label: '比较多' },
        { value: 5, label: '很多' }
      ]
    },
    {
      id: 8,
      category: '亲密度',
      question: '孩子会主动表达对您的爱意吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },

    // 沟通质量维度 (8题)
    {
      id: 9,
      category: '沟通质量',
      question: '您能够耐心倾听孩子说话吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 10,
      category: '沟通质量',
      question: '您和孩子的对话是双向的、互动的吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 11,
      category: '沟通质量',
      question: '您能够理解孩子表达的意思吗？',
      options: [
        { value: 1, label: '完全不理解' },
        { value: 2, label: '不太理解' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较理解' },
        { value: 5, label: '完全理解' }
      ]
    },
    {
      id: 12,
      category: '沟通质量',
      question: '您会用孩子能理解的方式与他/她交流吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 13,
      category: '沟通质量',
      question: '您和孩子讨论问题时气氛是轻松愉快的吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 14,
      category: '沟通质量',
      question: '您会鼓励孩子表达自己的观点吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 15,
      category: '沟通质量',
      question: '您能够控制自己的情绪，避免对孩子大喊大叫吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 16,
      category: '沟通质量',
      question: '您会主动与孩子分享您的想法和感受吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },

    // 冲突处理维度 (7题)
    {
      id: 17,
      category: '冲突处理',
      question: '当您和孩子发生分歧时，您能够保持冷静吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 18,
      category: '冲突处理',
      question: '您会尝试理解孩子的立场和感受吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 19,
      category: '冲突处理',
      question: '您能够与孩子一起寻找解决问题的方法吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 20,
      category: '冲突处理',
      question: '冲突结束后，您会主动修复与孩子的关系吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 21,
      category: '冲突处理',
      question: '您会向孩子道歉当您做错事情时吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 22,
      category: '冲突处理',
      question: '您能够教导孩子如何处理冲突吗？',
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
      category: '冲突处理',
      question: '您和孩子的冲突通常能够得到妥善解决吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },

    // 共同活动维度 (7题)
    {
      id: 24,
      category: '共同活动',
      question: '您经常与孩子一起进行游戏或娱乐活动吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 25,
      category: '共同活动',
      question: '您会主动安排与孩子的亲子时间吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 26,
      category: '共同活动',
      question: '您和孩子一起参与户外活动的频率如何？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 27,
      category: '共同活动',
      question: '您会与孩子一起阅读或学习吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 28,
      category: '共同活动',
      question: '您和孩子一起做家务或日常活动吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 29,
      category: '共同活动',
      question: '您会根据孩子的兴趣安排活动吗？',
      options: [
        { value: 1, label: '从不' },
        { value: 2, label: '很少' },
        { value: 3, label: '有时' },
        { value: 4, label: '经常' },
        { value: 5, label: '总是' }
      ]
    },
    {
      id: 30,
      category: '共同活动',
      question: '您和孩子在共同活动中都感到快乐吗？',
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
      type: 'parent-child-relationship',
      totalScore,
      maxScore,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      categories: {
        '亲密度': calculateCategoryScore('亲密度'),
        '沟通质量': calculateCategoryScore('沟通质量'),
        '冲突处理': calculateCategoryScore('冲突处理'),
        '共同活动': calculateCategoryScore('共同活动')
      }
    }
    
    localStorage.setItem('parent-child-relationship-result', JSON.stringify(result))
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
            您的亲子关系评估已完成，正在为您生成详细的分析报告...
          </p>
          <Button asChild className="w-full">
            <Link href="/assessment/parent-child-relationship/result">
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
                <Heart className="w-6 h-6 mr-2 text-red-500" />
                亲子关系量表
              </h1>
              <p className="text-gray-600">评估您与孩子之间的关系质量</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
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
              currentQ.category === '亲密度' ? 'bg-red-100 text-red-800' :
              currentQ.category === '沟通质量' ? 'bg-blue-100 text-blue-800' :
              currentQ.category === '冲突处理' ? 'bg-yellow-100 text-yellow-800' :
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
                    ? 'border-red-500 bg-red-50'
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
                    ? 'border-red-500 bg-red-500'
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
            className="flex items-center bg-red-500 hover:bg-red-600"
          >
            {currentQuestion === questions.length - 1 ? '完成评估' : '下一题'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
