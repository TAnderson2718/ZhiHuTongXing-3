import { NextRequest, NextResponse } from 'next/server'

// Mock support data
const mockConsultations = [
  {
    id: '1',
    type: 'online',
    user: '张女士',
    expert: '李心理师',
    topic: '儿童分离焦虑问题',
    status: 'ongoing',
    priority: 'high',
    createdAt: '2025-01-15 14:30',
    duration: '45分钟',
    category: 'psychology',
    notes: '3岁儿童入园适应问题，需要专业指导'
  },
  {
    id: '2',
    type: 'appointment',
    user: '王先生',
    expert: '陈教育师',
    topic: '青春期叛逆行为管理',
    status: 'scheduled',
    priority: 'medium',
    createdAt: '2025-01-14 10:15',
    duration: '60分钟',
    category: 'education',
    notes: '14岁孩子行为问题，家长需要教育策略'
  },
  {
    id: '3',
    type: 'email',
    user: '刘女士',
    expert: '赵营养师',
    topic: '婴儿辅食添加指导',
    status: 'completed',
    priority: 'low',
    createdAt: '2025-01-13 16:45',
    duration: '30分钟',
    category: 'nutrition',
    notes: '6个月婴儿辅食添加时间表和注意事项'
  },
  {
    id: '4',
    type: 'phone',
    user: '孙女士',
    expert: '马医师',
    topic: '儿童发育迟缓咨询',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-01-12 09:20',
    duration: '40分钟',
    category: 'medical',
    notes: '2岁儿童语言发育迟缓，需要专业评估'
  }
]

const mockExperts = [
  {
    id: '1',
    name: '李心理师',
    specialty: '儿童心理',
    status: 'online',
    rating: 4.9,
    experience: '8年',
    consultations: 1250,
    avatar: '/images/experts/expert1.jpg',
    qualifications: ['国家二级心理咨询师', '儿童心理学硕士'],
    workingHours: '9:00-18:00'
  },
  {
    id: '2',
    name: '陈教育师',
    specialty: '家庭教育',
    status: 'busy',
    rating: 4.8,
    experience: '12年',
    consultations: 2100,
    avatar: '/images/experts/expert2.jpg',
    qualifications: ['教育学博士', '家庭教育指导师'],
    workingHours: '8:30-17:30'
  },
  {
    id: '3',
    name: '赵营养师',
    specialty: '儿童营养',
    status: 'offline',
    rating: 4.7,
    experience: '6年',
    consultations: 890,
    avatar: '/images/experts/expert3.jpg',
    qualifications: ['注册营养师', '儿童营养学硕士'],
    workingHours: '10:00-19:00'
  },
  {
    id: '4',
    name: '马医师',
    specialty: '儿科医学',
    status: 'online',
    rating: 4.9,
    experience: '15年',
    consultations: 3200,
    avatar: '/images/experts/expert4.jpg',
    qualifications: ['主治医师', '儿科学博士'],
    workingHours: '8:00-20:00'
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
    const type = searchParams.get('type') || 'consultations' // consultations or experts
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const category = searchParams.get('category') || ''

    if (type === 'experts') {
      let filteredExperts = [...mockExperts]

      // Apply filters for experts
      if (search) {
        filteredExperts = filteredExperts.filter(expert =>
          expert.name.toLowerCase().includes(search.toLowerCase()) ||
          expert.specialty.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredExperts = filteredExperts.filter(expert => expert.status === status)
      }

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedExperts = filteredExperts.slice(startIndex, endIndex)

      return NextResponse.json({
        experts: paginatedExperts,
        pagination: {
          page,
          limit,
          total: filteredExperts.length,
          totalPages: Math.ceil(filteredExperts.length / limit)
        }
      })
    } else {
      let filteredConsultations = [...mockConsultations]

      // Apply filters for consultations
      if (search) {
        filteredConsultations = filteredConsultations.filter(consultation =>
          consultation.user.toLowerCase().includes(search.toLowerCase()) ||
          consultation.expert.toLowerCase().includes(search.toLowerCase()) ||
          consultation.topic.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (status) {
        filteredConsultations = filteredConsultations.filter(consultation => consultation.status === status)
      }

      if (priority) {
        filteredConsultations = filteredConsultations.filter(consultation => consultation.priority === priority)
      }

      if (category) {
        filteredConsultations = filteredConsultations.filter(consultation => consultation.category === category)
      }

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedConsultations = filteredConsultations.slice(startIndex, endIndex)

      return NextResponse.json({
        consultations: paginatedConsultations,
        pagination: {
          page,
          limit,
          total: filteredConsultations.length,
          totalPages: Math.ceil(filteredConsultations.length / limit)
        }
      })
    }
  } catch (error) {
    console.error('Error fetching support data:', error)
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
    const { type, ...data } = body

    if (type === 'consultation') {
      const { user, expert, topic, consultationType, priority, category, notes } = data

      // Validate required fields
      if (!user || !expert || !topic || !consultationType) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Create new consultation
      const newConsultation = {
        id: (mockConsultations.length + 1).toString(),
        type: consultationType,
        user,
        expert,
        topic,
        status: 'pending',
        priority: priority || 'medium',
        createdAt: new Date().toLocaleString('zh-CN'),
        duration: '45分钟',
        category: category || 'general',
        notes: notes || ''
      }

      mockConsultations.push(newConsultation)

      return NextResponse.json({ consultation: newConsultation }, { status: 201 })
    } else if (type === 'expert') {
      const { name, specialty, qualifications, workingHours } = data

      // Validate required fields
      if (!name || !specialty) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Create new expert
      const newExpert = {
        id: (mockExperts.length + 1).toString(),
        name,
        specialty,
        status: 'offline',
        rating: 0,
        experience: '0年',
        consultations: 0,
        avatar: '/images/experts/default.jpg',
        qualifications: qualifications || [],
        workingHours: workingHours || '9:00-18:00'
      }

      mockExperts.push(newExpert)

      return NextResponse.json({ expert: newExpert }, { status: 201 })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error creating support data:', error)
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
    const { type, id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (type === 'consultation') {
      const consultationIndex = mockConsultations.findIndex(consultation => consultation.id === id)
      if (consultationIndex === -1) {
        return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
      }

      // Update consultation
      mockConsultations[consultationIndex] = {
        ...mockConsultations[consultationIndex],
        ...updateData
      }

      return NextResponse.json({ consultation: mockConsultations[consultationIndex] })
    } else if (type === 'expert') {
      const expertIndex = mockExperts.findIndex(expert => expert.id === id)
      if (expertIndex === -1) {
        return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
      }

      // Update expert
      mockExperts[expertIndex] = {
        ...mockExperts[expertIndex],
        ...updateData
      }

      return NextResponse.json({ expert: mockExperts[expertIndex] })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating support data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
