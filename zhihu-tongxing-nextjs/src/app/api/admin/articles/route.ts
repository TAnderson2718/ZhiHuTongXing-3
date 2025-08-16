import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { loadArticles, createArticle, updateArticle, deleteArticle } from '@/lib/articleStorage'

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

    // 从文件存储获取所有文章
    let articles = loadArticles()

    // 应用筛选条件
    if (search) {
      const searchLower = search.toLowerCase()
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
      )
    }

    if (category) {
      articles = articles.filter(article => article.category === category)
    }

    if (status) {
      articles = articles.filter(article => article.status === status)
    }

    // 按创建时间倒序排序
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 计算分页
    const total = articles.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = articles.slice(startIndex, endIndex)

    // 转换数据格式以匹配前端期望
    const formattedArticles = paginatedArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      status: article.status,
      views: article.views?.toString() || '0',
      rating: article.rating?.toString() || '0',
      publishedAt: article.publishedAt || '',
      readTime: article.readTime || '1分钟',
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
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

    // 使用文件存储创建文章
    const articleData = {
      title,
      excerpt: excerpt || '',
      content,
      category,
      tags: processedTags,
      image: image || `https://picsum.photos/seed/${Date.now()}/800/400`,
      status,
      author: '系统管理员',
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : null,
      readTime: Math.ceil(content.length / 500) + '分钟',
      views: 0,
      rating: 0
    }

    const newArticle = createArticle(articleData)

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
      publishedAt: newArticle.publishedAt || '',
      readTime: newArticle.readTime,
      views: newArticle.views?.toString() || '0',
      rating: newArticle.rating?.toString() || '0',
      createdAt: newArticle.createdAt,
      updatedAt: newArticle.updatedAt
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

    // 处理标签数据
    const processedTags = updateData.tags ?
      (Array.isArray(updateData.tags) ? updateData.tags : updateData.tags.split(',').map((t: string) => t.trim()))
      : undefined

    // 准备更新数据
    const updatePayload: any = {}
    if (updateData.title) updatePayload.title = updateData.title
    if (updateData.excerpt !== undefined) updatePayload.excerpt = updateData.excerpt
    if (updateData.content) updatePayload.content = updateData.content
    if (updateData.category) updatePayload.category = updateData.category
    if (processedTags) updatePayload.tags = processedTags
    if (updateData.image !== undefined) updatePayload.image = updateData.image
    if (updateData.status) {
      updatePayload.status = updateData.status
      if (updateData.status === 'published') {
        updatePayload.publishedAt = new Date().toISOString().split('T')[0]
      } else if (updateData.status === 'draft') {
        updatePayload.publishedAt = null
      }
    }

    // 使用文件存储更新文章
    const updatedArticle = updateArticle(id, updatePayload)

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

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
      publishedAt: updatedArticle.publishedAt || '',
      readTime: updatedArticle.readTime,
      views: updatedArticle.views?.toString() || '0',
      rating: updatedArticle.rating?.toString() || '0',
      createdAt: updatedArticle.createdAt,
      updatedAt: updatedArticle.updatedAt
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

    // 使用文件存储删除文章
    const success = deleteArticle(id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

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
