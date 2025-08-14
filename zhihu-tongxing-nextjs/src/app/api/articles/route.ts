import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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

    // 构建查询条件
    const where: any = {
      status: 'published' // 只返回已发布的文章
    }

    if (query.category) {
      where.category = query.category
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } }
      ]
    }

    // 获取文章总数
    const total = await prisma.article.count({ where })

    // 获取分页文章
    const articles = await prisma.article.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        excerpt: true,
        author: true,
        category: true,
        tags: true,
        image: true,
        readTime: true,
        views: true,
        rating: true,
        publishedAt: true,
        createdAt: true
      }
    })

    // 转换数据格式以匹配前端期望
    const articlesWithExcerpt = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      author: article.author,
      category: article.category,
      tags: Array.isArray(article.tags) ? article.tags : [],
      image: article.image,
      readTime: article.readTime,
      views: article.views.toString(),
      rating: article.rating.toString(),
      publishedAt: article.publishedAt?.toISOString().split('T')[0] || '',
      createdAt: article.createdAt.toISOString()
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
