'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Play, Pause, Volume2, VolumeX, BookOpen, CheckCircle, Clock, Star, User } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TutorialData {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  rating: number
  views: number
  type: 'video' | 'interactive' | 'document'
  thumbnail: string
  tags: string[]
  content: {
    sections: {
      id: string
      title: string
      duration?: string
      content: string
      completed?: boolean
    }[]
  }
}

export default function TutorialDetailPage() {
  const params = useParams()
  const tutorialId = params.id as string
  
  const [tutorialData, setTutorialData] = useState<TutorialData | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())

  useEffect(() => {
    // 模拟获取教程数据
    const mockTutorialData: Record<string, TutorialData> = {
      'basic-care-guide': {
        id: 'basic-care-guide',
        title: '新手父母必看：基础照护指南',
        description: '从零开始学习婴幼儿基础照护技能，包括喂养、换尿布、洗澡等日常护理要点。',
        instructor: '李医生',
        duration: '25分钟',
        rating: 4.9,
        views: 15420,
        type: 'video',
        thumbnail: 'https://picsum.photos/seed/tutorial1/800/450',
        tags: ['基础照护', '新手指南', '日常护理'],
        content: {
          sections: [
            {
              id: 'introduction',
              title: '课程介绍',
              duration: '3分钟',
              content: '欢迎来到新手父母基础照护指南。在这个课程中，我们将学习婴幼儿日常照护的基本技能，包括正确的喂养方法、安全的换尿布技巧、以及如何给宝宝洗澡。这些技能对于新手父母来说至关重要，掌握了这些基础知识，您就能更好地照顾您的宝宝。'
            },
            {
              id: 'feeding-basics',
              title: '喂养基础知识',
              duration: '8分钟',
              content: '正确的喂养是宝宝健康成长的基础。无论是母乳喂养还是奶粉喂养，都有一些重要的原则需要遵循。首先，要确保喂养环境的安静和舒适。其次，要观察宝宝的饥饿信号，如吸吮手指、转头寻找等。喂养时要保持正确的姿势，让宝宝的头部略高于身体，避免呛奶。喂养后要记得给宝宝拍嗝，帮助排出胃中的空气。'
            },
            {
              id: 'diaper-changing',
              title: '换尿布技巧',
              duration: '6分钟',
              content: '换尿布是日常照护中最频繁的任务之一。准备工作很重要：准备好干净的尿布、湿巾、护臀霜等用品。换尿布时要动作轻柔，先解开脏尿布，用湿巾从前往后清洁，特别注意皮肤褶皱处。清洁后让皮肤自然晾干，涂抹适量护臀霜，然后穿上新尿布。整个过程要保持与宝宝的互动，可以说话或唱歌来安抚宝宝。'
            },
            {
              id: 'bathing-safety',
              title: '安全洗澡指南',
              duration: '8分钟',
              content: '给宝宝洗澡需要特别注意安全。水温应该控制在37-38度，可以用肘部测试水温。洗澡前准备好所有用品：温和的婴儿沐浴露、柔软的毛巾、干净的衣服等。洗澡时一只手托住宝宝的头颈部，另一只手清洗身体。从头部开始，然后是身体，最后是尿布区域。洗澡时间不宜过长，一般5-10分钟即可。洗完后立即用毛巾包裹宝宝，避免着凉。'
            }
          ]
        }
      },
      'emotion-management': {
        id: 'emotion-management',
        title: '儿童情绪管理实战技巧',
        description: '学习如何识别和应对孩子的各种情绪，掌握有效的沟通和引导方法。',
        instructor: '王心理师',
        duration: '30分钟',
        rating: 4.8,
        views: 12350,
        type: 'interactive',
        thumbnail: 'https://picsum.photos/seed/tutorial2/800/450',
        tags: ['情绪管理', '沟通技巧', '心理健康'],
        content: {
          sections: [
            {
              id: 'emotion-recognition',
              title: '情绪识别基础',
              duration: '7分钟',
              content: '了解儿童的基本情绪表达方式，学会识别孩子的情绪状态。儿童的情绪表达往往比成人更直接，通过观察面部表情、身体语言和行为模式，我们可以准确判断孩子的情绪状态。'
            },
            {
              id: 'communication-skills',
              title: '有效沟通技巧',
              duration: '10分钟',
              content: '掌握与孩子沟通的有效方法，包括倾听技巧、共情表达和引导性提问。良好的沟通是情绪管理的基础，通过正确的沟通方式，我们可以帮助孩子更好地表达和理解自己的情绪。'
            },
            {
              id: 'emotion-regulation',
              title: '情绪调节策略',
              duration: '8分钟',
              content: '学习帮助孩子调节情绪的具体方法，包括深呼吸、放松技巧和转移注意力等策略。这些技巧可以帮助孩子在情绪激动时快速平静下来。'
            },
            {
              id: 'practical-cases',
              title: '实际案例分析',
              duration: '5分钟',
              content: '通过具体案例分析，学习如何在实际情况中应用情绪管理技巧。我们将分析几个常见的情绪管理场景，并提供具体的应对策略。'
            }
          ]
        }
      }
    }

    const data = mockTutorialData[tutorialId]
    if (data) {
      setTutorialData(data)
    }
  }, [tutorialId])

  const markSectionCompleted = (sectionIndex: number) => {
    setCompletedSections(prev => new Set([...prev, sectionIndex]))
    
    // 更新总进度
    const totalSections = tutorialData?.content.sections.length || 1
    const newProgress = ((completedSections.size + 1) / totalSections) * 100
    setProgress(newProgress)
  }

  const goToNextSection = () => {
    if (tutorialData && currentSection < tutorialData.content.sections.length - 1) {
      markSectionCompleted(currentSection)
      setCurrentSection(prev => prev + 1)
    }
  }

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }

  if (!tutorialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">教程不存在或加载中...</p>
          <Link href="/experience/tutorials">
            <Button className="mt-4">返回教程列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentSectionData = tutorialData.content.sections[currentSection]
  const isLastSection = currentSection === tutorialData.content.sections.length - 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/experience/tutorials">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回教程列表
              </Button>
            </Link>
            <div className="text-sm text-gray-600">
              进度: {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{tutorialData.title}</h1>
                
                {/* 教程信息 */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {tutorialData.instructor}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {tutorialData.duration}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {tutorialData.rating}
                  </div>
                  <div>{tutorialData.views.toLocaleString()}次观看</div>
                </div>

                {/* 进度条 */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>学习进度</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 视频/内容区域 */}
                <div className="bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
                  <img
                    src={tutorialData.thumbnail}
                    alt={tutorialData.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  
                  {tutorialData.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        size="lg"
                        className="bg-black bg-opacity-50 hover:bg-opacity-70"
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                      </Button>
                    </div>
                  )}
                  
                  {tutorialData.type === 'video' && (
                    <div className="absolute bottom-4 right-4">
                      <Button
                        onClick={() => setIsMuted(!isMuted)}
                        size="sm"
                        variant="outline"
                        className="bg-black bg-opacity-50 border-white text-white hover:bg-opacity-70"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>

                {/* 当前章节内容 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentSectionData.title}
                    {currentSectionData.duration && (
                      <span className="text-sm text-gray-500 ml-2">({currentSectionData.duration})</span>
                    )}
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {currentSectionData.content}
                  </div>
                </div>

                {/* 导航按钮 */}
                <div className="flex justify-between">
                  <Button
                    onClick={goToPreviousSection}
                    disabled={currentSection === 0}
                    variant="outline"
                  >
                    上一节
                  </Button>
                  
                  <div className="flex space-x-2">
                    {!completedSections.has(currentSection) && (
                      <Button
                        onClick={() => markSectionCompleted(currentSection)}
                        variant="outline"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        标记完成
                      </Button>
                    )}
                    
                    <Button
                      onClick={goToNextSection}
                      disabled={isLastSection}
                    >
                      {isLastSection ? '课程完成' : '下一节'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 侧边栏 - 章节列表 */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">课程章节</h3>
                <div className="space-y-2">
                  {tutorialData.content.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        currentSection === index
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.title}</span>
                        {completedSections.has(index) && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {section.duration && (
                        <div className="text-xs text-gray-500 mt-1">{section.duration}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
