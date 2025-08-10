'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { 
  Heart, 
  Brain, 
  Shield, 
  BookOpen, 
  Search, 
  Clock,
  User,
  Eye,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { articlesData } from '@/data/articles'
import { extendedArticlesData } from '@/data/articles-extended'

// 合并静态文章数据作为备用
const staticArticles = {
  ...articlesData,
  ...extendedArticlesData
}

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [displayedArticles, setDisplayedArticles] = useState(6)
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)
  const [allArticles, setAllArticles] = useState(staticArticles)
  const [isLoading, setIsLoading] = useState(true)

  // 从公开API获取已发布的文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles?limit=100', {
          signal: AbortSignal.timeout(10000) // 10秒超时
        })
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // 转换API数据格式以匹配现有组件结构
            const apiArticles = result.data.reduce((acc: any, article: any) => {
              acc[article.id] = {
                id: article.id,
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                category: article.category,
                image: article.image,
                author: article.author,
                publishedAt: article.publishedAt,
                readTime: article.readTime,
                views: article.views,
                rating: article.rating
              }
              return acc
            }, {})
            
            // 合并静态文章和API文章
            setAllArticles({
              ...staticArticles,
              ...apiArticles
            })
          }
        }
      } catch (error) {
        console.error('获取文章失败:', error)
        // 如果API失败，使用静态数据
        setAllArticles(staticArticles)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const categories = [
    {
      id: 'all',
      title: '全部文章',
      description: '浏览所有分类的文章',
      icon: BookOpen,
      color: 'bg-blue-500',
      count: allArticles ? Object.keys(allArticles).length : 0
    },
    {
      id: 'life',
      title: '生活照护',
      description: '日常生活中的照护知识和技巧',
      icon: Heart,
      color: 'bg-pink-500',
      count: allArticles ? Object.values(allArticles).filter(article => article && article.category === 'life').length : 0
    },
    {
      id: 'psychology',
      title: '心理健康',
      description: '儿童心理发展和情绪管理',
      icon: Brain,
      color: 'bg-purple-500',
      count: allArticles ? Object.values(allArticles).filter(article => article && article.category === 'psychology').length : 0
    },
    {
      id: 'safety',
      title: '安全防护',
      description: '家庭和外出安全防护措施',
      icon: Shield,
      color: 'bg-red-500',
      count: allArticles ? Object.values(allArticles).filter(article => article && article.category === 'safety').length : 0
    },
    {
      id: 'education',
      title: '教育指导',
      description: '早期教育和学习指导方法',
      icon: BookOpen,
      color: 'bg-green-500',
      count: allArticles ? Object.values(allArticles).filter(article => article && article.category === 'education').length : 0
    }
  ]

  // 根据当前选中的分类筛选文章
  const getFilteredArticles = () => {
    if (!allArticles || typeof allArticles !== 'object') {
      return []
    }
    const articlesArray = Object.values(allArticles).filter(article => article && article.id)
    
    // 按发布时间从新到旧排序
    articlesArray.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime()
      const dateB = new Date(b.publishedAt || b.createdAt).getTime()
      return dateB - dateA // 从新到旧
    })
    
    if (activeTab === 'all') {
      return articlesArray
    }
    return articlesArray.filter(article => article.category === activeTab)
  }

  const filteredArticles = getFilteredArticles()

  // 处理分类切换
  const handleCategoryChange = async (categoryId: string) => {
    if (categoryId === activeTab) return

    setIsCategoryLoading(true)
    // 模拟分类切换加载延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setActiveTab(categoryId)
    setDisplayedArticles(6) // 重置显示的文章数量
    setIsCategoryLoading(false)
  }

  // 处理加载更多文章
  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setDisplayedArticles(prev => prev + 6)
    setIsLoadingMore(false)
  }

  // 获取当前分类信息
  const currentCategory = categories.find(cat => cat.id === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            智护童行知识科普馆
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            专业的儿童护理知识，科学的育儿指导，为您的孩子健康成长保驾护航
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="搜索知识文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = activeTab === category.id
            
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${isCategoryLoading && isActive ? 'opacity-50' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                  <div className="text-xs text-gray-500">篇文章</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Current Category Title */}
        {currentCategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentCategory.title} 
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredArticles.length} 篇文章)
              </span>
            </h2>
            <p className="text-gray-600">{currentCategory.description}</p>
          </div>
        )}

        {/* Loading State for Category Change */}
        {isCategoryLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">正在加载文章...</span>
          </div>
        )}

        {/* Articles Grid */}
        {!isCategoryLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredArticles.slice(0, displayedArticles).map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views} 阅读
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {article.rating} 评分
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(article.tags) ? article.tags : []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link href={`/knowledge/article/${article.id}`}>
                    <Button className="w-full">
                      阅读全文
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isCategoryLoading && filteredArticles.length > displayedArticles && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {isLoadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  加载中...
                </>
              ) : (
                '加载更多文章'
              )}
            </Button>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">快速导航</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/knowledge/favorites" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-blue-600 mb-2">📚</div>
              <div className="text-sm font-medium text-gray-900">我的收藏</div>
            </Link>
            <Link href="/knowledge/history" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-green-600 mb-2">📖</div>
              <div className="text-sm font-medium text-gray-900">阅读历史</div>
            </Link>
            <Link href="/knowledge/experts" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-purple-600 mb-2">👨‍⚕️</div>
              <div className="text-sm font-medium text-gray-900">专家团队</div>
            </Link>
            <Link href="/knowledge/submit" className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-orange-600 mb-2">✍️</div>
              <div className="text-sm font-medium text-gray-900">投稿建议</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
