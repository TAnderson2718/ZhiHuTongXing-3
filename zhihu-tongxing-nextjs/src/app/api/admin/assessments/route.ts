import { NextRequest, NextResponse } from 'next/server'

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

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest) {
  try {
    const { getSession } = await import('@/lib/auth')
    const user = await getSession()

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

    let filteredAssessments = [...mockAssessments]

    // Apply filters
    if (search) {
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.name.toLowerCase().includes(search.toLowerCase()) ||
        assessment.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (type) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.type === type)
    }

    if (status) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.status === status)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex)

    return NextResponse.json({
      assessments: paginatedAssessments,
      pagination: {
        page,
        limit,
        total: filteredAssessments.length,
        totalPages: Math.ceil(filteredAssessments.length / limit)
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
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, description, ageRange, questions, category, difficulty, estimatedTime } = body

    // Validate required fields
    if (!name || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new assessment
    const newAssessment = {
      id: (mockAssessments.length + 1).toString(),
      name,
      type,
      description,
      ageRange: ageRange || '全年龄段',
      questions: questions || 0,
      completions: 0,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      category: category || type,
      difficulty: difficulty || 'medium',
      estimatedTime: estimatedTime || '10-15分钟'
    }

    mockAssessments.push(newAssessment)

    return NextResponse.json({ assessment: newAssessment }, { status: 201 })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

    const assessmentIndex = mockAssessments.findIndex(assessment => assessment.id === id)
    if (assessmentIndex === -1) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Update assessment
    mockAssessments[assessmentIndex] = {
      ...mockAssessments[assessmentIndex],
      ...updateData,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    return NextResponse.json({ assessment: mockAssessments[assessmentIndex] })
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
