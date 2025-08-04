'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, BookOpen, Clock, Users, Star, Video } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Tutorial {
  id: string
  title: string
  description: string
  category: 'basic' | 'advanced' | 'special'
  duration: string
  views: number
  rating: number
  thumbnail: string
  instructor: string
  tags: string[]
  type: 'video' | 'interactive' | 'document'
}

export default function ExperienceTutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const tutorials: Tutorial[] = [
    {
      id: 'basic-care-guide',
      title: '新手父母必看：基础照护指南',
      description: '从零开始学习婴幼儿基础照护技能，包括喂养、换尿布、洗澡等日常护理要点。',
      category: 'basic',
      duration: '25分钟',
      views: 15420,
      rating: 4.9,
      thumbnail: 'https://picsum.photos/seed/tutorial1/400/300',
      instructor: '李医生',
      tags: ['基础照护', '新手指南', '日常护理'],
      type: 'video'
    },
    {
      id: 'emotion-management',
      title: '儿童情绪管理实战技巧',
      description: '学习如何识别和应对孩子的各种情绪，掌握有效的沟通和引导方法。',
      category: 'advanced',
      duration: '30分钟',
      views: 12350,
      rating: 4.8,
      thumbnail: 'https://picsum.photos/seed/tutorial2/400/300',
      instructor: '王心理师',
      tags: ['情绪管理', '沟通技巧', '心理健康'],
      type: 'interactive'
    },
    {
      id: 'safety-prevention',
      title: '家庭安全防护完全手册',
      description: '全面了解家庭安全隐患，学习预防措施和紧急情况处理方法。',
      category: 'basic',
      duration: '20分钟',
      views: 9876,
      rating: 4.7,
      thumbnail: 'https://picsum.photos/seed/tutorial3/400/300',
      instructor: '张安全专家',
      tags: ['安全防护', '预防措施', '应急处理'],
      type: 'document'
    },
    {
      id: 'nutrition-guide',
      title: '婴幼儿营养搭配与喂养',
      description: '科学的营养搭配方案，不同年龄段的喂养要点和注意事项。',
      category: 'basic',
      duration: '35分钟',
      views: 11200,
      rating: 4.6,
      thumbnail: 'https://picsum.photos/seed/tutorial4/400/300',
      instructor: '陈营养师',
      tags: ['营养搭配', '科学喂养', '健康成长'],
      type: 'video'
    },
    {
      id: 'sleep-training',
      title: '宝宝睡眠训练全攻略',
      description: '建立健康的睡眠习惯，解决常见的睡眠问题，让全家都能安心休息。',
      category: 'advanced',
      duration: '28分钟',
      views: 8945,
      rating: 4.8,
      thumbnail: 'https://picsum.photos/seed/tutorial5/400/300',
      instructor: '刘睡眠专家',
      tags: ['睡眠训练', '作息规律', '睡眠问题'],
      type: 'interactive'
    },
    {
      id: 'special-needs',
      title: '特殊需求儿童照护指导',
      description: '针对有特殊需求的儿童，提供专业的照护建议和支持方法。',
      category: 'special',
      duration: '45分钟',
      views: 5432,
      rating: 4.9,
      thumbnail: 'https://picsum.photos/seed/tutorial6/400/300',
      instructor: '赵特教专家',
      tags: ['特殊需求', '专业照护', '个性化支持'],
      type: 'video'
    }
  ]

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'text-green-600 bg-green-100'
      case 'advanced':
        return 'text-blue-600 bg-blue-100'
      case 'special':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'basic':
        return '基础教程'
      case 'advanced':
        return '进阶教程'
      case 'special':
        return '专题教程'
      default:
        return '未知'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'interactive':
        return <Play className="w-4 h-4" />
      case 'document':
        return <BookOpen className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'video':
        return '视频教程'
      case 'interactive':
        return '互动教程'
      case 'document':
        return '文档教程'
      default:
        return '教程'
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
              <h1 className="text-2xl font-bold text-gray-900">学习教程</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择教程类别</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              全部教程
            </button>
            <button
              onClick={() => setSelectedCategory('basic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'basic'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              基础教程
            </button>
            <button
              onClick={() => setSelectedCategory('advanced')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              进阶教程
            </button>
            <button
              onClick={() => setSelectedCategory('special')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'special'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              专题教程
            </button>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tutorial.category)}`}>
                    {getCategoryText(tutorial.category)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                    {getTypeIcon(tutorial.type)}
                    <span className="ml-1">{getTypeText(tutorial.type)}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {tutorial.duration}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{tutorial.description}</p>
                <p className="text-sm text-gray-500 mb-4">讲师：{tutorial.instructor}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {tutorial.views.toLocaleString()}次观看
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {tutorial.rating}
                  </div>
                </div>
                
                <Link href={`/experience/tutorials/${tutorial.id}`}>
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    开始学习
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
