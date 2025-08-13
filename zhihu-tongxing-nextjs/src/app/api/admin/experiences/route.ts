import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock experience content data
const mockExperiences = [
  {
    id: '1',
    title: '日常照护挑战',
    type: 'game',
    description: '通过模拟日常照护场景，提升实际操作技能',
    category: 'daily-care',
    difficulty: 'beginner',
    duration: '15-20分钟',
    completions: 2450,
    rating: 4.8,
    status: 'active',
    lastUpdated: '2025-01-15',
    tags: ['日常护理', '实操技能', '场景模拟'],
    targetAge: '0-3岁',
    learningObjectives: ['掌握基本护理技能', '提升应急处理能力', '增强照护信心']
  },
  {
    id: '2',
    title: '情绪管理大冒险',
    type: 'game',
    description: '帮助儿童学习识别和管理情绪的互动游戏',
    category: 'emotion',
    difficulty: 'intermediate',
    duration: '20-25分钟',
    completions: 1890,
    rating: 4.7,
    status: 'active',
    lastUpdated: '2025-01-12',
    tags: ['情绪管理', '心理健康', '互动游戏'],
    targetAge: '3-8岁',
    learningObjectives: ['识别基本情绪', '学习情绪调节技巧', '培养情商']
  },
  {
    id: '3',
    title: '安全小卫士',
    type: 'game',
    description: '通过游戏学习家庭和户外安全知识',
    category: 'safety',
    difficulty: 'beginner',
    duration: '18-22分钟',
    completions: 3200,
    rating: 4.9,
    status: 'active',
    lastUpdated: '2025-01-10',
    tags: ['安全教育', '风险识别', '自我保护'],
    targetAge: '4-10岁',
    learningObjectives: ['识别安全隐患', '掌握自救技能', '提高安全意识']
  },
  {
    id: '4',
    title: '亲子沟通技巧指南',
    type: 'tutorial',
    description: '系统学习有效的亲子沟通方法和技巧',
    category: 'communication',
    difficulty: 'intermediate',
    duration: '25-30分钟',
    completions: 1560,
    rating: 4.6,
    status: 'active',
    lastUpdated: '2025-01-08',
    tags: ['亲子沟通', '教育技巧', '关系建立'],
    targetAge: '全年龄段',
    learningObjectives: ['掌握沟通技巧', '改善亲子关系', '提升教育效果']
  },
  {
    id: '5',
    title: '儿童营养搭配实践',
    type: 'tutorial',
    description: '学习科学的儿童营养搭配和饮食安排',
    category: 'nutrition',
    difficulty: 'advanced',
    duration: '30-35分钟',
    completions: 980,
    rating: 4.5,
    status: 'draft',
    lastUpdated: '2025-01-05',
    tags: ['营养健康', '饮食搭配', '成长发育'],
    targetAge: '0-12岁',
    learningObjectives: ['了解营养需求', '掌握搭配原则', '制定饮食计划']
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
    const category = searchParams.get('category') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const status = searchParams.get('status') || ''

    // 构建数据库查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (status === 'active') {
      where.status = 'published'
    } else if (status === 'draft') {
      where.status = 'draft'
    }

    // 获取总数
    const total = await prisma.experience.count({ where })

    // 获取分页数据
    const experiences = await prisma.experience.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
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
      type: experience.type,
      description: experience.description,
      category: experience.category,
      difficulty: experience.difficulty,
      duration: experience.duration,
      completions: experience.completions,
      rating: experience.rating,
      status: experience.status === 'published' ? 'active' : 'draft',
      lastUpdated: experience.updatedAt.toISOString().split('T')[0],
      tags: Array.isArray(experience.tags) ? experience.tags : [],
      targetAge: experience.targetAge || '全年龄段',
      learningObjectives: Array.isArray(experience.learningObjectives) ? experience.learningObjectives : []
    }))

    return NextResponse.json({
      experiences: formattedExperiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
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
    const { 
      title, 
      type, 
      description, 
      category, 
      difficulty, 
      duration, 
      tags, 
      targetAge, 
      learningObjectives 
    } = body

    // Validate required fields
    if (!title || !type || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new experience
    const newExperience = {
      id: (mockExperiences.length + 1).toString(),
      title,
      type,
      description,
      category,
      difficulty: difficulty || 'beginner',
      duration: duration || '15-20分钟',
      completions: 0,
      rating: 0,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: tags || [],
      targetAge: targetAge || '全年龄段',
      learningObjectives: learningObjectives || []
    }

    mockExperiences.push(newExperience)

    return NextResponse.json({ experience: newExperience }, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
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
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 })
    }

    const experienceIndex = mockExperiences.findIndex(experience => experience.id === id)
    if (experienceIndex === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Update experience
    mockExperiences[experienceIndex] = {
      ...mockExperiences[experienceIndex],
      ...updateData,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    return NextResponse.json({ experience: mockExperiences[experienceIndex] })
  } catch (error) {
    console.error('Error updating experience:', error)
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
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 })
    }

    const experienceIndex = mockExperiences.findIndex(experience => experience.id === id)
    if (experienceIndex === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Remove experience
    const deletedExperience = mockExperiences.splice(experienceIndex, 1)[0]

    return NextResponse.json({ message: 'Experience deleted successfully', experience: deletedExperience })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
