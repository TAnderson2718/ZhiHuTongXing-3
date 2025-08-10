import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { getArticleById, updateArticle, deleteArticle, loadArticles } from '@/lib/articleStorage'


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

// GET - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // 使用持久化存储获取文章
    const article = getArticleById(id)
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 增加浏览量（仅对已发布的文章）
    if (article.status === 'published') {
      const currentViews = parseInt(article.views) || 0
      article.views = (currentViews + 1).toString()
    }

    return NextResponse.json({
      success: true,
      data: article
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新单个文章
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

    const { id } = params
    const body = await request.json()

    // 准备更新数据
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    }

    // 如果状态改为已发布且之前没有发布时间，设置发布时间
    if (body.status === 'published') {
      const existingArticle = getArticleById(id)
      if (existingArticle && !existingArticle.publishedAt) {
        updateData.publishedAt = new Date().toISOString().split('T')[0]
      }
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
    return NextResponse.json(
      { success: false, error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除单个文章
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

    const { id } = params

    // 使用持久化存储删除文章
    const deletedArticle = deleteArticle(id)

    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: deletedArticle,
      message: '文章删除成功'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除文章失败' },
      { status: 500 }
    )
  }
}
