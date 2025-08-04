'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Play,
  Edit,
  Trash2,
  Eye,
  Plus,
  Download,
  MoreVertical,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/Input'
import FileUpload from '@/components/ui/FileUpload'
import VideoThumbnail from '@/components/ui/VideoThumbnail'
import VideoPlayer from '@/components/ui/VideoPlayer'
import VideoUploadModal from '@/components/ui/VideoUploadModal'
import VideoModal from '@/components/ui/VideoModal'
import {
  Video,
  VideoListQuery,
  VideoListResponse,
  VideoCategory,
  VIDEO_CATEGORIES
} from '@/types/video'

export default function VideosManagePage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()

  // 状态管理
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  // 查询参数
  const [query, setQuery] = useState<VideoListQuery>({
    page: 1,
    limit: 12,
    search: '',
    category: undefined,
    visibility: 'all',
    sortBy: 'uploadedAt',
    sortOrder: 'desc'
  })

  // 分页和统计
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const [stats, setStats] = useState({
    totalVideos: 0,
    totalSize: 0,
    totalDuration: 0,
    categoryCounts: {} as Record<VideoCategory, number>
  })

  // 获取视频列表
  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/videos?${params}`)
      const data = await response.json()

      if (data.success) {
        setVideos(data.data.videos)
        setPagination(data.data.pagination)
        setStats(data.data.stats)
      } else {
        setError(data.error || '获取视频列表失败')
      }
    } catch (err) {
      console.error('Fetch videos error:', err)
      setError('获取视频列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除视频
  const deleteVideo = async (videoId: string) => {
    if (!confirm('确定要删除这个视频吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchVideos() // 重新获取列表
        setSelectedVideos(prev => prev.filter(id => id !== videoId))
      } else {
        alert(data.error || '删除失败')
      }
    } catch (err) {
      console.error('Delete video error:', err)
      alert('删除失败')
    }
  }

  // 批量删除
  const batchDelete = async () => {
    if (selectedVideos.length === 0) return

    if (!confirm(`确定要删除选中的 ${selectedVideos.length} 个视频吗？此操作不可撤销。`)) {
      return
    }

    try {
      const promises = selectedVideos.map(id =>
        fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
      )

      await Promise.all(promises)
      await fetchVideos()
      setSelectedVideos([])
    } catch (err) {
      console.error('Batch delete error:', err)
      alert('批量删除失败')
    }
  }

  // 处理搜索
  const handleSearch = (searchTerm: string) => {
    setQuery(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }

  // 处理筛选
  const handleFilter = (key: keyof VideoListQuery, value: any) => {
    setQuery(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  // 处理排序
  const handleSort = (sortBy: string) => {
    setQuery(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }))
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }))
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    fetchVideos()
  }, [query])

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
              <h1 className="text-xl font-semibold text-gray-900">视频管理</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 上传按钮 */}
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                上传视频
              </Button>

              {/* 批量操作 */}
              {selectedVideos.length > 0 && (
                <Button
                  variant="outline"
                  onClick={batchDelete}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除选中 ({selectedVideos.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总视频数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总大小</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总时长</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Grid className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">分类数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(stats.categoryCounts).filter(count => count > 0).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 搜索和筛选栏 */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="搜索视频标题、描述或标签..."
                  value={query.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 筛选和排序 */}
            <div className="flex items-center space-x-4">
              {/* 分类筛选 */}
              <select
                value={query.category || ''}
                onChange={(e) => handleFilter('category', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有分类</option>
                {Object.entries(VIDEO_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* 可见性筛选 */}
              <select
                value={query.visibility || 'all'}
                onChange={(e) => handleFilter('visibility', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有状态</option>
                <option value="public">公开</option>
                <option value="private">私有</option>
              </select>

              {/* 排序 */}
              <div className="flex items-center space-x-2">
                <select
                  value={query.sortBy || 'uploadedAt'}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="uploadedAt">上传时间</option>
                  <option value="title">标题</option>
                  <option value="size">文件大小</option>
                  <option value="duration">时长</option>
                  <option value="views">观看次数</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort(query.sortBy || 'uploadedAt')}
                >
                  {query.sortOrder === 'desc' ?
                    <SortDesc className="w-4 h-4" /> :
                    <SortAsc className="w-4 h-4" />
                  }
                </Button>
              </div>

              {/* 视图切换 */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 视频列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchVideos} variant="outline">
              重试
            </Button>
          </Card>
        ) : videos.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">📹</div>
            <p className="text-gray-600 mb-4">
              {query.search || query.category ? '没有找到匹配的视频' : '还没有上传任何视频'}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              上传第一个视频
            </Button>
          </Card>
        ) : (
          <>
            {/* 网格视图 */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {videos.map((video) => (
                  <Card key={video.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* 视频缩略图 */}
                      <VideoThumbnail
                        video={video}
                        size="medium"
                        showDuration={true}
                        showTitle={false}
                        onClick={() => {
                          setSelectedVideo(video)
                          setShowVideoModal(true)
                        }}
                      />

                      {/* 视频信息 */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {video.title}
                        </h3>

                        {video.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {video.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(video.size)}</span>
                          <span>{video.views} 次观看</span>
                        </div>

                        {/* 标签 */}
                        {video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {video.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {video.tags.length > 2 && (
                              <span className="text-gray-400 text-xs">
                                +{video.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedVideos.includes(video.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVideos(prev => [...prev, video.id])
                              } else {
                                setSelectedVideos(prev => prev.filter(id => id !== video.id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-gray-500">选择</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedVideo(video)
                              setShowVideoModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: 实现编辑功能
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVideo(video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* 列表视图 */}
            {viewMode === 'list' && (
              <Card className="overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedVideos.length === videos.length && videos.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVideos(videos.map(v => v.id))
                              } else {
                                setSelectedVideos([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          视频
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          分类
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          大小
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时长
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          观看次数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          上传时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {videos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedVideos.includes(video.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedVideos(prev => [...prev, video.id])
                                } else {
                                  setSelectedVideos(prev => prev.filter(id => id !== video.id))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <VideoThumbnail
                                video={video}
                                size="small"
                                showDuration={true}
                                showTitle={false}
                                className="mr-4"
                                onClick={() => {
                                  setSelectedVideo(video)
                                  setShowVideoModal(true)
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {video.title}
                                </div>
                                {video.description && (
                                  <div className="text-sm text-gray-500 line-clamp-1">
                                    {video.description}
                                  </div>
                                )}
                                {video.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {video.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${VIDEO_CATEGORIES[video.category].color}`}>
                              {VIDEO_CATEGORIES[video.category].label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatFileSize(video.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {video.duration ? formatDuration(video.duration) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {video.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(video.uploadedAt).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedVideo(video)
                                  setShowVideoModal(true)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: 实现编辑功能
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteVideo(video.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  显示第 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                  共 {pagination.total} 条记录
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    上一页
                  </Button>

                  {/* 页码 */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = Math.max(1, pagination.page - 2) + i
                    if (page > pagination.totalPages) return null

                    return (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 上传模态框 */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={fetchVideos}
      />

      {/* 视频预览模态框 */}
      <VideoModal
        isOpen={showVideoModal}
        video={selectedVideo}
        onClose={() => {
          setShowVideoModal(false)
          setSelectedVideo(null)
        }}
        onEdit={(video) => {
          // TODO: 实现编辑功能
          console.log('Edit video:', video)
        }}
        onDelete={(video) => {
          setShowVideoModal(false)
          setSelectedVideo(null)
          deleteVideo(video.id)
        }}
      />
    </div>
  )
}

