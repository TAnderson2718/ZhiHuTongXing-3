'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Clock, User, Eye, Star, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

// 模拟收藏的文章数据
const mockFavorites = [
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
    favoriteAt: '2025-01-15'
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
    favoriteAt: '2025-01-12'
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
    favoriteAt: '2025-01-10'
  }
]

const categoryNames = {
  life: '生活照护',
  psychology: '心理健康',
  safety: '安全防护',
  education: '教育指导'
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleRemoveFavorite = (articleId: string) => {
    setFavorites(favorites.filter(article => article.id !== articleId))
  }

  const filteredFavorites = selectedCategory === 'all' 
    ? favorites 
    : favorites.filter(article => article.category === selectedCategory)

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
              <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
              <p className="text-gray-600 mt-1">您收藏的优质文章</p>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">{favorites.length} 篇文章</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              全部 ({favorites.length})
            </Button>
            {Object.entries(categoryNames).map(([key, name]) => {
              const count = favorites.filter(article => article.category === key).length
              return count > 0 ? (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  {name} ({count})
                </Button>
              ) : null
            })}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(article.id)}
                      className="bg-white/90 hover:bg-white border-red-200 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {categoryNames[article.category as keyof typeof categoryNames]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>收藏于 {article.favoriteAt}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/knowledge/article/${article.id}`}>
                        阅读
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏文章</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? '您还没有收藏任何文章，去发现一些有趣的内容吧！'
                : `在${categoryNames[selectedCategory as keyof typeof categoryNames]}分类中暂无收藏文章`
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
