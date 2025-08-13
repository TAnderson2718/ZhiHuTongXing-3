import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')

    // 构建查询条件 - 只返回已发布的体验
    const where: any = {
      status: 'published'
    }
    
    if (type) {
      where.type = type
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (category) {
      where.category = category
    }

    // 获取体验数据
    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            progress: true
          }
        }
      }
    })

    // 转换数据格式以匹配前端期望
    const formattedExperiences = experiences.map(experience => ({
      id: experience.id,
      title: experience.title,
      description: experience.description,
      difficulty: experience.difficulty,
      duration: experience.duration,
      participants: 1, // 默认值，可以根据需要调整
      rating: experience.rating,
      image: `https://picsum.photos/seed/${experience.id}/400/300`, // 使用ID作为种子生成一致的图片
      tags: Array.isArray(experience.tags) ? experience.tags : [],
      status: 'available', // 已发布的体验都是可用的
      type: experience.type,
      category: experience.category,
      completions: experience.completions,
      targetAge: experience.targetAge,
      learningObjectives: Array.isArray(experience.learningObjectives) ? experience.learningObjectives : []
    }))

    return NextResponse.json({
      success: true,
      data: formattedExperiences
    })
  } catch (error) {
    console.error('Get experiences error:', error)
    return NextResponse.json(
      { success: false, error: '获取体验内容失败' },
      { status: 500 }
    )
  }
}
