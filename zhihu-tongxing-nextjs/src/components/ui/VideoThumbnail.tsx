'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Clock, Eye, FileVideo } from 'lucide-react'
import { Video, VIDEO_CATEGORIES } from '@/types/video'

interface VideoThumbnailProps {
  video: Video
  size?: 'small' | 'medium' | 'large'
  showDuration?: boolean
  showTitle?: boolean
  showStats?: boolean
  className?: string
  onClick?: () => void
}

export default function VideoThumbnail({
  video,
  size = 'medium',
  showDuration = true,
  showTitle = true,
  showStats = false,
  className = '',
  onClick
}: VideoThumbnailProps) {
  const [imageError, setImageError] = useState(false)

  // 尺寸配置
  const sizeConfig = {
    small: {
      container: 'w-32 h-20',
      image: 'w-32 h-20',
      playIcon: 'w-6 h-6',
      title: 'text-xs',
      stats: 'text-xs'
    },
    medium: {
      container: 'w-48 h-28',
      image: 'w-48 h-28',
      playIcon: 'w-8 h-8',
      title: 'text-sm',
      stats: 'text-xs'
    },
    large: {
      container: 'w-64 h-36',
      image: 'w-64 h-36',
      playIcon: 'w-10 h-10',
      title: 'text-base',
      stats: 'text-sm'
    }
  }

  const config = sizeConfig[size]

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // 获取分类信息
  const categoryInfo = VIDEO_CATEGORIES[video.category]

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 缩略图容器 */}
      <div className={`relative ${config.container} bg-gray-200 rounded-lg overflow-hidden`}>
        {/* 缩略图图片 */}
        {video.thumbnailUrl && !imageError ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <FileVideo className="w-8 h-8 text-gray-500" />
          </div>
        )}

        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <Play className={`${config.playIcon} text-gray-800`} />
            </div>
          </div>
        </div>

        {/* 时长标签 */}
        {showDuration && video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </div>
        )}

        {/* 分类标签 */}
        <div className={`absolute top-2 left-2 ${categoryInfo.color} text-white px-2 py-1 rounded text-xs`}>
          {categoryInfo.label}
        </div>

        {/* 可见性标签 */}
        {video.visibility === 'private' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            私有
          </div>
        )}
      </div>

      {/* 视频信息 */}
      {(showTitle || showStats) && (
        <div className="mt-2 space-y-1">
          {/* 标题 */}
          {showTitle && (
            <h3 className={`${config.title} font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors`}>
              {video.title}
            </h3>
          )}

          {/* 描述 */}
          {showTitle && video.description && size !== 'small' && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {video.description}
            </p>
          )}

          {/* 统计信息 */}
          {showStats && (
            <div className={`${config.stats} text-gray-500 space-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {video.views.toLocaleString()}
                  </span>
                  <span>{formatFileSize(video.size)}</span>
                </div>
                <span>{video.format.toUpperCase()}</span>
              </div>
              
              {video.resolution && (
                <div className="flex items-center justify-between">
                  <span>{video.resolution}</span>
                  <span>{video.bitrate}</span>
                </div>
              )}

              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{video.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {video.usageCount > 0 && (
                <div className="text-blue-600 text-xs">
                  已在 {video.usageCount} 篇文章中使用
                </div>
              )}
            </div>
          )}

          {/* 上传信息 */}
          {showStats && size !== 'small' && (
            <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
              上传于 {new Date(video.uploadedAt).toLocaleDateString('zh-CN')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
