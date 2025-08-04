'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader,
  Video
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import { useAdminAuth } from '@/hooks/useAdminAuth'
import EnhancedRichTextEditor from '@/components/ui/EnhancedRichTextEditor'




export default function EditArticlePage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticle, setIsLoadingArticle] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'life',
    tags: '',
    image: '',
    status: 'draft'
  })

  useEffect(() => {
    // 只有在用户认证完成后才获取文章数据
    if (adminUser) {
      fetchArticle()
    }
  }, [adminUser, articleId])

  const fetchArticle = async () => {
    try {
      setIsLoadingArticle(true)
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        credentials: 'include' // 使用 Cookie 认证
      })
      
      if (response.ok) {
        const data = await response.json()
        const article = data.data
        setFormData({
          title: article.title,
          excerpt: article.excerpt || '',
          content: article.content,
          category: article.category,
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
          image: article.image || '',
          status: article.status
        })
      } else {
        alert('文章不存在或无权访问')
        router.push('/admin/articles')
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      alert('获取文章失败')
      router.push('/admin/articles')
    } finally {
      setIsLoadingArticle(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // 使用 Cookie 认证
        body: JSON.stringify({
          ...formData,
          status
        })
      })
      
      if (response.ok) {
        router.push('/admin/articles')
      } else {
        const error = await response.json()
        alert(error.error || '保存失败，请重试')
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: 'life', name: '生活照护' },
    { id: 'psychology', name: '心理健康' },
    { id: 'safety', name: '安全防护' },
    { id: 'education', name: '教育发展' }
  ]

  if (authLoading || !adminUser || isLoadingArticle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">{authLoading || !adminUser ? '验证登录状态...' : '加载文章中...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                href="/admin/articles"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回文章列表
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">编辑文章</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/knowledge/article/${articleId}`}>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  预览
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                保存草稿
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={isLoading || !formData.title || !formData.content}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {formData.status === 'published' ? '更新文章' : '发布文章'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章标题 *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="请输入文章标题"
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章摘要
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="请输入文章摘要（可选）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    封面图片
                  </label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </Card>

            {/* Content Editor */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">文章内容</h2>
              <EnhancedRichTextEditor
                content={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="开始编写文章内容..."
                minHeight={400}
                maxHeight={800}
                enableFileUpload={true}
                enableVideoEmbed={true}
                enablePreview={true}
                autoSave={true}
                autoSaveInterval={30000}
                onAutoSave={(content) => {
                  // 可以在这里实现自动保存到草稿
                  console.log('自动保存内容:', content.length, '字符')
                }}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Tags */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">分类和标签</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章分类
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <Input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="用逗号分隔多个标签"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    例如：安全,防护,儿童
                  </p>
                </div>
              </div>
            </Card>

            {/* Video Help */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                视频插入帮助
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• 支持 MP4、WebM 等视频格式</p>
                <p>• 支持腾讯视频、Bilibili 等平台链接</p>
                <p>• 视频会自动适配不同屏幕尺寸</p>
                <p>• 点击编辑器工具栏的视频图标插入</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
