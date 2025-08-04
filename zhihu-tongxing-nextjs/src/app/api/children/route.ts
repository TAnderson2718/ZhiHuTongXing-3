import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const createChildSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum(['male', 'female']),
  notes: z.string().optional(),
})

const updateChildSchema = createChildSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const children = await prisma.child.findMany({
      where: { userId: user.id },
      include: {
        assessments: {
          select: {
            id: true,
            type: true,
            completedAt: true,
            result: true,
          },
          orderBy: { completedAt: 'desc' },
          take: 5, // 只返回最近5次评估
        },
        growthRecords: {
          select: {
            id: true,
            type: true,
            date: true,
            value: true,
          },
          orderBy: { date: 'desc' },
          take: 10, // 只返回最近10条成长记录
        },
        _count: {
          select: {
            assessments: true,
            growthRecords: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: children,
    })
  } catch (error) {
    console.error('Get children error:', error)
    return NextResponse.json(
      { success: false, error: '获取孩子信息失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createChildSchema.parse(body)

    const child = await prisma.child.create({
      data: {
        ...data,
        userId: user.id,
      },
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

    console.error('Create child error:', error)
    return NextResponse.json(
      { success: false, error: '创建孩子档案失败' },
      { status: 500 }
    )
  }
}
