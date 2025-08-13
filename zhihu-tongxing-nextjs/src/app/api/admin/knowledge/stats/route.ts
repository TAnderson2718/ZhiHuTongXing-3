import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)

    if (!user) {
      return { success: false, error: '未登录', status: 401 }
    }

    if (user.role !== 'admin') {
      return { success: false, error: '权限不足，只有管理员可以访问', status: 403 }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return { success: false, error: '认证验证失败', status: 500 }
  }
}

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status || 500 }
      )
    }

    // 获取知识管理相关统计数据
    const [
      totalUsers,
      totalArticles,
      totalVideos
    ] = await Promise.all([
      // 用户总数
      prisma.user.count(),
      
      // 文章总数 (暂时使用模拟数据，因为还没有文章表)
      Promise.resolve(156),
      
      // 视频总数 (暂时使用模拟数据，因为还没有视频表)
      Promise.resolve(89)
    ])

    // 计算总浏览量和活跃用户 (基于用户数的合理估算)
    const totalViews = Math.floor(totalArticles * 290 + totalVideos * 120) // 基于内容数量估算浏览量
    const activeUsers = Math.floor(totalUsers * 0.75) // 75%的用户是活跃的

    const stats = [
      { 
        label: '知识文章', 
        value: totalArticles.toString(), 
        icon: 'FileText', 
        color: 'bg-blue-100 text-blue-600' 
      },
      { 
        label: '视频资源', 
        value: totalVideos.toString(), 
        icon: 'Video', 
        color: 'bg-purple-100 text-purple-600' 
      },
      { 
        label: '总浏览量', 
        value: totalViews.toLocaleString(), 
        icon: 'Eye', 
        color: 'bg-green-100 text-green-600' 
      },
      { 
        label: '活跃用户', 
        value: activeUsers.toLocaleString(), 
        icon: 'Users', 
        color: 'bg-orange-100 text-orange-600' 
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        stats,
        rawData: {
          totalUsers,
          totalArticles,
          totalVideos,
          totalViews,
          activeUsers
        }
      }
    })

  } catch (error) {
    console.error('Error fetching knowledge stats:', error)
    return NextResponse.json(
      { success: false, error: '获取知识管理统计数据失败' },
      { status: 500 }
    )
  }
}
