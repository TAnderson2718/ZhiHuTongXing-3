'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Heart, Share2, Filter, Search, TrendingUp, Clock, Users, X } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from "@/components/ui/Input"
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingState from '@/components/ui/loading-state'
import { Skeleton, DiscussionCardSkeleton } from '@/components/ui/skeleton'

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [filterBy, setFilterBy] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const discussions = [
    {
      id: 1,
      title: '如何培养孩子的阅读习惯？',
      content: '我家孩子5岁了，对书本不太感兴趣，总是喜欢看电视和玩游戏。有什么好方法可以培养他的阅读兴趣吗？',
      author: '李妈妈',
      avatar: '👩',
      category: '教育方法',
      tags: ['阅读习惯', '学龄前', '兴趣培养'],
      replies: 128,
      likes: 256,
      views: 1240,
      createdAt: '2小时前',
      isHot: true
    },
    {
      id: 2,
      title: '二胎家庭如何平衡两个孩子的关系？',
      content: '大宝今年8岁，二宝2岁。最近大宝总是表现出嫉妒情绪，有时候会故意欺负弟弟。作为父母应该如何处理这种情况？',
      author: '王爸爸',
      avatar: '👨',
      category: '心理健康',
      tags: ['二胎家庭', '手足关系', '嫉妒情绪'],
      replies: 89,
      likes: 167,
      views: 890,
      createdAt: '4小时前',
      isHot: true
    },
    {
      id: 3,
      title: '孩子不爱吃蔬菜，有什么好办法？',
      content: '3岁的女儿特别挑食，尤其是绿叶蔬菜一点都不吃。试过很多方法都不管用，求有经验的家长分享一些实用技巧。',
      author: '张妈妈',
      avatar: '👩',
      category: '营养饮食',
      tags: ['挑食', '营养均衡', '蔬菜'],
      replies: 156,
      likes: 298,
      views: 1560,
      createdAt: '6小时前',
      isHot: true
    },
    {
      id: 4,
      title: '如何帮助孩子建立自信心？',
      content: '我家孩子6岁，性格比较内向，在学校不敢主动和同学交流，做事情也总是说"我不会"。想请教大家如何帮助孩子建立自信心。',
      author: '刘妈妈',
      avatar: '👩',
      category: '心理健康',
      tags: ['自信心', '内向性格', '社交能力'],
      replies: 72,
      likes: 134,
      views: 680,
      createdAt: '8小时前',
      isHot: false
    },
    {
      id: 5,
      title: '青春期孩子叛逆怎么办？',
      content: '13岁的儿子最近变得很叛逆，不听话，经常和我们顶嘴。沟通变得很困难，不知道该如何处理这种情况。',
      author: '陈爸爸',
      avatar: '👨',
      category: '青春期',
      tags: ['青春期', '叛逆', '亲子沟通'],
      replies: 95,
      likes: 189,
      views: 920,
      createdAt: '1天前',
      isHot: false
    }
  ]

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'parenting', label: '育儿心得' },
    { value: 'education', label: '教育方法' },
    { value: 'health', label: '健康成长' },
    { value: 'psychology', label: '心理健康' },
    { value: 'nutrition', label: '营养饮食' },
    { value: 'safety', label: '安全防护' }
  ]

  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'hot', label: '热门讨论' },
    { value: 'replies', label: '回复最多' },
    { value: 'likes', label: '点赞最多' }
  ]

  // Create a mapping between filter values and actual categories
  const categoryMapping: { [key: string]: string } = {
    'all': '',
    'parenting': '育儿心得',
    'education': '教育方法',
    'health': '健康成长',
    'psychology': '心理健康',
    'nutrition': '营养饮食',
    'safety': '安全防护',
    'adolescence': '青春期'
  }

  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           discussion.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesFilter = filterBy === 'all' || discussion.category === categoryMapping[filterBy] || discussion.category === filterBy
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          return (b.likes + b.replies) - (a.likes + a.replies)
        case 'replies':
          return b.replies - a.replies
        case 'likes':
          return b.likes - a.likes
        case 'latest':
        default:
          // Simple time-based sorting (newest first)
          const timeOrder = ['刚刚', '2小时前', '4小时前', '6小时前', '8小时前', '1天前']
          return timeOrder.indexOf(a.createdAt) - timeOrder.indexOf(b.createdAt)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回社区
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">热门讨论</h1>
            </div>
            <Link href="/community/new-post">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                发布新帖
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索讨论话题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Counter */}
          {(searchQuery || filterBy !== 'all') && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                找到 {filteredDiscussions.length} 个讨论
                {searchQuery && ` 包含 "${searchQuery}"`}
                {searchQuery && filterBy !== 'all' && ' 且 '}
                {filterBy !== 'all' && `在 "${categories.find(c => c.value === filterBy)?.label}" 分类中`}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setFilterBy('all')
                }}
              >
                清除所有筛选
              </Button>
            </div>
          )}
        </div>

        {/* Discussion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1,240</div>
              <div className="text-gray-600">今日新增讨论</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8,560</div>
              <div className="text-gray-600">今日新增回复</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3,280</div>
              <div className="text-gray-600">活跃用户</div>
            </CardContent>
          </Card>
        </div>

        {/* Discussions List */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <DiscussionCardSkeleton key={index} />
            ))
          ) : filteredDiscussions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关讨论</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery && `没有包含 "${searchQuery}" 的讨论`}
                {searchQuery && filterBy !== 'all' && ' 且 '}
                {filterBy !== 'all' && `在 "${categories.find(c => c.value === filterBy)?.label}" 分类中`}
              </p>
              <div className="flex justify-center space-x-4">
                {searchQuery && (
                  <Button onClick={() => setSearchQuery('')} variant="outline">
                    清除搜索
                  </Button>
                )}
                {filterBy !== 'all' && (
                  <Button onClick={() => setFilterBy('all')} variant="outline">
                    查看所有分类
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{discussion.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Link href={`/community/discussions/${discussion.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-cyan-600 cursor-pointer">
                          {discussion.title}
                        </h3>
                      </Link>
                      {discussion.isHot && (
                        <Badge variant="destructive" className="text-xs">
                          热门
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{discussion.author}</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {discussion.createdAt}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {discussion.likes}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            加载更多讨论
          </Button>
        </div>
      </main>
    </div>
  )
}
