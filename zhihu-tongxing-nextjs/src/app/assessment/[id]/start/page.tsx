'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

// 评估问题数据
const assessmentData = {
  comprehensive: {
    title: '儿童照护能力综合评估',
    description: '本评估旨在全面了解您在各项照护工作中的情况。',
    questions: [
      {
        id: 1,
        question: '当孩子挑食、不肯好好吃饭时，我通常会？',
        options: [
          '耐心引导，并尝试用更有趣的方式呈现食物。',
          '顺其自然，饿了总会吃的。',
          '有些生气，并强制要求孩子必须吃完。'
        ]
      },
      {
        id: 2,
        question: '面对孩子的情绪爆发时，我的第一反应是？',
        options: [
          '先让自己冷静下来，然后耐心倾听孩子的感受。',
          '立即制止孩子的不当行为。',
          '感到无助，不知道该如何应对。'
        ]
      },
      {
        id: 3,
        question: '在孩子的安全防护方面，我认为最重要的是？',
        options: [
          '提前预防，创造安全的环境。',
          '教会孩子识别和避免危险。',
          '时刻监督，不让孩子离开视线。'
        ]
      },
      {
        id: 4,
        question: '当孩子问我不懂的问题时，我会？',
        options: [
          '诚实告诉孩子我不知道，然后一起寻找答案。',
          '随便给个答案，反正孩子也不会深究。',
          '转移话题，避免回答这个问题。'
        ]
      }
    ]
  },
  sdq: {
    title: '长处和困难问卷 (SDQ)',
    description: '请根据您孩子最近六个月的情况进行回答。',
    questions: [
      {
        id: 1,
        question: '我的孩子是否体贴他人感受？',
        options: ['不符合', '有点符合', '完全符合']
      },
      {
        id: 2,
        question: '我的孩子是否坐立不安，过度活跃？',
        options: ['不符合', '有点符合', '完全符合']
      },
      {
        id: 3,
        question: '我的孩子是否经常抱怨头痛、肚子痛或感到不舒服？',
        options: ['不符合', '有点符合', '完全符合']
      },
      {
        id: 4,
        question: '我的孩子是否愿意与其他孩子分享？',
        options: ['不符合', '有点符合', '完全符合']
      },
      {
        id: 5,
        question: '我的孩子是否经常发脾气或脾气暴躁？',
        options: ['不符合', '有点符合', '完全符合']
      }
    ]
  },
  embu: {
    title: '父母教育方式量表 (EMBU)',
    description: '本评估旨在帮助您了解自身的教养方式特点。',
    questions: [
      {
        id: 1,
        question: '在孩子犯错后，我倾向于？',
        options: [
          '严厉地批评，并告知其后果。',
          '与孩子一起讨论为什么会犯错，并引导他思考如何改正。',
          '暂时不作声，让他自己"冷静"一下。'
        ]
      },
      {
        id: 2,
        question: '当孩子取得成就时，我通常会？',
        options: [
          '给予热情的表扬和鼓励。',
          '简单地说"不错"，然后继续做自己的事。',
          '提醒孩子不要骄傲，还有更多需要努力的地方。'
        ]
      },
      {
        id: 3,
        question: '对于孩子的日常活动安排，我倾向于？',
        options: [
          '严格按照我制定的计划执行。',
          '与孩子商量，共同制定合理的安排。',
          '让孩子自己决定，我很少干预。'
        ]
      }
    ]
  }
}

export default function AssessmentStartPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params.id as string
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const assessment = assessmentData[assessmentId as keyof typeof assessmentData]

  useEffect(() => {
    if (!assessment) {
      router.push('/assessment')
    }
  }, [assessment, router])

  if (!assessment) {
    return <div>评估不存在</div>
  }

  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100
  const currentQ = assessment.questions[currentQuestion]

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    // 这里可以添加提交评估结果的逻辑
    router.push(`/assessment/${assessmentId}/result`)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>评估完成！</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              感谢您完成{assessment.title}。我们正在为您生成个性化的评估报告。
            </p>
            <div className="space-y-2">
              <Button onClick={handleComplete} className="w-full">
                查看评估结果
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/assessment">返回评估馆</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">{assessment.title}</h1>
                <p className="text-sm text-gray-600">{assessment.description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              问题 {currentQuestion + 1} / {assessment.questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% 完成</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-4"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
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
            >
              {currentQuestion === assessment.questions.length - 1 ? '完成评估' : '下一题'}
              {currentQuestion < assessment.questions.length - 1 && (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
