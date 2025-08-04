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
      category: searchParams.get('category'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    })

    const skip = (query.page - 1) * query.limit
    
    // 构建查询条件
    const where: any = {}
    
    if (query.category) {
      where.category = query.category
    }
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 获取文章列表
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true,
          author: true,
          category: true,
          coverImage: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    // 处理文章内容，只返回摘要
    const articlesWithExcerpt = articles.map(article => ({
      ...article,
      excerpt: article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
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
