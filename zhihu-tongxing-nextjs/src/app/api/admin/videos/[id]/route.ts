import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { logOperation } from '@/lib/operation-log'
import { Video, VideoEditData } from '@/types/video'

// 导入视频数据（在实际应用中应该从数据库获取）
// 这里我们需要访问主路由中的数据，实际应用中会使用数据库
let videosData: Video[] = []

// 临时解决方案：从主路由获取数据
async function getVideosData(): Promise<Video[]> {
  // 在实际应用中，这里会从数据库获取数据
  // 现在我们使用模拟数据
  if (videosData.length === 0) {
    videosData = [
      {
        id: 'video_1',
        title: '婴幼儿辅食制作指南',
        description: '详细介绍6个月以上宝宝的辅食制作方法和注意事项',
        filename: 'baby_food_guide.mp4',
        originalName: '婴幼儿辅食制作指南.mp4',
        url: '/uploads/videos/baby_food_guide.mp4',
        thumbnailUrl: '/uploads/thumbnails/baby_food_guide.jpg',
        size: 15728640,
        duration: 480,
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
        url: '/uploads/videos/child_safety_demo.mp4',
        thumbnailUrl: '/uploads/thumbnails/child_safety_demo.jpg',
        size: 22020096,
        duration: 600,
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
        url: '/uploads/videos/child_psychology.mp4',
        thumbnailUrl: '/uploads/thumbnails/child_psychology.jpg',
        size: 18874368,
        duration: 720,
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
  }
  return videosData
}

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

/**
 * GET /api/admin/videos/[id]
 * 获取单个视频详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const videos = await getVideosData()
    const video = videos.find(v => v.id === params.id)
    
    if (!video) {
      return NextResponse.json(
        { success: false, error: '视频不存在' },
        { status: 404 }
      )
    }
    
    // 记录操作日志
    await logOperation({
      type: 'READ',
      target: 'video',
      targetId: video.id,
      details: `查看视频详情: ${video.title}`,
      userId: authResult.user.id,
      userRole: 'admin',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    return NextResponse.json({
      success: true,
      data: video
    })
    
  } catch (error) {
    console.error('Get video error:', error)
    return NextResponse.json(
      { success: false, error: '获取视频详情失败' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/videos/[id]
 * 更新视频信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const videos = await getVideosData()
    const videoIndex = videos.findIndex(v => v.id === params.id)
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: '视频不存在' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const updateData: VideoEditData = body
    
    // 验证必填字段
    if (!updateData.title || !updateData.category) {
      return NextResponse.json(
        { success: false, error: '标题和分类为必填项' },
        { status: 400 }
      )
    }
    
    // 更新视频信息
    const originalVideo = videos[videoIndex]
    const updatedVideo: Video = {
      ...originalVideo,
      title: updateData.title,
      description: updateData.description || '',
      category: updateData.category,
      tags: updateData.tags || [],
      visibility: updateData.visibility || 'public',
      thumbnailUrl: updateData.thumbnailUrl || originalVideo.thumbnailUrl
    }
    
    videos[videoIndex] = updatedVideo
    
    // 记录操作日志
    await logOperation({
      type: 'UPDATE',
      target: 'video',
      targetId: updatedVideo.id,
      details: `更新视频: ${updatedVideo.title}`,
      userId: authResult.user.id,
      userRole: 'admin',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    return NextResponse.json({
      success: true,
      data: updatedVideo,
      message: '视频更新成功'
    })
    
  } catch (error) {
    console.error('Update video error:', error)
    return NextResponse.json(
      { success: false, error: '更新视频失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/videos/[id]
 * 删除视频
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const videos = await getVideosData()
    const videoIndex = videos.findIndex(v => v.id === params.id)
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: '视频不存在' },
        { status: 404 }
      )
    }
    
    const video = videos[videoIndex]
    
    // 检查视频是否正在使用中
    if (video.usageCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `视频正在被 ${video.usageCount} 篇文章使用，无法删除。请先从文章中移除该视频。`,
          usedInArticles: video.usedInArticles
        },
        { status: 400 }
      )
    }
    
    // 删除视频记录
    videos.splice(videoIndex, 1)
    
    // 记录操作日志
    await logOperation({
      type: 'DELETE',
      target: 'video',
      targetId: video.id,
      details: `删除视频: ${video.title}`,
      userId: authResult.user.id,
      userRole: 'admin',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    })
    
    return NextResponse.json({
      success: true,
      message: '视频删除成功'
    })
    
  } catch (error) {
    console.error('Delete video error:', error)
    return NextResponse.json(
      { success: false, error: '删除视频失败' },
      { status: 500 }
    )
  }
}
