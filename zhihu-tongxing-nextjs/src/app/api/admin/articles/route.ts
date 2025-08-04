import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { loadArticles, addArticle, updateArticle, deleteArticle, Article } from '@/lib/articleStorage'

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

    // 从持久化存储加载文章
    let filteredArticles = loadArticles()

    // 过滤条件
    if (category) {
      filteredArticles = filteredArticles.filter(article => article.category === category)
    }

    if (status) {
      filteredArticles = filteredArticles.filter(article => article.status === status)
    }

    if (search) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        articles: paginatedArticles,
        pagination: {
          page,
          limit,
          total: filteredArticles.length,
          totalPages: Math.ceil(filteredArticles.length / limit)
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

    // 创建新文章
    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      excerpt: excerpt || '',
      content,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
      image: image || `https://picsum.photos/seed/${Date.now()}/800/400`,
      status,
      author: '系统管理员',
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : '',
      readTime: Math.ceil(content.length / 500) + '分钟',
      views: '0',
      rating: '0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 使用持久化存储保存文章
    addArticle(newArticle)

    console.log('Article created and saved:', newArticle.title)

    return NextResponse.json({
      success: true,
      data: newArticle,
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

    // 使用持久化存储更新文章
    const updatedArticle = updateArticle(id, updateData)

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle,
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

    // 使用持久化存储删除文章
    const deleted = deleteArticle(id)

    if (!deleted) {
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
