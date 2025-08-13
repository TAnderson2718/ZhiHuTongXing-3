import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    // 获取总数
    const total = await prisma.post.count({ where })

    // 获取分页数据
    const posts = await prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    // 转换数据格式以匹配前端期望
    const authorColors = ['pink', 'blue', 'green', 'purple', 'yellow', 'red', 'indigo', 'gray']
    const categories = ['教育方法', '育儿心得', '健康成长', '亲子游戏', '学习辅导', '新手妈妈']

    const formattedPosts = posts.map((post, index) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.user.name || '匿名用户',
      authorColor: authorColors[index % authorColors.length],
      avatar: post.user.avatar || '/images/default-avatar.png',
      likes: post.likes,
      replies: post._count.comments, // 前端期望的是replies字段
      comments: post._count.comments,
      timeAgo: getTimeAgo(post.createdAt),
      category: categories[index % categories.length], // 随机分配分类
      tags: Array.isArray(post.tags) ? post.tags : ['育儿', '分享'], // 默认标签
      type: post.likes > 200 ? 'hot' : 'recent', // 根据点赞数决定是否为热门
      createdAt: post.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, error: '获取帖子列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, userId } = body

    // 验证必填字段
    if (!title || !content || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.user.name || '匿名用户',
        avatar: post.user.avatar || '/images/default-avatar.png',
        likes: post.likes,
        comments: post._count.comments,
        timeAgo: '刚刚',
        createdAt: post.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, error: '创建帖子失败' },
      { status: 500 }
    )
  }
}

// 辅助函数：计算时间差
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}
