import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('active')
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    // 构建查询条件
    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (category) {
      where.category = category
    }
    
    if (type) {
      where.type = type
    }

    const templates = await prisma.assessmentTemplate.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        type: true,
        title: true,
        description: true,
        ageRange: true,
        duration: true,
        difficulty: true,
        category: true,
        icon: true,
        color: true,
        features: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assessments: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length
    })
  } catch (error) {
    console.error('Get assessment templates error:', error)
    return NextResponse.json(
      { success: false, error: '获取评估工具模板失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      title,
      description,
      ageRange,
      duration,
      difficulty = 'medium',
      category,
      icon,
      color,
      features,
      questions,
      isActive = true
    } = body

    // 验证必填字段
    if (!name || !type || !title || !description) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 检查类型是否已存在
    const existingTemplate = await prisma.assessmentTemplate.findFirst({
      where: { type }
    })

    if (existingTemplate) {
      return NextResponse.json(
        { success: false, error: '该评估类型已存在' },
        { status: 400 }
      )
    }

    const template = await prisma.assessmentTemplate.create({
      data: {
        name,
        type,
        title,
        description,
        ageRange: ageRange || '全年龄段',
        duration: duration || '10-15分钟',
        difficulty,
        category: category || type,
        icon,
        color,
        features,
        questions,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: template
    }, { status: 201 })
  } catch (error) {
    console.error('Create assessment template error:', error)
    return NextResponse.json(
      { success: false, error: '创建评估工具模板失败' },
      { status: 500 }
    )
  }
}
