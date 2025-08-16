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
    title: '综合能力评估',
    description: '全面评估孩子的认知、语言、社交、运动等各方面发展水平。',
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
    title: 'SDQ行为评估',
    description: '儿童行为问题筛查量表，评估孩子的行为和情绪状态。',
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
    title: 'EMBU教养方式评估',
    description: '评估父母的教养方式对孩子发展的影响。',
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
  },
  behavior: {
    title: '儿童行为评估量表',
    description: '专业的儿童行为评估工具，帮助家长了解孩子的行为发展状况。',
    questions: [
      {
        id: 1,
        question: '您的孩子在与其他孩子玩耍时，通常表现如何？',
        options: [
          '主动参与，能够很好地与其他孩子合作',
          '有时参与，但偶尔会有冲突',
          '较少主动参与，更喜欢独自玩耍'
        ]
      },
      {
        id: 2,
        question: '当孩子遇到困难或挫折时，他/她的反应是？',
        options: [
          '会寻求帮助，并尝试解决问题',
          '有时会放弃，有时会坚持',
          '容易放弃或情绪激动'
        ]
      },
      {
        id: 3,
        question: '您的孩子在遵守规则方面表现如何？',
        options: [
          '能够很好地理解和遵守规则',
          '大部分时候能遵守，偶尔会违反',
          '经常需要提醒才能遵守规则'
        ]
      },
      {
        id: 4,
        question: '孩子在表达自己的需求和感受时？',
        options: [
          '能够清楚地表达自己的想法和感受',
          '有时能表达，但不够清楚',
          '很少主动表达，或表达不清楚'
        ]
      },
      {
        id: 5,
        question: '您的孩子在注意力集中方面？',
        options: [
          '能够长时间专注于感兴趣的活动',
          '注意力一般，容易被干扰',
          '很难集中注意力，经常分心'
        ]
      }
    ]
  },
  development: {
    title: '儿童发展里程碑评估',
    description: '评估儿童在各个发展阶段的里程碑达成情况。',
    questions: [
      {
        id: 1,
        question: '您的孩子在语言发展方面？',
        options: [
          '词汇量丰富，能够流利表达复杂想法',
          '词汇量适中，基本能表达日常需求',
          '词汇量较少，表达能力有待提高'
        ]
      },
      {
        id: 2,
        question: '在运动技能发展方面，您的孩子？',
        options: [
          '大运动和精细运动都发展良好',
          '某些运动技能较好，某些需要改善',
          '运动技能发展相对较慢'
        ]
      },
      {
        id: 3,
        question: '您的孩子在认知能力方面？',
        options: [
          '理解能力强，学习新事物很快',
          '理解能力一般，需要适当引导',
          '理解较慢，需要更多时间和帮助'
        ]
      },
      {
        id: 4,
        question: '在社交情感发展方面，您的孩子？',
        options: [
          '情绪稳定，社交技能良好',
          '大部分时候情绪稳定，社交能力一般',
          '情绪波动较大，社交技能需要提高'
        ]
      },
      {
        id: 5,
        question: '您的孩子在自理能力方面？',
        options: [
          '能够独立完成大部分日常自理活动',
          '在帮助下能完成基本自理活动',
          '需要较多帮助才能完成自理活动'
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
    // 仅在客户端执行重定向
    if (typeof window !== 'undefined' && !assessment) {
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
