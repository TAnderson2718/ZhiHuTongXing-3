import { NextRequest, NextResponse } from 'next/server'
import { loadArticles } from '@/lib/articleStorage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articles = loadArticles()
    const article = articles.find(a => a.id === params.id)

    if (!article) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json(
      { success: false, error: '获取文章详情失败' },
      { status: 500 }
    )
  }
}
