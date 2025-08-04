'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Image, Tag, Send } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from "@/components/ui/Input"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const categories = [
    { value: 'parenting', label: '育儿心得' },
    { value: 'education', label: '教育方法' },
    { value: 'health', label: '健康成长' },
    { value: 'psychology', label: '心理健康' },
    { value: 'safety', label: '安全防护' },
    { value: 'nutrition', label: '营养饮食' },
    { value: 'games', label: '亲子游戏' },
    { value: 'help', label: '求助问答' }
  ]

  const popularTags = ['新手妈妈', '二胎家庭', '学龄前', '青春期', '注意力', '情绪管理', '睡眠问题', '挑食']

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Post data:', { title, content, category, tags })
    // For now, just redirect back to community
    window.location.href = '/community'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回社区
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">发布新帖子</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">帖子标题</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="请输入一个吸引人的标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
                required
              />
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择分类</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="请选择帖子分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">帖子内容</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="分享您的育儿经验、困惑或问题..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="resize-none"
                required
              />
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <Button type="button" variant="ghost" size="sm">
                    <Image className="w-4 h-4 mr-2" />
                    添加图片
                  </Button>
                </div>
                <span>{content.length}/2000</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">添加标签</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="输入自定义标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                  />
                  <Button type="button" onClick={() => addTag(newTag)} disabled={!newTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">热门标签：</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => addTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/community">
              <Button type="button" variant="outline">
                取消
              </Button>
            </Link>
            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
              <Send className="w-4 h-4 mr-2" />
              发布帖子
            </Button>
          </div>
        </form>

        {/* Posting Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">发帖指南</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 请使用友善、尊重的语言与其他家长交流</li>
              <li>• 分享真实的育儿经验，避免虚假信息</li>
              <li>• 保护孩子和家庭的隐私，不要透露过多个人信息</li>
              <li>• 如需专业医疗建议，请咨询专业医生</li>
              <li>• 遵守社区公约，共同维护良好的交流环境</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
