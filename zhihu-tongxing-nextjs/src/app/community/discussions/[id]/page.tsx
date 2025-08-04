'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Heart, Share2, Clock, User, ThumbsUp, Reply, Send, Loader2 } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'

interface Reply {
  id: number
  author: string
  avatar: string
  content: string
  likes: number
  createdAt: string
  isExpert: boolean
  timestamp: string
}

interface PostDetailPageProps {
  params: {
    id: string
  }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [newReply, setNewReply] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(256)
  const [replies, setReplies] = useState<Reply[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in a real app, this would be fetched based on params.id
  const discussions = [
    {
      id: 1,
      title: '如何培养孩子的阅读习惯？',
      content: '我家孩子5岁了，对书本不太感兴趣，总是喜欢看电视和玩游戏。有什么好方法可以培养他的阅读兴趣吗？\n\n我试过很多方法：\n1. 给他买了很多绘本，但他总是翻几页就不看了\n2. 每天晚上陪他读故事，但他注意力不集中\n3. 带他去图书馆，他更喜欢玩玩具区\n\n真的很苦恼，希望有经验的家长能分享一些实用的方法。孩子马上要上小学了，担心他的阅读能力跟不上。',
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
      content: '大宝今年8岁，二宝2岁。最近大宝总是表现出嫉妒情绪，有时候会故意欺负弟弟。作为父母应该如何处理这种情况？\n\n具体表现：\n- 当我们照顾二宝时，大宝会故意捣乱\n- 有时候会推倒二宝或者抢他的玩具\n- 经常说"你们只爱弟弟，不爱我了"\n- 晚上要求和以前一样的关注度\n\n我们已经尽量平衡两个孩子的需求，但效果不明显。请问有类似经历的家长是怎么处理的？',
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
      content: '3岁的女儿特别挑食，尤其是绿叶蔬菜一点都不吃。试过很多方法都不管用，求有经验的家长分享一些实用技巧。\n\n目前的情况：\n- 只吃肉类和米饭，蔬菜碰都不碰\n- 试过把蔬菜切碎混在饭里，她能挑出来\n- 做成各种造型也不管用\n- 强迫她吃会哭闹不止\n\n担心营养不均衡影响发育，请大家支支招！',
      author: '张妈妈',
      avatar: '👩',
      category: '营养饮食',
      tags: ['挑食', '营养均衡', '蔬菜'],
      replies: 156,
      likes: 298,
      views: 1560,
      createdAt: '6小时前',
      isHot: true
    }
  ]

  const post = discussions.find(d => d.id === parseInt(params.id)) || discussions[0]

  // Fetch replies when component mounts
  useEffect(() => {
    fetchReplies()
  }, [params.id])

  const fetchReplies = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/discussions/${params.id}/replies`)
      const data = await response.json()

      if (data.success) {
        setReplies(data.data)
      } else {
        console.error('Failed to fetch replies:', data.error)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleReplySubmit = async () => {
    if (!newReply.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/discussions/${params.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newReply.trim(),
          author: '当前用户', // In a real app, this would come from user session
          avatar: '👤'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add the new reply to the beginning of the list (most recent first)
        setReplies(prev => [data.data, ...prev])
        setNewReply('')

        // Show success feedback (optional)
        console.log('Reply submitted successfully!')
      } else {
        console.error('Failed to submit reply:', data.error)
        alert('发表回复失败，请重试')
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('网络错误，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/community/discussions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回讨论列表
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Link href="/community/new-post">
                <Button className="bg-cyan-500 hover:bg-cyan-600" size="sm">
                  发布新帖
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="text-3xl">{post.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
                  {post.isHot && (
                    <Badge variant="destructive">热门</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.createdAt}
                  </span>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
                <span className="flex items-center text-gray-500">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.replies} 回复
                </span>
                <span className="text-gray-500">{post.views} 浏览</span>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">回复 ({replies.length})</h2>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">加载回复中...</span>
              </div>
            ) : replies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>还没有回复，来发表第一个回复吧！</p>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-4">
                    <div className="text-2xl">{reply.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{reply.author}</span>
                        {reply.isExpert && (
                          <Badge variant="default" className="text-xs bg-orange-500">
                            专家
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">{reply.createdAt}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{reply.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {reply.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <Reply className="w-4 h-4 mr-1" />
                          回复
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">发表回复</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="分享你的经验和建议..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  请遵守社区公约，友善交流，分享有价值的内容
                </p>
                <Button
                  onClick={handleReplySubmit}
                  disabled={!newReply.trim() || isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      发布中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      发布回复
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
