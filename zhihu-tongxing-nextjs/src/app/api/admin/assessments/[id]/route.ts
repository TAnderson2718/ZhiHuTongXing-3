import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/auth'

/**
 * GET /api/admin/assessments/[id]
 * 获取单个评估工具详情
 */
export async function GET(
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

    // 获取评估工具模板
    const template = await prisma.assessmentTemplate.findUnique({
      where: { id },
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
        { success: false, error: '评估工具不存在' },
        { status: 404 }
      )
    }

    // 转换数据格式以匹配前端期望
    const assessment = {
      id: template.id,
      name: template.name,
      type: template.type,
      description: template.description,
      ageRange: template.ageRange,
      questions: template.questions ? (typeof template.questions === 'object' && 'count' in template.questions ? template.questions.count : 0) : 0,
      completions: template._count.assessments,
      status: template.isActive ? 'active' : 'draft',
      lastUpdated: template.updatedAt.toISOString().split('T')[0],
      category: template.category,
      difficulty: template.difficulty,
      estimatedTime: template.duration
    }

    return NextResponse.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { success: false, error: '获取评估工具失败' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/assessments/[id]
 * 更新单个评估工具
 */
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
    const { name, type, description, ageRange, questions, category, difficulty, estimatedTime, status } = body

    // 检查评估工具是否存在
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
      where: { id }
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // 准备更新数据
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (description !== undefined) updateData.description = description
    if (ageRange !== undefined) updateData.ageRange = ageRange
    if (category !== undefined) updateData.category = category
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (estimatedTime !== undefined) updateData.duration = estimatedTime
    if (questions !== undefined) updateData.questions = questions ? { count: questions } : null

    // 处理状态更新
    if (status !== undefined) {
      updateData.isActive = status === 'active'
    }

    // 更新评估工具模板
    const updatedTemplate = await prisma.assessmentTemplate.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: {
            assessments: true
          }
        }
      }
    })

    // 转换数据格式以匹配前端期望
    const assessment = {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      type: updatedTemplate.type,
      description: updatedTemplate.description,
      ageRange: updatedTemplate.ageRange,
      questions: questions || 0,
      completions: updatedTemplate._count.assessments,
      status: updatedTemplate.isActive ? 'active' : 'draft',
      lastUpdated: updatedTemplate.updatedAt.toISOString().split('T')[0],
      category: updatedTemplate.category,
      difficulty: updatedTemplate.difficulty,
      estimatedTime: updatedTemplate.duration
    }

    return NextResponse.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json(
      { success: false, error: '更新评估工具失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/assessments/[id]
 * 删除评估工具
 */
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

    // 检查评估工具是否存在
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
      where: { id }
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // 删除评估工具模板
    await prisma.assessmentTemplate.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '评估工具删除成功'
    })
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return NextResponse.json(
      { success: false, error: '删除评估工具失败' },
      { status: 500 }
    )
  }
}
