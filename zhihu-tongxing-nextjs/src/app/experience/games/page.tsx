'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Trophy, Clock, Users, Star } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface GameScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  participants: number
  rating: number
  image: string
  tags: string[]
  status: 'available' | 'locked' | 'completed'
}

export default function ExperienceGamesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const gameScenarios: GameScenario[] = [
    {
      id: 'daily-care',
      title: '小小照护大任务',
      description: '模拟喂养、哄睡、更换尿布等日常照护挑战，在实践中学习高效的解决方法。',
      difficulty: 'beginner',
      duration: '15-20分钟',
      participants: 1,
      rating: 4.8,
      image: 'https://picsum.photos/seed/task/400/300',
      tags: ['日常照护', '基础技能'],
      status: 'available'
    },
    {
      id: 'emotion-adventure',
      title: '情绪大冒险',
      description: '面对孩子的各种"情绪风暴"，学习如何共情倾听、有效沟通，引导孩子管理情绪。',
      difficulty: 'intermediate',
      duration: '20-25分钟',
      participants: 1,
      rating: 4.9,
      image: 'https://picsum.photos/seed/emotion/400/300',
      tags: ['情绪管理', '沟通技巧'],
      status: 'available'
    },
    {
      id: 'safety-hero',
      title: '保护小英雄',
      description: '学习识别和预防各种安全隐患，掌握紧急情况下的正确应对方法。',
      difficulty: 'intermediate',
      duration: '25-30分钟',
      participants: 1,
      rating: 4.7,
      image: 'https://picsum.photos/seed/safety/400/300',
      tags: ['安全防护', '应急处理'],
      status: 'available'
    },
    {
      id: 'role-model',
      title: '榜样的力量',
      description: '通过正面引导和榜样示范，培养孩子的良好品格和行为习惯。',
      difficulty: 'advanced',
      duration: '30-35分钟',
      participants: 1,
      rating: 4.6,
      image: 'https://picsum.photos/seed/example/400/300',
      tags: ['品格培养', '行为引导'],
      status: 'available'
    },
    {
      id: 'family-cooperation',
      title: '家庭协作挑战',
      description: '模拟家庭成员间的协作场景，学习如何建立和谐的家庭关系。',
      difficulty: 'advanced',
      duration: '35-40分钟',
      participants: 2,
      rating: 4.5,
      image: 'https://picsum.photos/seed/family/400/300',
      tags: ['家庭关系', '团队协作'],
      status: 'locked'
    },
    {
      id: 'crisis-management',
      title: '危机处理专家',
      description: '面对突发状况和危机事件，学习冷静分析和有效应对的策略。',
      difficulty: 'advanced',
      duration: '40-45分钟',
      participants: 1,
      rating: 4.8,
      image: 'https://picsum.photos/seed/crisis/400/300',
      tags: ['危机处理', '决策能力'],
      status: 'locked'
    }
  ]

  const filteredGames = selectedDifficulty === 'all' 
    ? gameScenarios 
    : gameScenarios.filter(game => game.difficulty === selectedDifficulty)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100'
      case 'advanced':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级'
      case 'intermediate':
        return '中级'
      case 'advanced':
        return '高级'
      default:
        return '未知'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600'
      case 'locked':
        return 'text-gray-400'
      case 'completed':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/experience">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回体验馆
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">体验游戏</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择难度级别</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSelectedDifficulty('beginner')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === 'beginner'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              初级
            </button>
            <button
              onClick={() => setSelectedDifficulty('intermediate')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === 'intermediate'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              中级
            </button>
            <button
              onClick={() => setSelectedDifficulty('advanced')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDifficulty === 'advanced'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              高级
            </button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {getDifficultyText(game.difficulty)}
                  </span>
                </div>
                {game.status === 'locked' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm">需要解锁</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {game.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {game.participants}人
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {game.rating}
                  </div>
                </div>
                
                <Link href={`/experience/games/${game.id}`}>
                  <Button 
                    className="w-full" 
                    disabled={game.status === 'locked'}
                    variant={game.status === 'locked' ? 'outline' : 'default'}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {game.status === 'locked' ? '需要解锁' : '开始体验'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
