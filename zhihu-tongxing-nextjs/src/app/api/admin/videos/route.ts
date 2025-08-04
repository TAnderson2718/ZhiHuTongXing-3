import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { logOperation } from '@/lib/operation-log'
import { 
  Video, 
  VideoListQuery, 
  VideoListResponse, 
  VideoStats,
  VideoCategory,
  VIDEO_CATEGORIES 
} from '@/types/video'

// 模拟视频数据存储
let videosData: Video[] = [
  {
    id: 'video_1',
    title: '婴幼儿辅食制作指南',
    description: '详细介绍6个月以上宝宝的辅食制作方法和注意事项',
    filename: 'baby_food_guide.mp4',
    originalName: '婴幼儿辅食制作指南.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    size: 15728640, // 15MB
    duration: 480, // 8分钟
    format: 'mp4',
    resolution: '1920x1080',
    bitrate: '2000kbps',
    category: 'education',
    tags: ['辅食', '营养', '育儿'],
    visibility: 'public',
    uploadedAt: '2025-01-01T10:00:00Z',
    uploadedBy: 'admin',
    views: 1250,
    usageCount: 3,
    usedInArticles: ['1', '2']
  },
  {
    id: 'video_2',
    title: '儿童安全防护演示',
    description: '家庭安全隐患排查和儿童安全防护措施演示',
    filename: 'child_safety_demo.mp4',
    originalName: '儿童安全防护演示.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    size: 22020096, // 21MB
    duration: 600, // 10分钟
    format: 'mp4',
    resolution: '1920x1080',
    bitrate: '2500kbps',
    category: 'safety',
    tags: ['安全', '防护', '家庭'],
    visibility: 'public',
    uploadedAt: '2025-01-02T14:30:00Z',
    uploadedBy: 'admin',
    views: 890,
    usageCount: 2,
    usedInArticles: ['9']
  },
  {
    id: 'video_3',
    title: '儿童心理发展科普',
    description: '0-6岁儿童心理发展特点和家长应对策略',
    filename: 'child_psychology.mp4',
    originalName: '儿童心理发展科普.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    size: 18874368, // 18MB
    duration: 720, // 12分钟
    format: 'mp4',
    resolution: '1280x720',
    bitrate: '1800kbps',
    category: 'development',
    tags: ['心理', '发展', '科普'],
    visibility: 'public',
    uploadedAt: '2025-01-03T09:15:00Z',
    uploadedBy: 'admin',
    views: 2100,
    usageCount: 5,
    usedInArticles: ['5', '6', '7']
  }
]

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return { success: false, error: '未登录', status: 401 }
    }
    
    if (session.role !== 'admin') {
      return { success: false, error: '权限不足，只有管理员可以访问', status: 403 }
    }
    
    return { success: true, user: session }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return { success: false, error: '认证验证失败', status: 500 }
  }
}

// 生成视频统计数据
function generateVideoStats(): VideoStats {
  const totalVideos = videosData.length
  const totalSize = videosData.reduce((sum, video) => sum + video.size, 0)
  const totalDuration = videosData.reduce((sum, video) => sum + (video.duration || 0), 0)
  const totalViews = videosData.reduce((sum, video) => sum + video.views, 0)
  
  const categoryCounts = Object.keys(VIDEO_CATEGORIES).reduce((counts, category) => {
    counts[category as VideoCategory] = videosData.filter(v => v.category === category).length
    return counts
  }, {} as Record<VideoCategory, number>)
  
  const formatCounts = videosData.reduce((counts, video) => {
    counts[video.format] = (counts[video.format] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  const recentUploads = [...videosData]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5)
  
  const popularVideos = [...videosData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
  
  return {
    totalVideos,
    totalSize,
    totalDuration,
    totalViews,
    categoryCounts,
    formatCounts,
    recentUploads,
    popularVideos
  }
}

/**
 * GET /api/admin/videos
 * 获取视频列表
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    
    // 解析查询参数
    const { searchParams } = new URL(request.url)
    const query: VideoListQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
      category: (searchParams.get('category') as VideoCategory) || undefined,
      visibility: (searchParams.get('visibility') as 'public' | 'private' | 'all') || 'all',
      sortBy: (searchParams.get('sortBy') as any) || 'uploadedAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    }
    
    // 过滤视频
    let filteredVideos = [...videosData]
    
    // 搜索过滤
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // 分类过滤
    if (query.category) {
      filteredVideos = filteredVideos.filter(video => video.category === query.category)
    }
    
    // 可见性过滤
    if (query.visibility !== 'all') {
      filteredVideos = filteredVideos.filter(video => video.visibility === query.visibility)
    }
    
    // 排序
    filteredVideos.sort((a, b) => {
      const aValue = a[query.sortBy!] as any
      const bValue = b[query.sortBy!] as any
      
      if (query.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    // 分页
    const total = filteredVideos.length
    const totalPages = Math.ceil(total / query.limit!)
    const startIndex = (query.page! - 1) * query.limit!
    const endIndex = startIndex + query.limit!
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex)
    
    // 生成统计数据
    const stats = generateVideoStats()
    
    const response: VideoListResponse = {
      videos: paginatedVideos,
      pagination: {
        page: query.page!,
        limit: query.limit!,
        total,
        totalPages
      },
      stats
    }
    
    // 记录操作日志
    await logOperation({
      type: 'READ',
      target: 'video_list',
      targetId: 'all',
      details: `查看视频列表 - 页面: ${query.page}, 搜索: ${query.search || '无'}`,
      userId: authResult.user.id,
      userRole: 'admin',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    return NextResponse.json({
      success: true,
      data: response
    })
    
  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { success: false, error: '获取视频列表失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/videos
 * 创建新视频记录（配合文件上传）
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const body = await request.json()
    const { title, description, category, tags, visibility, fileData } = body
    
    // 验证必填字段
    if (!title || !category || !fileData) {
      return NextResponse.json(
        { success: false, error: '标题、分类和文件数据为必填项' },
        { status: 400 }
      )
    }
    
    // 创建新视频记录
    const newVideo: Video = {
      id: `video_${Date.now()}`,
      title,
      description: description || '',
      filename: fileData.filename,
      originalName: fileData.originalName,
      url: fileData.url,
      thumbnailUrl: fileData.thumbnailUrl,
      size: fileData.size,
      duration: fileData.duration,
      format: fileData.format,
      resolution: fileData.resolution,
      bitrate: fileData.bitrate,
      category,
      tags: tags || [],
      visibility: visibility || 'public',
      uploadedAt: new Date().toISOString(),
      uploadedBy: authResult.user.id,
      views: 0,
      usageCount: 0,
      usedInArticles: []
    }
    
    // 添加到数据存储
    videosData.push(newVideo)
    
    // 记录操作日志
    await logOperation({
      type: 'CREATE',
      target: 'video',
      targetId: newVideo.id,
      details: `创建视频: ${newVideo.title}`,
      userId: authResult.user.id,
      userRole: 'admin',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    return NextResponse.json({
      success: true,
      data: newVideo,
      message: '视频创建成功'
    })
    
  } catch (error) {
    console.error('Create video error:', error)
    return NextResponse.json(
      { success: false, error: '创建视频失败' },
      { status: 500 }
    )
  }
}
