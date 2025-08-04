import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const updateChildSchema = z.object({
  name: z.string().min(1, '姓名不能为空').optional(),
  birthDate: z.string().transform((str) => new Date(str)).optional(),
  gender: z.enum(['male', 'female']).optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const child = await prisma.child.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        assessments: {
          orderBy: { completedAt: 'desc' },
        },
        growthRecords: {
          orderBy: { date: 'desc' },
        },
        _count: {
          select: {
            assessments: true,
            growthRecords: true,
          },
        },
      },
    })

    if (!child) {
      return NextResponse.json(
        { success: false, error: '孩子信息不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: child,
    })
  } catch (error) {
    console.error('Get child error:', error)
    return NextResponse.json(
      { success: false, error: '获取孩子信息失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = updateChildSchema.parse(body)

    // 验证孩子是否属于当前用户
    const existingChild = await prisma.child.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingChild) {
      return NextResponse.json(
        { success: false, error: '孩子信息不存在' },
        { status: 404 }
      )
    }

    const child = await prisma.child.update({
      where: { id: params.id },
      data,
      include: {
        _count: {
          select: {
            assessments: true,
            growthRecords: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: child,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '参数错误', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update child error:', error)
    return NextResponse.json(
      { success: false, error: '更新孩子信息失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    // 验证孩子是否属于当前用户
    const existingChild = await prisma.child.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingChild) {
      return NextResponse.json(
        { success: false, error: '孩子信息不存在' },
        { status: 404 }
      )
    }

    // 删除相关的评估记录和成长记录
    await prisma.$transaction([
      prisma.assessment.deleteMany({
        where: { childId: params.id },
      }),
      prisma.growthRecord.deleteMany({
        where: { childId: params.id },
      }),
      prisma.child.delete({
        where: { id: params.id },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('Delete child error:', error)
    return NextResponse.json(
      { success: false, error: '删除孩子信息失败' },
      { status: 500 }
    )
  }
}
