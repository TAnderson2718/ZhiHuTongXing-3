import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/assessment-templates/[id]
 * 获取单个评估工具模板详情（用户端）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 获取评估工具模板
    const template = await prisma.assessmentTemplate.findUnique({
      where: { 
        id,
        isActive: true // 只返回已激活的评估工具
      },
      include: {
        _count: {
          select: {
            assessments: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: '评估工具不存在或未发布' },
        { status: 404 }
      )
    }

    // 转换数据格式以匹配前端期望
    const assessmentTemplate = {
      id: template.id,
      name: template.name,
      type: template.type,
      title: template.title,
      description: template.description,
      ageRange: template.ageRange,
      duration: template.duration,
      difficulty: template.difficulty,
      category: template.category,
      icon: template.icon,
      color: template.color,
      features: template.features,
      questions: template.questions,
      completions: template._count.assessments,
      isActive: template.isActive,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: assessmentTemplate
    })
  } catch (error) {
    console.error('Error fetching assessment template:', error)
    return NextResponse.json(
      { success: false, error: '获取评估工具失败' },
      { status: 500 }
    )
  }
}
