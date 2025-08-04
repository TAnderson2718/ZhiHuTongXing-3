import { NextRequest, NextResponse } from 'next/server'

// Mock training courses data
const mockTrainingCourses = [
  {
    id: '1',
    title: '0-3岁婴幼儿发展与教育',
    type: 'course',
    category: 'early-childhood',
    instructor: '李教授',
    duration: '8周',
    lessons: 24,
    enrolled: 450,
    rating: 4.8,
    price: 299,
    status: 'active',
    level: 'beginner',
    description: '全面了解0-3岁婴幼儿的身心发展特点，掌握科学的教育方法',
    lastUpdated: '2025-01-15',
    tags: ['婴幼儿', '发展心理学', '早期教育'],
    learningObjectives: ['了解婴幼儿发展规律', '掌握教育方法', '提升照护技能'],
    prerequisites: '无特殊要求',
    certificate: true
  },
  {
    id: '2',
    title: '专家讲座：儿童心理健康',
    type: 'lecture',
    category: 'psychology',
    instructor: '王心理师',
    duration: '2小时',
    lessons: 1,
    enrolled: 280,
    rating: 4.9,
    price: 99,
    status: 'active',
    level: 'intermediate',
    description: '深入探讨儿童心理健康问题的识别、预防和干预策略',
    lastUpdated: '2025-01-12',
    tags: ['心理健康', '专家讲座', '心理干预'],
    learningObjectives: ['识别心理问题', '掌握干预方法', '促进心理健康'],
    prerequisites: '基础心理学知识',
    certificate: false
  },
  {
    id: '3',
    title: '亲子沟通实践指导',
    type: 'practical',
    category: 'communication',
    instructor: '张老师',
    duration: '4周',
    lessons: 12,
    enrolled: 620,
    rating: 4.7,
    price: 199,
    status: 'active',
    level: 'beginner',
    description: '通过实际案例和角色扮演，提升亲子沟通技巧',
    lastUpdated: '2025-01-10',
    tags: ['亲子沟通', '实践指导', '案例分析'],
    learningObjectives: ['改善沟通方式', '增进亲子关系', '解决沟通障碍'],
    prerequisites: '无特殊要求',
    certificate: true
  },
  {
    id: '4',
    title: '家庭教育指导师认证培训',
    type: 'certification',
    category: 'education',
    instructor: '陈专家',
    duration: '12周',
    lessons: 36,
    enrolled: 180,
    rating: 4.9,
    price: 899,
    status: 'active',
    level: 'advanced',
    description: '系统学习家庭教育理论与实践，获得专业认证资格',
    lastUpdated: '2025-01-08',
    tags: ['认证培训', '家庭教育', '专业资格'],
    learningObjectives: ['掌握教育理论', '获得专业认证', '提升指导能力'],
    prerequisites: '相关工作经验或教育背景',
    certificate: true
  },
  {
    id: '5',
    title: '儿童营养与健康管理',
    type: 'course',
    category: 'health',
    instructor: '刘营养师',
    duration: '6周',
    lessons: 18,
    enrolled: 320,
    rating: 4.6,
    price: 249,
    status: 'draft',
    level: 'intermediate',
    description: '学习儿童营养需求、膳食搭配和健康管理方法',
    lastUpdated: '2025-01-05',
    tags: ['儿童营养', '健康管理', '膳食搭配'],
    learningObjectives: ['了解营养需求', '制定膳食计划', '管理儿童健康'],
    prerequisites: '基础营养学知识',
    certificate: true
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
    const level = searchParams.get('level') || ''
    const status = searchParams.get('status') || ''

    let filteredCourses = [...mockTrainingCourses]

    // Apply filters
    if (search) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (type) {
      filteredCourses = filteredCourses.filter(course => course.type === type)
    }

    if (category) {
      filteredCourses = filteredCourses.filter(course => course.category === category)
    }

    if (level) {
      filteredCourses = filteredCourses.filter(course => course.level === level)
    }

    if (status) {
      filteredCourses = filteredCourses.filter(course => course.status === status)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

    return NextResponse.json({
      courses: paginatedCourses,
      pagination: {
        page,
        limit,
        total: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching training courses:', error)
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
      category, 
      instructor, 
      duration, 
      lessons, 
      price, 
      level, 
      description, 
      tags, 
      learningObjectives, 
      prerequisites, 
      certificate 
    } = body

    // Validate required fields
    if (!title || !type || !category || !instructor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new course
    const newCourse = {
      id: (mockTrainingCourses.length + 1).toString(),
      title,
      type,
      category,
      instructor,
      duration: duration || '4周',
      lessons: lessons || 12,
      enrolled: 0,
      rating: 0,
      price: price || 199,
      status: 'draft',
      level: level || 'beginner',
      description: description || '',
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: tags || [],
      learningObjectives: learningObjectives || [],
      prerequisites: prerequisites || '无特殊要求',
      certificate: certificate || false
    }

    mockTrainingCourses.push(newCourse)

    return NextResponse.json({ course: newCourse }, { status: 201 })
  } catch (error) {
    console.error('Error creating training course:', error)
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
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const courseIndex = mockTrainingCourses.findIndex(course => course.id === id)
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Update course
    mockTrainingCourses[courseIndex] = {
      ...mockTrainingCourses[courseIndex],
      ...updateData,
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    return NextResponse.json({ course: mockTrainingCourses[courseIndex] })
  } catch (error) {
    console.error('Error updating training course:', error)
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
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const courseIndex = mockTrainingCourses.findIndex(course => course.id === id)
    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Remove course
    const deletedCourse = mockTrainingCourses.splice(courseIndex, 1)[0]

    return NextResponse.json({ message: 'Course deleted successfully', course: deletedCourse })
  } catch (error) {
    console.error('Error deleting training course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
