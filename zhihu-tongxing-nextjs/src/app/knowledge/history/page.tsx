'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, History, Clock, User, Eye, Star, Trash2, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

// 模拟阅读历史数据
const mockHistory = [
  {
    id: '1',
    title: '家庭安全隐患排查清单',
    excerpt: '对于充满好奇心和活力的孩子们来说，家是他们探索世界的第一站，但也可能隐藏着意想不到的危险...',
    author: '智护童行专家团队',
    category: 'safety',
    readTime: '8分钟',
    views: 1234,
    rating: 4.8,
    image: 'https://picsum.photos/seed/safety/400/200',
    publishedAt: '2025-06-20',
    readAt: '2025-01-15 14:30',
    readProgress: 100
  },
  {
    id: '2',
    title: '读懂孩子的"情绪风暴"',
    excerpt: '当2岁的孩子因为一块饼干在地上打滚，当5岁的孩子因为输了游戏而大发脾气，这些"情绪风暴"常常让家长感到头疼...',
    author: '儿童心理专家 李老师',
    category: 'psychology',
    readTime: '12分钟',
    views: 2156,
    rating: 4.9,
    image: 'https://picsum.photos/seed/emotion/400/200',
    publishedAt: '2025-06-18',
    readAt: '2025-01-14 09:15',
    readProgress: 75
  },
  {
    id: '3',
    title: '婴幼儿辅食添加全攻略',
    excerpt: '辅食添加是宝宝从母乳或配方奶向成人饮食过渡的关键一步。科学地添加辅食，不仅能满足宝宝生长发育所需的营养...',
    author: '营养师 张女士',
    category: 'life',
    readTime: '15分钟',
    views: 3421,
    rating: 4.7,
    image: 'https://picsum.photos/seed/food/400/200',
    publishedAt: '2025-06-15',
    readAt: '2025-01-13 20:45',
    readProgress: 45
  },
  {
    id: '4',
    title: '儿童睡眠问题解决方案',
    excerpt: '良好的睡眠对儿童的身心发展至关重要。然而，许多家长都面临着孩子睡眠问题的困扰...',
    author: '睡眠专家 王医生',
    category: 'life',
    readTime: '10分钟',
    views: 1876,
    rating: 4.6,
    image: 'https://picsum.photos/seed/sleep/400/200',
    publishedAt: '2025-06-12',
    readAt: '2025-01-12 21:20',
    readProgress: 100
  }
]

const categoryNames = {
  life: '生活照护',
  psychology: '心理健康',
  safety: '安全防护',
  education: '教育指导'
}

export default function HistoryPage() {
  const [history, setHistory] = useState(mockHistory)
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  const handleRemoveFromHistory = (articleId: string) => {
    setHistory(history.filter(article => article.id !== articleId))
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const getFilteredHistory = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    switch (selectedPeriod) {
      case 'today':
        return history.filter(article => new Date(article.readAt) >= today)
      case 'yesterday':
        return history.filter(article => {
          const readDate = new Date(article.readAt)
          return readDate >= yesterday && readDate < today
        })
      case 'week':
        return history.filter(article => new Date(article.readAt) >= weekAgo)
      default:
        return history
    }
  }

  const filteredHistory = getFilteredHistory()

  const getReadProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getReadProgressText = (progress: number) => {
    if (progress === 100) return '已读完'
    if (progress >= 50) return '阅读中'
    return '未读完'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/knowledge" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回知识科普馆
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">阅读历史</h1>
              <p className="text-gray-600 mt-1">您的阅读记录和进度</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">{history.length} 篇文章</span>
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  清空历史
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Period Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPeriod === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('all')}
            >
              全部时间
            </Button>
            <Button
              variant={selectedPeriod === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('today')}
            >
              今天
            </Button>
            <Button
              variant={selectedPeriod === 'yesterday' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('yesterday')}
            >
              昨天
            </Button>
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
            >
              最近一周
            </Button>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                              {categoryNames[article.category as keyof typeof categoryNames]}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${getReadProgressColor(article.readProgress)}`}></div>
                              <span className="text-xs text-gray-500">
                                {getReadProgressText(article.readProgress)}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>阅读于 {article.readAt}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{article.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/knowledge/article/${article.id}`}>
                              继续阅读
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromHistory(article.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>阅读进度</span>
                          <span>{article.readProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${getReadProgressColor(article.readProgress)}`}
                            style={{ width: `${article.readProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无阅读历史</h3>
            <p className="text-gray-600 mb-6">
              {selectedPeriod === 'all' 
                ? '您还没有阅读任何文章，去发现一些有趣的内容吧！'
                : '在选定时间段内暂无阅读记录'
              }
            </p>
            <Button asChild>
              <Link href="/knowledge">
                去发现文章
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
