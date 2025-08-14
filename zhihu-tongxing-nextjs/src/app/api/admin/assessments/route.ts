import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mock assessment data
const mockAssessments = [
  {
    id: '1',
    name: 'SDQ行为评估量表',
    type: 'behavior',
    description: '儿童行为问题筛查量表，适用于3-16岁儿童',
    ageRange: '3-16岁',
    questions: 25,
    completions: 1250,
    status: 'active',
    lastUpdated: '2025-01-15',
    category: 'behavior',
    difficulty: 'medium',
    estimatedTime: '10-15分钟'
  },
  {
    id: '2',
    name: 'EMBU父母教养方式评价量表',
    type: 'parenting',
    description: '评估父母教养方式对儿童心理发展的影响',
    ageRange: '6-18岁',
    questions: 58,
    completions: 890,
    status: 'active',
    lastUpdated: '2025-01-12',
    category: 'parenting',
    difficulty: 'high',
    estimatedTime: '20-25分钟'
  },
  {
    id: '3',
    name: '儿童发展里程碑评估',
    type: 'development',
    description: '评估儿童在各个发展阶段的关键能力指标',
    ageRange: '0-6岁',
    questions: 42,
    completions: 2100,
    status: 'active',
    lastUpdated: '2025-01-10',
    category: 'development',
    difficulty: 'low',
    estimatedTime: '15-20分钟'
  },
  {
    id: '4',
    name: '家庭环境评估量表',
    type: 'environment',
    description: '评估家庭环境对儿童成长的影响因素',
    ageRange: '全年龄段',
    questions: 35,
    completions: 650,
    status: 'draft',
    lastUpdated: '2025-01-08',
    category: 'environment',
    difficulty: 'medium',
    estimatedTime: '12-18分钟'
  },
  {
    id: '5',
    name: '儿童照护能力量表',
    type: 'caregiving',
    description: '评估家长在儿童照护方面的能力水平，涵盖日常照护、健康管理、安全防护、情感支持四个维度',
    ageRange: '成人',
    questions: 35,
    completions: 420,
    status: 'active',
    lastUpdated: '2025-01-25',
    category: 'caregiving',
    difficulty: 'medium',
    estimatedTime: '15-20分钟'
  },
  {
    id: '6',
    name: '亲子关系量表',
    type: 'relationship',
    description: '评估亲子关系质量，包括亲密度、沟通质量、冲突处理、共同活动等维度',
    ageRange: '成人',
    questions: 30,
    completions: 380,
    status: 'active',
    lastUpdated: '2025-01-25',
    category: 'relationship',
    difficulty: 'medium',
    estimatedTime: '12-18分钟'
  },
  {
    id: '7',
    name: '父母自我效能感量表',
    type: 'self-efficacy',
    description: '测量父母在育儿方面的自信心和效能感，包括育儿信心、问题解决能力、情绪调节、支持寻求等方面',
    ageRange: '成人',
    questions: 25,
    completions: 310,
    status: 'active',
    lastUpdated: '2025-01-25',
    category: 'self-efficacy',
    difficulty: 'low',
    estimatedTime: '10-15分钟'
  },
  {
    id: '8',
    name: '父母教养能力量表',
    type: 'competence',
    description: '综合评估父母的教养能力，涵盖教养策略、行为管理、学习支持、社交指导等领域',
    ageRange: '成人',
    questions: 45,
    completions: 290,
    status: 'active',
    lastUpdated: '2025-01-25',
    category: 'competence',
    difficulty: 'high',
    estimatedTime: '20-25分钟'
  }
]

// 持久化存储的评估工具数组（简单的内存存储，实际项目中应使用数据库）
let persistentAssessments = [...mockAssessments]

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request)

    if (!user) {
      return { success: false, error: '未登录', status: 401 }
    }

    if (user.role !== 'admin') {
      return { success: false, error: '权限不足，只有管理员可以访问', status: 403 }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return { success: false, error: '认证验证失败', status: 500 }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''

    // 构建数据库查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'draft') {
      where.isActive = false
    }

    // 获取总数
    const total = await prisma.assessmentTemplate.count({ where })

    // 获取分页数据
    const templates = await prisma.assessmentTemplate.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            assessments: true
          }
        }
      }
    })

    // 转换数据格式以匹配前端期望
    const assessments = templates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
      description: template.description,
      ageRange: template.ageRange,
      questions: template.questions ? (Array.isArray(template.questions) ? template.questions.length : 0) : 0,
      completions: template._count.assessments,
      status: template.isActive ? 'active' : 'draft',
      lastUpdated: template.updatedAt.toISOString().split('T')[0],
      category: template.category,
      difficulty: template.difficulty,
      estimatedTime: template.duration
    }))

    return NextResponse.json({
      assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { name, type, description, ageRange, questions, category, difficulty, estimatedTime } = body

    // Validate required fields
    if (!name || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 检查类型是否已存在
    const existingTemplate = await prisma.assessmentTemplate.findFirst({
      where: { type }
    })

    if (existingTemplate) {
      return NextResponse.json({ error: 'Assessment type already exists' }, { status: 400 })
    }

    // 创建新的评估工具模板
    const template = await prisma.assessmentTemplate.create({
      data: {
        name,
        type,
        title: name, // 使用name作为title
        description,
        ageRange: ageRange || '全年龄段',
        duration: estimatedTime || '10-15分钟',
        difficulty: difficulty || 'medium',
        category: category || type,
        questions: questions ? { count: questions } : null,
        isActive: false // 新创建的默认为草稿状态
      }
    })

    // 转换数据格式以匹配前端期望
    const assessment = {
      id: template.id,
      name: template.name,
      type: template.type,
      description: template.description,
      ageRange: template.ageRange,
      questions: questions || 0,
      completions: 0,
      status: 'draft',
      lastUpdated: template.updatedAt.toISOString().split('T')[0],
      category: template.category,
      difficulty: template.difficulty,
      estimatedTime: template.duration
    }

    return NextResponse.json({ id: template.id, assessment }, { status: 201 })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { id, name, type, description, ageRange, questions, category, difficulty, estimatedTime, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

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

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

    const assessmentIndex = mockAssessments.findIndex(assessment => assessment.id === id)
    if (assessmentIndex === -1) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Remove assessment
    const deletedAssessment = mockAssessments.splice(assessmentIndex, 1)[0]

    return NextResponse.json({ message: 'Assessment deleted successfully', assessment: deletedAssessment })
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
