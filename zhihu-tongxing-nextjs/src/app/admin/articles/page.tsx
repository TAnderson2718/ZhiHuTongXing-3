'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"

import { TableRowSkeleton } from '@/components/ui/skeleton'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function ArticlesManagePage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    // 只有在用户认证完成后才获取文章
    if (adminUser) {
      fetchArticles()
    }
  }, [adminUser, searchQuery, filterCategory, filterStatus])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterCategory) params.append('category', filterCategory)
      if (filterStatus) params.append('status', filterStatus)
      
      const response = await fetch(`/api/admin/articles?${params}`, {
        credentials: 'include' // 使用 Cookie 认证
      })
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.data.articles)
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return
    }
    
    try {
      const response = await fetch(`/api/admin/articles?id=${id}`, {
        method: 'DELETE',
        credentials: 'include' // 使用 Cookie 认证
      })
      
      if (response.ok) {
        fetchArticles() // 重新获取文章列表
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('删除文章失败:', error)
      alert('删除失败，请重试')
    }
  }

  const categories = [
    { id: '', name: '全部分类' },
    { id: 'life', name: '生活照护' },
    { id: 'psychology', name: '心理健康' },
    { id: 'safety', name: '安全防护' },
    { id: 'education', name: '教育发展' }
  ]

  const statuses = [
    { id: '', name: '全部状态' },
    { id: 'draft', name: '草稿' },
    { id: 'published', name: '已发布' }
  ]

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { text: '草稿', className: 'bg-gray-100 text-gray-800' },
      published: { text: '已发布', className: 'bg-green-100 text-green-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
        {config.text}
      </span>
    )
  }

  if (authLoading || !adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">验证登录状态...</p>
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
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回仪表板
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">文章管理</h1>
            </div>
            <Link href="/admin/articles/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                创建文章
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜索文章
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索标题或内容..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类筛选
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态筛选
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setFilterCategory('')
                  setFilterStatus('')
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                清除筛选
              </Button>
            </div>
          </div>
        </Card>

        {/* Articles Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))}
                  </>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      暂无文章数据
                    </td>
                  </tr>
                ) : (
                  articles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden relative">
                            {article.image && (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              作者: {article.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryName(article.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>浏览: {article.views}</div>
                        <div>阅读: {article.readTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.publishedAt || '未发布'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/knowledge/article/${article.id}`}>
                            <Button variant="outline" size="sm" title="预览">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/articles/edit/${article.id}`}>
                            <Button variant="outline" size="sm" title="编辑">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
