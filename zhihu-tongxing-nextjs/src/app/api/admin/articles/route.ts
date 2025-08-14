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

// GET - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    // 获取文章总数
    const total = await prisma.article.count({ where })

    // 获取分页文章
    const articles = await prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        excerpt: true,
        author: true,
        category: true,
        status: true,
        views: true,
        rating: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        image: true
      }
    })

    // 转换数据格式以匹配前端期望
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      status: article.status,
      views: article.views.toString(),
      rating: article.rating.toString(),
      publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      tags: Array.isArray(article.tags) ? article.tags : [],
      image: article.image
    }))

    return NextResponse.json({
      success: true,
      data: {
        articles: formattedArticles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// POST - 创建新文章
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
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      status = 'draft'
    } = body

    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容为必填字段' },
        { status: 400 }
      )
    }

    // 处理标签数据
    const processedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : [])

    // 创建新文章到数据库
    const newArticle = await prisma.article.create({
      data: {
        title,
        excerpt: excerpt || '',
        content,
        category,
        tags: processedTags,
        image: image || `https://picsum.photos/seed/${Date.now()}/800/400`,
        status,
        author: '系统管理员',
        publishedAt: status === 'published' ? new Date() : null,
        readTime: Math.ceil(content.length / 500) + '分钟',
        views: 0,
        rating: 0
      }
    })

    console.log('Article created and saved:', newArticle.title)

    // 转换数据格式以匹配前端期望
    const formattedArticle = {
      id: newArticle.id,
      title: newArticle.title,
      excerpt: newArticle.excerpt,
      content: newArticle.content,
      category: newArticle.category,
      tags: Array.isArray(newArticle.tags) ? newArticle.tags : [],
      image: newArticle.image,
      status: newArticle.status,
      author: newArticle.author,
      publishedAt: newArticle.publishedAt?.toISOString().split('T')[0] || '',
      readTime: newArticle.readTime,
      views: newArticle.views.toString(),
      rating: newArticle.rating.toString(),
      createdAt: newArticle.createdAt.toISOString(),
      updatedAt: newArticle.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: formattedArticle,
      message: '文章创建成功'
    })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新文章
export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '文章ID为必填字段' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 处理标签数据
    const processedTags = updateData.tags ?
      (Array.isArray(updateData.tags) ? updateData.tags : updateData.tags.split(',').map((t: string) => t.trim()))
      : undefined

    // 更新文章
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.excerpt !== undefined && { excerpt: updateData.excerpt }),
        ...(updateData.content && { content: updateData.content }),
        ...(updateData.category && { category: updateData.category }),
        ...(processedTags && { tags: processedTags }),
        ...(updateData.image !== undefined && { image: updateData.image }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.status === 'published' && !existingArticle.publishedAt && { publishedAt: new Date() }),
        updatedAt: new Date()
      }
    })

    // 转换数据格式以匹配前端期望
    const formattedArticle = {
      id: updatedArticle.id,
      title: updatedArticle.title,
      excerpt: updatedArticle.excerpt,
      content: updatedArticle.content,
      category: updatedArticle.category,
      tags: Array.isArray(updatedArticle.tags) ? updatedArticle.tags : [],
      image: updatedArticle.image,
      status: updatedArticle.status,
      author: updatedArticle.author,
      publishedAt: updatedArticle.publishedAt?.toISOString().split('T')[0] || '',
      readTime: updatedArticle.readTime,
      views: updatedArticle.views.toString(),
      rating: updatedArticle.rating.toString(),
      createdAt: updatedArticle.createdAt.toISOString(),
      updatedAt: updatedArticle.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: formattedArticle,
      message: '文章更新成功'
    })
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { success: false, error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除文章
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '文章ID为必填字段' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 删除文章
    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { success: false, error: '删除文章失败' },
      { status: 500 }
    )
  }
}
