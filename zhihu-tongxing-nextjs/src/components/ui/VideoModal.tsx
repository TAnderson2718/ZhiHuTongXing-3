'use client'

import { X, Download, Share2, Edit, Trash2, Eye, Clock, HardDrive } from 'lucide-react'
import Button from './button'
import VideoPlayer from './VideoPlayer'
import { Video, VIDEO_CATEGORIES } from '@/types/video'

interface VideoModalProps {
  isOpen: boolean
  video: Video | null
  onClose: () => void
  onEdit?: (video: Video) => void
  onDelete?: (video: Video) => void
}

export default function VideoModal({
  isOpen,
  video,
  onClose,
  onEdit,
  onDelete
}: VideoModalProps) {
  if (!isOpen || !video) return null

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

  const categoryInfo = VIDEO_CATEGORIES[video.category]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {video.title}
            </h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${categoryInfo.color}`}>
                {categoryInfo.label}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {video.views.toLocaleString()} 次观看
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {video.duration ? formatDuration(video.duration) : '未知'}
              </span>
              <span className="flex items-center">
                <HardDrive className="w-4 h-4 mr-1" />
                {formatFileSize(video.size)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {/* 操作按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // 下载功能
                const link = document.createElement('a')
                link.href = video.url
                link.download = video.originalName
                link.click()
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // 分享功能
                if (navigator.share) {
                  navigator.share({
                    title: video.title,
                    text: video.description,
                    url: video.url
                  })
                } else {
                  // 复制链接到剪贴板
                  navigator.clipboard.writeText(video.url)
                  alert('链接已复制到剪贴板')
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(video)}
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(video)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 视频播放器 */}
            <div className="lg:col-span-2">
              <VideoPlayer
                video={video}
                width="100%"
                height="400px"
                controls={true}
                className="rounded-lg overflow-hidden"
              />
            </div>
            
            {/* 视频信息 */}
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">视频信息</h3>
                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">文件名</dt>
                    <dd className="text-sm text-gray-900">{video.filename}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">格式</dt>
                    <dd className="text-sm text-gray-900">{video.format.toUpperCase()}</dd>
                  </div>
                  
                  {video.resolution && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">分辨率</dt>
                      <dd className="text-sm text-gray-900">{video.resolution}</dd>
                    </div>
                  )}
                  
                  {video.bitrate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">比特率</dt>
                      <dd className="text-sm text-gray-900">{video.bitrate}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">可见性</dt>
                    <dd className="text-sm text-gray-900">
                      {video.visibility === 'public' ? '公开' : '私有'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">上传时间</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(video.uploadedAt).toLocaleString('zh-CN')}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">上传者</dt>
                    <dd className="text-sm text-gray-900">{video.uploadedBy}</dd>
                  </div>
                </div>
              </div>
              
              {/* 描述 */}
              {video.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">描述</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              )}
              
              {/* 标签 */}
              {video.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 使用情况 */}
              {video.usageCount > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">使用情况</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      此视频已在 <span className="font-medium">{video.usageCount}</span> 篇文章中使用
                    </p>
                    {video.usedInArticles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-blue-600">文章ID: {video.usedInArticles.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 统计信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">统计信息</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">观看次数</span>
                    <span className="font-medium">{video.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">使用次数</span>
                    <span className="font-medium">{video.usageCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
