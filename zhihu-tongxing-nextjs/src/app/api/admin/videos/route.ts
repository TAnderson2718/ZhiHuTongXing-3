import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifyAdminAuth } from '@/lib/auth'
import { logOperation } from '@/lib/operation-log'
import { prisma } from '@/lib/prisma'
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
async function generateVideoStats(): Promise<VideoStats> {
  const totalVideos = await prisma.video.count()
  const totalSizeResult = await prisma.video.aggregate({
    _sum: { size: true }
  })
  const totalDurationResult = await prisma.video.aggregate({
    _sum: { duration: true }
  })
  const totalViewsResult = await prisma.video.aggregate({
    _sum: { views: true }
  })

  const totalSize = totalSizeResult._sum.size || 0
  const totalDuration = totalDurationResult._sum.duration || 0
  const totalViews = totalViewsResult._sum.views || 0

  // 获取分类统计
  const categoryCounts = {} as Record<VideoCategory, number>
  for (const category of Object.keys(VIDEO_CATEGORIES)) {
    const count = await prisma.video.count({
      where: { category }
    })
    categoryCounts[category as VideoCategory] = count
  }

  // 获取格式统计
  const formatResults = await prisma.video.groupBy({
    by: ['format'],
    _count: { format: true }
  })
  const formatCounts = formatResults.reduce((counts, result) => {
    counts[result.format] = result._count.format
    return counts
  }, {} as Record<string, number>)

  // 获取最近上传的视频
  const recentUploads = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      createdAt: true,
      size: true,
      duration: true
    }
  })

  // 获取热门视频
  const popularVideos = await prisma.video.findMany({
    orderBy: { views: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      views: true,
      duration: true
    }
  })
  
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
    
    // 构建查询条件
    const where: any = {}

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ]
    }

    if (query.category) {
      where.category = query.category
    }

    if (query.visibility !== 'all') {
      where.visibility = query.visibility
    }

    // 获取视频总数
    const total = await prisma.video.count({ where })

    // 获取分页视频
    const videos = await prisma.video.findMany({
      where,
      skip: (query.page! - 1) * query.limit!,
      take: query.limit!,
      orderBy: {
        [query.sortBy!]: query.sortOrder
      }
    })

    // 转换数据格式以匹配前端期望
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      filename: video.filename,
      originalName: video.originalName,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      size: video.size,
      duration: video.duration,
      format: video.format,
      resolution: video.resolution,
      bitrate: video.bitrate,
      category: video.category,
      tags: Array.isArray(video.tags) ? video.tags : [],
      visibility: video.visibility,
      status: video.status,
      views: video.views,
      usageCount: video.usageCount,
      uploadedBy: video.uploadedBy,
      uploadedAt: video.createdAt.toISOString(),
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString()
    }))

    const totalPages = Math.ceil(total / query.limit!)
    
    // 生成统计数据
    const stats = await generateVideoStats()

    const response: VideoListResponse = {
      videos: formattedVideos,
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
