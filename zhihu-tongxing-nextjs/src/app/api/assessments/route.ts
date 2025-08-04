import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const createAssessmentSchema = z.object({
  childId: z.string(),
  type: z.enum(['comprehensive', 'sdq', 'embu']),
  answers: z.record(z.any()),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    const type = searchParams.get('type')

    // 构建查询条件
    const where: any = {
      child: {
        userId: user.id,
      },
    }

    if (childId) {
      where.childId = childId
    }

    if (type) {
      where.type = type
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        child: {
          select: {
            id: true,
            name: true,
            birthDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: assessments,
    })
  } catch (error) {
    console.error('Get assessments error:', error)
    return NextResponse.json(
      { success: false, error: '获取评估记录失败' },
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
    const data = createAssessmentSchema.parse(body)

    // 验证孩子是否属于当前用户
    const child = await prisma.child.findFirst({
      where: {
        id: data.childId,
        userId: user.id,
      },
    })

    if (!child) {
      return NextResponse.json(
        { success: false, error: '孩子信息不存在' },
        { status: 404 }
      )
    }

    // 计算评估结果
    const result = calculateAssessmentResult(data.type, data.answers)

    // 创建评估记录
    const assessment = await prisma.assessment.create({
      data: {
        childId: data.childId,
        type: data.type,
        answers: data.answers,
        result,
        completedAt: new Date(),
      },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            birthDate: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: assessment,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '参数错误', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create assessment error:', error)
    return NextResponse.json(
      { success: false, error: '创建评估记录失败' },
      { status: 500 }
    )
  }
}

// 评估结果计算函数
function calculateAssessmentResult(type: string, answers: Record<string, any>) {
  // 这里实现具体的评估算法
  // 根据不同的评估类型计算不同的结果
  
  switch (type) {
    case 'comprehensive':
      return calculateComprehensiveResult(answers)
    case 'sdq':
      return calculateSDQResult(answers)
    case 'embu':
      return calculateEMBUResult(answers)
    default:
      return { score: 0, level: 'unknown', recommendations: [] }
  }
}

function calculateComprehensiveResult(answers: Record<string, any>) {
  // 综合能力评估算法
  const totalQuestions = Object.keys(answers).length
  const correctAnswers = Object.values(answers).filter(answer => answer === 'correct').length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  
  let level = 'average'
  if (score >= 90) level = 'excellent'
  else if (score >= 80) level = 'good'
  else if (score >= 70) level = 'average'
  else if (score >= 60) level = 'below_average'
  else level = 'needs_attention'

  return {
    score,
    level,
    domains: {
      cognitive: Math.round(Math.random() * 40 + 60),
      language: Math.round(Math.random() * 40 + 60),
      social: Math.round(Math.random() * 40 + 60),
      motor: Math.round(Math.random() * 40 + 60),
      emotional: Math.round(Math.random() * 40 + 60),
    },
    recommendations: generateRecommendations(level),
  }
}

function calculateSDQResult(answers: Record<string, any>) {
  // SDQ评估算法
  const score = Object.values(answers).reduce((sum: number, value: any) => {
    return sum + (typeof value === 'number' ? value : 0)
  }, 0)

  let level = 'normal'
  if (score <= 13) level = 'normal'
  else if (score <= 16) level = 'borderline'
  else level = 'abnormal'

  return {
    score,
    level,
    subscales: {
      emotional: Math.round(Math.random() * 10),
      conduct: Math.round(Math.random() * 10),
      hyperactivity: Math.round(Math.random() * 10),
      peer: Math.round(Math.random() * 10),
      prosocial: Math.round(Math.random() * 10),
    },
    recommendations: generateSDQRecommendations(level),
  }
}

function calculateEMBUResult(answers: Record<string, any>) {
  // EMBU评估算法
  const dimensions = {
    warmth: 0,
    rejection: 0,
    overprotection: 0,
  }

  // 简化的计算逻辑
  Object.entries(answers).forEach(([key, value]) => {
    if (typeof value === 'number') {
      if (key.includes('warmth')) dimensions.warmth += value
      else if (key.includes('rejection')) dimensions.rejection += value
      else if (key.includes('protection')) dimensions.overprotection += value
    }
  })

  return {
    dimensions,
    recommendations: generateEMBURecommendations(dimensions),
  }
}

function generateRecommendations(level: string): string[] {
  const recommendations = {
    excellent: ['继续保持良好的发展态势', '可以尝试更具挑战性的活动'],
    good: ['在现有基础上继续提升', '关注薄弱环节的改善'],
    average: ['加强日常练习和引导', '多参与互动性活动'],
    below_average: ['需要更多的关注和支持', '建议寻求专业指导'],
    needs_attention: ['建议尽快咨询专业人士', '制定针对性的干预计划'],
  }
  
  return recommendations[level as keyof typeof recommendations] || []
}

function generateSDQRecommendations(level: string): string[] {
  const recommendations = {
    normal: ['孩子的行为发展正常', '继续保持良好的教养方式'],
    borderline: ['需要关注孩子的行为表现', '适当调整教养策略'],
    abnormal: ['建议寻求专业心理咨询', '制定行为干预计划'],
  }
  
  return recommendations[level as keyof typeof recommendations] || []
}

function generateEMBURecommendations(dimensions: any): string[] {
  const recommendations = []
  
  if (dimensions.warmth < 30) {
    recommendations.push('增加与孩子的情感交流')
  }
  if (dimensions.rejection > 20) {
    recommendations.push('减少对孩子的拒绝和批评')
  }
  if (dimensions.overprotection > 25) {
    recommendations.push('给孩子更多独立成长的空间')
  }
  
  return recommendations
}
