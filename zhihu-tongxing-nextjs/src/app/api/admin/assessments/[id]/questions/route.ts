import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/auth'

/**
 * PUT /api/admin/assessments/[id]/questions
 * 更新评估工具的题目
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
    const { questions } = body

    console.log('Updating assessment questions for ID:', id)
    console.log('Questions data:', questions)

    // 验证题目数据格式
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: '题目数据格式错误' },
        { status: 400 }
      )
    }

    // 检查评估工具是否存在
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
      where: { id }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: '评估工具不存在' },
        { status: 404 }
      )
    }

    // 验证每个题目的必要字段
    for (const question of questions) {
      if (!question.content || !question.type) {
        return NextResponse.json(
          { success: false, error: '题目内容和类型为必填项' },
          { status: 400 }
        )
      }
    }

    // 更新评估工具的题目数据
    const updatedTemplate = await prisma.assessmentTemplate.update({
      where: { id },
      data: {
        questions: {
          items: questions,
          count: questions.length
        },
        updatedAt: new Date()
      }
    })

    console.log('Assessment questions updated successfully:', updatedTemplate.id)

    return NextResponse.json({
      success: true,
      message: '题目更新成功',
      data: {
        id: updatedTemplate.id,
        questionsCount: questions.length
      }
    })
  } catch (error) {
    console.error('Error updating assessment questions:', error)
    return NextResponse.json(
      { success: false, error: '更新题目失败，请重试' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/assessments/[id]/questions
 * 获取评估工具的题目
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
      select: {
        id: true,
        name: true,
        type: true,
        questions: true
      }
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: '评估工具不存在' },
        { status: 404 }
      )
    }

    // 解析题目数据
    let questions = []
    if (template.questions && typeof template.questions === 'object') {
      if ('items' in template.questions && Array.isArray(template.questions.items)) {
        questions = template.questions.items
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        type: template.type,
        questions
      }
    })
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json(
      { success: false, error: '获取题目失败' },
      { status: 500 }
    )
  }
}
