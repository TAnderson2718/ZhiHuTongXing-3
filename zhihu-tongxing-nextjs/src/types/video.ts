/**
 * 视频管理系统类型定义
 */

export interface Video {
  id: string
  title: string
  description?: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  size: number
  duration?: number
  format: string
  resolution?: string
  bitrate?: string
  category: VideoCategory
  tags: string[]
  visibility: 'public' | 'private'
  uploadedAt: string
  uploadedBy: string
  views: number
  usageCount: number
  usedInArticles: string[] // 文章ID列表
}

export type VideoCategory = 
  | 'education'    // 教育
  | 'entertainment' // 娱乐
  | 'science'      // 科普
  | 'health'       // 健康
  | 'safety'       // 安全
  | 'development'  // 发展
  | 'other'        // 其他

export interface VideoUploadData {
  title: string
  description?: string
  category: VideoCategory
  tags: string[]
  visibility: 'public' | 'private'
  file: File
}

export interface VideoEditData {
  title: string
  description?: string
  category: VideoCategory
  tags: string[]
  visibility: 'public' | 'private'
  thumbnailUrl?: string
}

export interface VideoListQuery {
  page?: number
  limit?: number
  search?: string
  category?: VideoCategory
  visibility?: 'public' | 'private' | 'all'
  sortBy?: 'uploadedAt' | 'title' | 'size' | 'duration' | 'views'
  sortOrder?: 'asc' | 'desc'
}

export interface VideoListResponse {
  videos: Video[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    totalVideos: number
    totalSize: number
    totalDuration: number
    categoryCounts: Record<VideoCategory, number>
  }
}

export interface VideoStats {
  totalVideos: number
  totalSize: number
  totalDuration: number
  totalViews: number
  categoryCounts: Record<VideoCategory, number>
  formatCounts: Record<string, number>
  recentUploads: Video[]
  popularVideos: Video[]
}

export interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
  controls?: boolean
  width?: number | string
  height?: number | string
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export interface VideoThumbnailProps {
  video: Video
  size?: 'small' | 'medium' | 'large'
  showDuration?: boolean
  showTitle?: boolean
  className?: string
  onClick?: () => void
}

export interface VideoUploadProgress {
  id: string
  filename: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error'
  error?: string
}

export interface VideoValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
}

export interface VideoMetadata {
  duration: number
  resolution: string
  bitrate: string
  format: string
  size: number
  fps?: number
  codec?: string
}

// 视频分类配置
export const VIDEO_CATEGORIES: Record<VideoCategory, { 
  label: string
  color: string
  icon: string
}> = {
  education: {
    label: '教育',
    color: 'bg-blue-500',
    icon: 'GraduationCap'
  },
  entertainment: {
    label: '娱乐',
    color: 'bg-purple-500',
    icon: 'Smile'
  },
  science: {
    label: '科普',
    color: 'bg-green-500',
    icon: 'Microscope'
  },
  health: {
    label: '健康',
    color: 'bg-red-500',
    icon: 'Heart'
  },
  safety: {
    label: '安全',
    color: 'bg-orange-500',
    icon: 'Shield'
  },
  development: {
    label: '发展',
    color: 'bg-indigo-500',
    icon: 'TrendingUp'
  },
  other: {
    label: '其他',
    color: 'bg-gray-500',
    icon: 'Folder'
  }
}

// 支持的视频格式
export const SUPPORTED_VIDEO_FORMATS = [
  'mp4',
  'webm',
  'ogg',
  'avi',
  'mov',
  'wmv',
  'flv'
]

// 视频文件大小限制 (50MB)
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024

// 视频时长限制 (10分钟)
export const MAX_VIDEO_DURATION = 10 * 60
