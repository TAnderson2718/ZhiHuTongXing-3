'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { Users, MessageCircle, Heart, Share2, TrendingUp, Plus, Search, Filter, X } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from "@/components/ui/Input"

// Mock data for community posts
const mockPosts = [
  {
    id: 1,
    title: "如何培养孩子的阅读习惯？",
    content: "分享一些实用的方法和经验",
    author: "李妈",
    authorColor: "pink",
    timeAgo: "2小时前",
    replies: 128,
    likes: 256,
    category: "教育方法",
    tags: ["阅读", "习惯培养", "教育方法"],
    type: "hot"
  },
  {
    id: 2,
    title: "二胎家庭如何平衡两个孩子的关系？",
    content: "求助：大宝总是嫉妒二宝怎么办",
    author: "王爸",
    authorColor: "blue",
    timeAgo: "4小时前",
    replies: 89,
    likes: 167,
    category: "育儿心得",
    tags: ["二胎", "兄弟姐妹", "家庭关系"],
    type: "hot"
  },
  {
    id: 3,
    title: "孩子不爱吃蔬菜，有什么好办法？",
    content: "分享一些让孩子爱上蔬菜的小技巧",
    author: "张妈",
    authorColor: "green",
    timeAgo: "6小时前",
    replies: 156,
    likes: 298,
    category: "健康成长",
    tags: ["饮食", "蔬菜", "健康成长"],
    type: "hot"
  },
  {
    id: 4,
    title: "今天带孩子去公园玩的收获",
    content: "今天带孩子去公园玩，发现他特别喜欢观察小昆虫。回家后我们一起查资料，了解了很多关于蚂蚁的知识。孩子的好奇心真的是最好的老师！",
    author: "陈妈",
    authorColor: "purple",
    timeAgo: "刚刚",
    replies: 3,
    likes: 12,
    category: "亲子游戏",
    tags: ["户外活动", "自然教育", "亲子游戏"],
    type: "recent"
  },
  {
    id: 5,
    title: "5岁女儿遇到困难就说不会怎么办？",
    content: "求助：5岁的女儿最近总是说\"我不会\"，遇到一点困难就放弃。怎么培养她的坚持性和自信心呢？有经验的家长请指教！",
    author: "刘爸",
    authorColor: "yellow",
    timeAgo: "30分钟前",
    replies: 15,
    likes: 8,
    category: "育儿心得",
    tags: ["自信心", "坚持性", "心理建设"],
    type: "recent"
  },
  {
    id: 6,
    title: "幼儿园老师推荐的数学启蒙游戏",
    content: "分享几个简单有趣的数学启蒙小游戏，在家就能和孩子一起玩",
    author: "赵老师",
    authorColor: "indigo",
    timeAgo: "1天前",
    replies: 45,
    likes: 89,
    category: "学习辅导",
    tags: ["数学启蒙", "游戏", "学习辅导"],
    type: "recent"
  }
]

const categories = ["全部", "教育方法", "育儿心得", "健康成长", "亲子游戏", "学习辅导", "新手妈妈"]

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [showFilters, setShowFilters] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // 从API获取帖子数据
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPosts(result.data || [])
        } else {
          setError(result.error || '获取帖子失败')
          setPosts(mockPosts) // 使用备用数据
        }
      } else {
        setError('获取帖子失败')
        setPosts(mockPosts) // 使用备用数据
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('网络错误，请稍后重试')
      setPosts(mockPosts) // 使用备用数据
    } finally {
      setIsLoading(false)
    }
  }

  // Filter posts based on search term and category
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    return filtered
  }, [searchTerm, selectedCategory, posts])

  // Separate hot and recent posts
  const hotPosts = filteredPosts.filter(post => post.type === 'hot')
  const recentPosts = filteredPosts.filter(post => post.type === 'recent')

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('全部')
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-cyan-100 p-4 rounded-full mb-6">
              <Users className="w-12 h-12 text-cyan-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              家长互助社区
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              分享经验，彼此支持，在育儿路上我们并不孤单。
              与全国各地的家长一起交流育儿心得，获得专业指导和温暖支持。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community/new-post">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="w-5 h-5 mr-2" />
                  发布帖子
                </Button>
              </Link>
              <Link href="/community/discussions">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  加入讨论
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">25,000+</div>
              <div className="text-gray-600">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">150,000+</div>
              <div className="text-gray-600">讨论帖子</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">500,000+</div>
              <div className="text-gray-600">互动点赞</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">问题解决率</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">社区动态</h2>
              <p className="text-gray-600 mt-2">最新的讨论和分享</p>
            </div>
            <Link href="/community/new-post">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                发布新帖
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  placeholder="搜索帖子、话题或用户..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-cyan-50 border-cyan-200' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
                {(selectedCategory !== '全部' || searchTerm) && (
                  <span className="ml-2 w-2 h-2 bg-cyan-500 rounded-full"></span>
                )}
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">分类筛选</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategory === category
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(selectedCategory !== '全部' || searchTerm) && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        找到 {filteredPosts.length} 个结果
                        {searchTerm && ` 包含 "${searchTerm}"`}
                        {selectedCategory !== '全部' && ` 在 "${selectedCategory}"`}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        清除筛选
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hot Topics */}
              {hotPosts.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    热门话题
                    <span className="ml-2 text-sm font-normal text-gray-500">({hotPosts.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {hotPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                          <p className="text-sm text-gray-600">{post.content}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {post.replies}回复
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {post.likes}点赞
                            </span>
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`w-10 h-10 bg-${post.authorColor}-100 rounded-full flex items-center justify-center`}>
                            <span className={`text-sm font-medium text-${post.authorColor}-600`}>{post.author}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{post.timeAgo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-cyan-500" />
                    最新帖子
                    <span className="ml-2 text-sm font-normal text-gray-500">({recentPosts.length})</span>
                  </h3>
                  <div className="space-y-6">
                    {recentPosts.map((post, index) => (
                      <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-${post.authorColor}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-sm font-medium text-${post.authorColor}-600`}>{post.author}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{post.title}</h4>
                              <span className="text-xs text-gray-500">{post.timeAgo}</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {post.category}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{post.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <button className="flex items-center hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4 mr-1" />
                                {post.likes}
                              </button>
                              <button className="flex items-center hover:text-cyan-500 transition-colors">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.replies}
                              </button>
                              <button className="flex items-center hover:text-blue-500 transition-colors">
                                <Share2 className="w-4 h-4 mr-1" />
                                分享
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* No Results Message */}
              {filteredPosts.length === 0 && (searchTerm || selectedCategory !== '全部') && (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关内容</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm && `没有包含 "${searchTerm}" 的帖子`}
                    {searchTerm && selectedCategory !== '全部' && ' 且 '}
                    {selectedCategory !== '全部' && `在 "${selectedCategory}" 分类中`}
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    清除筛选条件
                  </Button>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Guidelines */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">社区公约</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>尊重每位家长的育儿方式</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>分享真实有用的经验</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>保护孩子和家庭隐私</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>理性讨论，避免争吵</span>
                  </div>
                </div>
              </Card>

              {/* Popular Tags */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSearchTerm('新手妈妈')}
                    className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm cursor-pointer hover:bg-cyan-200 transition-colors"
                  >
                    #新手妈妈
                  </button>
                  <button
                    onClick={() => setSelectedCategory('育儿心得')}
                    className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition-colors"
                  >
                    #育儿心得
                  </button>
                  <button
                    onClick={() => setSelectedCategory('教育方法')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors"
                  >
                    #教育方法
                  </button>
                  <button
                    onClick={() => setSelectedCategory('亲子游戏')}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                  >
                    #亲子游戏
                  </button>
                  <button
                    onClick={() => setSelectedCategory('健康成长')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm cursor-pointer hover:bg-yellow-200 transition-colors"
                  >
                    #健康成长
                  </button>
                  <button
                    onClick={() => setSelectedCategory('学习辅导')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                  >
                    #学习辅导
                  </button>
                </div>
              </Card>

              {/* Active Members */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">活跃成员</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-red-600">专家</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">育儿专家李老师</div>
                      <div className="text-xs text-gray-500">儿童心理学专家</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">妈妈</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">温柔妈妈</div>
                      <div className="text-xs text-gray-500">两个孩子的妈妈</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600">爸爸</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">超级奶爸</div>
                      <div className="text-xs text-gray-500">全职爸爸</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            加入我们的大家庭
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            与25000+家长一起分享育儿经验，在温暖的社区中共同成长
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community/new-post">
              <Button size="lg" className="bg-white text-cyan-500 hover:bg-gray-100">
                <Plus className="w-5 h-5 mr-2" />
                发布第一个帖子
              </Button>
            </Link>
            <Link href="/community/discussions">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cyan-500">
                <Users className="w-5 h-5 mr-2" />
                浏览更多内容
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
