'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Loader2,
  Edit3
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface Question {
  id: string
  text: string
  type: 'single' | 'multiple' | 'scale' | 'text'
  options?: string[]
  required: boolean
  order: number
}

interface Assessment {
  id: string
  name: string
  questions: Question[]
}

export default function EditAssessmentQuestionsPage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  // Mock assessment data with questions
  const mockAssessment: Assessment = {
    id: assessmentId,
    name: 'SDQ行为评估量表',
    questions: [
      {
        id: '1',
        text: '孩子是否经常表现出不安或焦虑？',
        type: 'scale',
        options: ['从不', '很少', '有时', '经常', '总是'],
        required: true,
        order: 1
      },
      {
        id: '2',
        text: '孩子是否容易与其他孩子发生冲突？',
        type: 'scale',
        options: ['从不', '很少', '有时', '经常', '总是'],
        required: true,
        order: 2
      },
      {
        id: '3',
        text: '孩子在学校或家庭中的主要行为问题是什么？',
        type: 'text',
        required: false,
        order: 3
      }
    ]
  }

  useEffect(() => {
    if (adminUser) {
      // Simulate loading assessment data
      const loadAssessmentData = () => {
        setTimeout(() => {
          setAssessment(mockAssessment)
          setQuestions(mockAssessment.questions.sort((a, b) => a.order - b.order))
          setIsLoadingData(false)
        }, 500)
      }

      loadAssessmentData()
    }
  }, [adminUser, assessmentId])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'single',
      options: ['选项1', '选项2'],
      required: true,
      order: questions.length + 1
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ))
  }

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId)
    // Reorder remaining questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }))
    setQuestions(reorderedQuestions)
  }

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return
    }

    const newQuestions = [...questions]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    // Swap questions
    const temp = newQuestions[currentIndex]!
    newQuestions[currentIndex] = newQuestions[targetIndex]!
    newQuestions[targetIndex] = temp
    
    // Update order numbers
    newQuestions.forEach((q, index) => {
      q.order = index + 1
    })
    
    setQuestions(newQuestions)
  }

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options, `选项${question.options.length + 1}`]
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, this would be an API call to update the assessment questions
      console.log('Updating assessment questions:', { 
        assessmentId, 
        questions: questions.map(q => ({ ...q, order: q.order }))
      })
      
      // Redirect back to assessment edit page
      router.push(`/admin/assessment/edit/${assessmentId}`)
    } catch (error) {
      console.error('Error updating assessment questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !adminUser || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{authLoading || !adminUser ? '验证登录状态...' : '加载题目数据...'}</p>
        </div>
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
              <Link href={`/admin/assessment/edit/${assessmentId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回基本信息
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">编辑题目</h1>
              <p className="text-gray-600">{assessment?.name} - 题目管理</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">题目 {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveQuestion(question.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveQuestion(question.id, 'down')}
                      disabled={index === questions.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      题目内容 *
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="请输入题目内容"
                      required
                    />
                  </div>

                  {/* Question Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        题目类型
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, { 
                          type: e.target.value as Question['type'],
                          options: e.target.value === 'text' ? undefined : question.options || ['选项1', '选项2']
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="single">单选题</option>
                        <option value="multiple">多选题</option>
                        <option value="scale">量表题</option>
                        <option value="text">文本题</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">必答题</span>
                      </label>
                    </div>
                  </div>

                  {/* Options (for non-text questions) */}
                  {question.type !== 'text' && question.options && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        选项设置
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`选项 ${optionIndex + 1}`}
                              className="flex-1"
                            />
                            {question.options!.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          添加选项
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Add Question Button */}
            <Card className="p-6 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuestion}
                  className="flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加新题目
                </Button>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button asChild variant="outline">
              <Link href={`/admin/assessment/edit/${assessmentId}`}>
                返回基本信息
              </Link>
            </Button>

            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href="/admin/assessment">
                  取消
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading || questions.length === 0}
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? '保存中...' : '保存题目'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
