import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { loadArticles } from '@/lib/articleStorage'

const articlesQuerySchema = z.object({
  category: z.string().optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('10'),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = articlesQuerySchema.parse({
      category: searchParams.get('category') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined,
    })

    // 从文件系统加载文章
    let articles = loadArticles()
    
    // 只返回已发布的文章
    articles = articles.filter(article => article.status === 'published')
    
    // 应用筛选条件
    if (query.category) {
      articles = articles.filter(article => article.category === query.category)
    }
    
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchLower)) ||
        (article.content && article.content.toLowerCase().includes(searchLower))
      )
    }

    // 按发布时间排序
    articles.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())

    // 分页
    const total = articles.length
    const skip = (query.page - 1) * query.limit
    const paginatedArticles = articles.slice(skip, skip + query.limit)

    // 处理文章内容，只返回摘要
    const articlesWithExcerpt = paginatedArticles.map(article => ({
      ...article,
      excerpt: article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : ''),
      content: undefined, // 列表页不返回完整内容
    }))

    return NextResponse.json({
      success: true,
      data: articlesWithExcerpt,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '参数错误', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Get articles error:', error)
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}
