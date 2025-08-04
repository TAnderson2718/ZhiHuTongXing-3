'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Clock, Star } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface GameData {
  id: string
  title: string
  description: string
  instructions: string[]
  scenarios: {
    id: string
    title: string
    description: string
    choices: {
      id: string
      text: string
      feedback: string
      score: number
    }[]
  }[]
}

export default function GameExperiencePage() {
  const params = useParams()
  const gameId = params.id as string
  
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)

  useEffect(() => {
    // 模拟获取游戏数据
    const mockGameData: Record<string, GameData> = {
      'daily-care': {
        id: 'daily-care',
        title: '小小照护大任务',
        description: '模拟喂养、哄睡、更换尿布等日常照护挑战，在实践中学习高效的解决方法。',
        instructions: [
          '仔细阅读每个情境描述',
          '根据实际情况选择最合适的应对方式',
          '查看反馈，了解选择的后果',
          '学习正确的照护方法和技巧'
        ],
        scenarios: [
          {
            id: 'feeding-time',
            title: '喂养时间',
            description: '宝宝到了喂奶时间，但是他似乎不太愿意吃奶，一直哭闹。你应该怎么办？',
            choices: [
              {
                id: 'force-feed',
                text: '强制喂奶，确保宝宝摄入足够营养',
                feedback: '强制喂奶可能会让宝宝更加抗拒，建议先安抚宝宝的情绪。',
                score: 2
              },
              {
                id: 'comfort-first',
                text: '先安抚宝宝，检查是否有其他不适',
                feedback: '很好！先安抚宝宝是正确的做法，可能宝宝不舒服或者不饿。',
                score: 8
              },
              {
                id: 'wait-later',
                text: '等一会儿再喂，可能宝宝还不饿',
                feedback: '这是一个不错的选择，但最好先检查宝宝是否有其他需求。',
                score: 6
              }
            ]
          },
          {
            id: 'sleep-training',
            title: '哄睡挑战',
            description: '晚上9点了，宝宝还很兴奋不愿意睡觉，一直在床上翻来覆去。你会怎么做？',
            choices: [
              {
                id: 'play-more',
                text: '陪宝宝再玩一会儿，等他累了自然会睡',
                feedback: '这可能会让宝宝更加兴奋，建议建立固定的睡前routine。',
                score: 3
              },
              {
                id: 'bedtime-routine',
                text: '执行睡前routine：洗澡、讲故事、调暗灯光',
                feedback: '非常棒！固定的睡前routine有助于宝宝建立睡眠习惯。',
                score: 9
              },
              {
                id: 'ignore-crying',
                text: '让宝宝自己哭一会儿，他会累了自己睡着',
                feedback: '适度的自主入睡训练可以，但要确保宝宝的基本需求已满足。',
                score: 5
              }
            ]
          },
          {
            id: 'diaper-change',
            title: '换尿布时刻',
            description: '宝宝的尿布湿了需要更换，但他一看到你拿尿布就开始哭闹和挣扎。',
            choices: [
              {
                id: 'quick-change',
                text: '快速更换，不管宝宝的反应',
                feedback: '虽然效率高，但可能会增加宝宝的恐惧感。',
                score: 4
              },
              {
                id: 'distract-play',
                text: '用玩具或歌曲分散宝宝注意力，温柔地更换',
                feedback: '很好！分散注意力是很有效的方法，让换尿布变得愉快。',
                score: 8
              },
              {
                id: 'wait-calm',
                text: '等宝宝情绪平静后再更换',
                feedback: '理解宝宝情绪很重要，但湿尿布需要及时更换以防红屁股。',
                score: 6
              }
            ]
          }
        ]
      },
      'emotion-adventure': {
        id: 'emotion-adventure',
        title: '情绪大冒险',
        description: '面对孩子的各种"情绪风暴"，学习如何共情倾听、有效沟通，引导孩子管理情绪。',
        instructions: [
          '观察孩子的情绪表现和行为信号',
          '选择合适的沟通方式和应对策略',
          '学习情绪调节的技巧和方法',
          '培养孩子的情绪管理能力'
        ],
        scenarios: [
          {
            id: 'tantrum-situation',
            title: '发脾气时刻',
            description: '3岁的小明因为不能继续看电视而大发脾气，在地上打滚哭闹。你会怎么处理？',
            choices: [
              {
                id: 'ignore-tantrum',
                text: '不理会他，让他自己哭够了就好',
                feedback: '完全忽视可能让孩子感到被抛弃，建议在保证安全的前提下给予适当关注。',
                score: 3
              },
              {
                id: 'empathy-comfort',
                text: '蹲下来，平静地说："我知道你很生气，不能看电视了"',
                feedback: '很好！共情和理解是处理情绪的第一步，让孩子感受到被理解。',
                score: 9
              },
              {
                id: 'distraction',
                text: '立即转移注意力："我们去玩积木吧！"',
                feedback: '转移注意力有时有效，但最好先承认孩子的情绪再引导。',
                score: 6
              }
            ]
          },
          {
            id: 'fear-response',
            title: '恐惧应对',
            description: '孩子晚上害怕黑暗，不敢一个人睡觉，一直哭着要妈妈陪。你应该怎么做？',
            choices: [
              {
                id: 'force-independence',
                text: '告诉他"没什么好怕的"，坚持让他独自睡觉',
                feedback: '否定孩子的恐惧感受可能会增加焦虑，建议先理解和安抚。',
                score: 2
              },
              {
                id: 'gradual-support',
                text: '理解他的恐惧，提供小夜灯，逐步建立安全感',
                feedback: '非常好！理解恐惧并提供支持，逐步帮助孩子建立安全感。',
                score: 9
              },
              {
                id: 'always-accompany',
                text: '每晚都陪着睡，直到他不害怕为止',
                feedback: '过度保护可能让孩子更依赖，建议逐步培养独立性。',
                score: 4
              }
            ]
          },
          {
            id: 'frustration-learning',
            title: '挫折学习',
            description: '孩子在拼图时遇到困难，变得很沮丧，把拼图扔到地上说"我不会！"',
            choices: [
              {
                id: 'do-it-for-them',
                text: '帮他完成拼图，避免他继续沮丧',
                feedback: '直接帮助虽然能解决当下问题，但错过了培养挫折容忍力的机会。',
                score: 4
              },
              {
                id: 'encourage-persist',
                text: '说："我看到你很沮丧，我们一起试试看，一步一步来"',
                feedback: '很棒！承认情绪，提供支持，鼓励坚持，培养解决问题的能力。',
                score: 9
              },
              {
                id: 'change-activity',
                text: '收起拼图，换一个更简单的活动',
                feedback: '适当调整难度是好的，但最好先尝试引导孩子面对挫折。',
                score: 6
              }
            ]
          }
        ]
      },
      'safety-hero': {
        id: 'safety-hero',
        title: '保护小英雄',
        description: '学习识别和预防各种安全隐患，掌握紧急情况下的正确应对方法。',
        instructions: [
          '仔细观察环境中的安全隐患',
          '学习预防措施和安全知识',
          '掌握紧急情况的应对方法',
          '培养孩子的安全意识'
        ],
        scenarios: [
          {
            id: 'kitchen-safety',
            title: '厨房安全',
            description: '你在厨房做饭，2岁的孩子跑进来想要帮忙，但厨房里有热水、刀具等危险物品。',
            choices: [
              {
                id: 'let-help-freely',
                text: '让孩子自由活动，培养他的独立性',
                feedback: '厨房有很多危险，需要确保孩子的安全后再让他参与。',
                score: 2
              },
              {
                id: 'safe-participation',
                text: '给孩子安排安全的任务，如洗菜，并移除危险物品',
                feedback: '很好！既满足了孩子的参与愿望，又确保了安全。',
                score: 9
              },
              {
                id: 'completely-exclude',
                text: '立即把孩子赶出厨房，不允许他进入',
                feedback: '过度保护可能让孩子失去学习机会，可以创造安全的参与方式。',
                score: 4
              }
            ]
          },
          {
            id: 'playground-accident',
            title: '游乐场意外',
            description: '在游乐场，你看到孩子从滑梯上摔下来，膝盖擦伤流血了。',
            choices: [
              {
                id: 'panic-reaction',
                text: '立即大声呼救，表现得很紧张',
                feedback: '过度紧张可能会吓到孩子，保持冷静更有助于处理情况。',
                score: 3
              },
              {
                id: 'calm-assessment',
                text: '保持冷静，先检查伤势，清洁伤口并安慰孩子',
                feedback: '非常好！冷静处理，正确的急救步骤，同时给孩子安全感。',
                score: 9
              },
              {
                id: 'ignore-minor-injury',
                text: '告诉孩子"没事的"，继续玩耍',
                feedback: '即使是小伤也需要适当处理，避免感染和教育安全意识。',
                score: 2
              }
            ]
          },
          {
            id: 'stranger-approach',
            title: '陌生人接触',
            description: '在公园里，一个陌生人主动和你的孩子说话，还拿出糖果要给孩子。',
            choices: [
              {
                id: 'allow-interaction',
                text: '让孩子自己决定是否接受，培养社交能力',
                feedback: '与陌生人的接触需要家长监督，安全第一。',
                score: 2
              },
              {
                id: 'polite-intervention',
                text: '礼貌地介入，感谢陌生人的好意但婉拒糖果',
                feedback: '很好！既保护了孩子的安全，又教会了礼貌应对的方式。',
                score: 9
              },
              {
                id: 'aggressive-response',
                text: '立即带孩子离开，严厉警告陌生人',
                feedback: '保护意识很好，但过度反应可能让孩子产生不必要的恐惧。',
                score: 5
              }
            ]
          }
        ]
      },
      'role-model': {
        id: 'role-model',
        title: '榜样的力量',
        description: '通过正面引导和榜样示范，培养孩子的良好品格和行为习惯。',
        instructions: [
          '观察自己的行为对孩子的影响',
          '选择正面的引导方式',
          '通过榜样示范教育孩子',
          '培养孩子的良好品格'
        ],
        scenarios: [
          {
            id: 'honesty-lesson',
            title: '诚实教育',
            description: '孩子不小心打破了花瓶，但撒谎说是猫咪弄坏的。你知道真相，会怎么处理？',
            choices: [
              {
                id: 'expose-lie',
                text: '直接揭穿谎言，严厉批评孩子撒谎',
                feedback: '直接批评可能让孩子更害怕说实话，建议用更温和的方式引导。',
                score: 4
              },
              {
                id: 'gentle-guidance',
                text: '温和地说："告诉妈妈真正发生了什么，我不会生气的"',
                feedback: '很好！创造安全的环境让孩子说实话，培养诚实的品格。',
                score: 9
              },
              {
                id: 'ignore-lie',
                text: '假装相信，避免冲突',
                feedback: '忽视撒谎行为可能让孩子认为撒谎是可以接受的。',
                score: 2
              }
            ]
          },
          {
            id: 'sharing-behavior',
            title: '分享行为',
            description: '孩子不愿意和朋友分享自己的玩具，朋友很失望。你会如何引导？',
            choices: [
              {
                id: 'force-sharing',
                text: '强制要求孩子分享，告诉他"好孩子要学会分享"',
                feedback: '强制分享可能让孩子产生逆反心理，建议用更好的方式引导。',
                score: 3
              },
              {
                id: 'model-sharing',
                text: '自己先示范分享行为，然后引导孩子体验分享的快乐',
                feedback: '非常棒！通过榜样示范和正面体验来教育，效果更好。',
                score: 9
              },
              {
                id: 'respect-ownership',
                text: '尊重孩子的选择，告诉朋友"这是他的玩具，他可以决定"',
                feedback: '尊重所有权是对的，但也要适当引导分享的价值。',
                score: 6
              }
            ]
          },
          {
            id: 'responsibility-training',
            title: '责任培养',
            description: '孩子答应帮忙收拾玩具，但玩了一会儿就忘记了，玩具还散落一地。',
            choices: [
              {
                id: 'do-it-yourself',
                text: '自己收拾玩具，避免和孩子产生冲突',
                feedback: '代替孩子完成任务会让他失去学习责任感的机会。',
                score: 2
              },
              {
                id: 'gentle-reminder',
                text: '温和地提醒："我们之前说好要收拾玩具的，一起来完成吧"',
                feedback: '很好！温和提醒承诺，并提供支持，培养责任感。',
                score: 9
              },
              {
                id: 'punishment-approach',
                text: '取消孩子的游戏时间作为惩罚',
                feedback: '惩罚可能有效，但正面引导和提醒更有助于培养内在动机。',
                score: 5
              }
            ]
          }
        ]
      }
    }

    const data = mockGameData[gameId]
    if (data) {
      setGameData(data)
    }
  }, [gameId])

  const startGame = () => {
    setGameStarted(true)
    setStartTime(new Date())
    setCurrentScenario(0)
    setTotalScore(0)
    setGameCompleted(false)
  }

  const selectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setShowFeedback(true)
    
    if (gameData) {
      const choice = gameData.scenarios[currentScenario].choices.find(c => c.id === choiceId)
      if (choice) {
        setTotalScore(prev => prev + choice.score)
      }
    }
  }

  const nextScenario = () => {
    if (gameData && currentScenario < gameData.scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
    } else {
      // 游戏完成
      setGameCompleted(true)
      setEndTime(new Date())
    }
  }

  const restartGame = () => {
    setCurrentScenario(0)
    setSelectedChoice(null)
    setShowFeedback(false)
    setTotalScore(0)
    setGameStarted(false)
    setGameCompleted(false)
    setStartTime(null)
    setEndTime(null)
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">游戏不存在或加载中...</p>
        </div>
      </div>
    )
  }

  const currentScenarioData = gameData.scenarios[currentScenario]
  const selectedChoiceData = selectedChoice 
    ? currentScenarioData.choices.find(c => c.id === selectedChoice)
    : null

  const maxScore = gameData.scenarios.reduce((total, scenario) => {
    return total + Math.max(...scenario.choices.map(choice => choice.score))
  }, 0)

  const getScoreLevel = (score: number, max: number) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return { level: '优秀', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (percentage >= 60) return { level: '良好', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (percentage >= 40) return { level: '及格', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { level: '需要提升', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getDuration = () => {
    if (startTime && endTime) {
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
      return `${duration} 分钟`
    }
    return '未知'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/experience" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回体验馆
          </Link>
          
          {gameStarted && !gameCompleted && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                进度: {currentScenario + 1}/{gameData.scenarios.length}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                得分: {totalScore}
              </div>
            </div>
          )}
        </div>

        {!gameStarted ? (
          // 游戏介绍页面
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{gameData.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{gameData.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">游戏说明</h3>
                  <ul className="text-left space-y-2 text-blue-800">
                    {gameData.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  开始游戏
                </Button>
              </div>
            </Card>
          </div>
        ) : gameCompleted ? (
          // 游戏完成页面
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-8">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">恭喜完成游戏！</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{totalScore}/{maxScore}</div>
                    <div className="text-sm text-gray-600">总得分</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className={`text-2xl font-bold mb-2 ${getScoreLevel(totalScore, maxScore).color}`}>
                      {getScoreLevel(totalScore, maxScore).level}
                    </div>
                    <div className="text-sm text-gray-600">评价等级</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{getDuration()}</div>
                    <div className="text-sm text-gray-600">用时</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button onClick={restartGame} className="bg-blue-600 hover:bg-blue-700 mr-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新开始
                  </Button>
                  
                  <Link href="/experience/games">
                    <Button variant="outline">
                      选择其他游戏
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // 游戏进行中
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentScenarioData.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{currentScenarioData.description}</p>
              </div>

              {!showFeedback ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">请选择你的应对方式：</h3>
                  {currentScenarioData.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => selectChoice(choice.id)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{choice.text}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">你的选择：</h3>
                    <p className="text-blue-800 mb-4">{selectedChoiceData?.text}</p>
                    
                    <h4 className="font-semibold text-blue-900 mb-2">反馈：</h4>
                    <p className="text-blue-700">{selectedChoiceData?.feedback}</p>
                    
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-blue-600 mr-2">本题得分：</span>
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedChoiceData?.score} 分
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      当前进度：{currentScenario + 1} / {gameData.scenarios.length}
                    </div>
                    <Button onClick={nextScenario}>
                      {currentScenario < gameData.scenarios.length - 1 ? '下一题' : '完成游戏'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
