import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/auth'

// Support management API for consultations and experts

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
      // 构建查询条件
      const where: any = {}

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { specialty: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (status) {
        where.status = status
      }

      // 获取专家总数
      const total = await prisma.expert.count({ where })

      // 获取分页专家
      const experts = await prisma.expert.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        experts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } else {
      // 构建咨询查询条件
      const where: any = {}

      if (search) {
        where.OR = [
          { topic: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (status) {
        where.status = status
      }

      if (priority) {
        where.priority = priority
      }

      if (category) {
        where.category = category
      }

      // 获取咨询总数
      const total = await prisma.consultation.count({ where })

      // 获取分页咨询，包含用户和专家信息
      const consultations = await prisma.consultation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          expert: {
            select: { id: true, name: true, specialty: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // 转换数据格式以匹配前端期望
      const formattedConsultations = consultations.map(consultation => ({
        id: consultation.id,
        type: consultation.type,
        user: consultation.user?.name || '未知用户',
        expert: consultation.expert?.name || '未分配专家',
        topic: consultation.topic,
        status: consultation.status,
        priority: consultation.priority,
        createdAt: consultation.createdAt.toISOString(),
        duration: consultation.duration,
        category: consultation.category,
        notes: consultation.notes
      }))

      return NextResponse.json({
        consultations: formattedConsultations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { type, ...data } = body

    if (type === 'consultation') {
      const { userId, expertId, topic, consultationType, priority, category, notes, description } = data

      // Validate required fields
      if (!userId || !expertId || !topic || !consultationType) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Create new consultation
      const newConsultation = await prisma.consultation.create({
        data: {
          userId,
          expertId,
          type: consultationType,
          topic,
          description,
          status: 'pending',
          priority: priority || 'medium',
          category: category || 'general',
          notes: notes || '',
          duration: '45分钟'
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          expert: {
            select: { id: true, name: true, specialty: true }
          }
        }
      })

      return NextResponse.json({ consultation: newConsultation }, { status: 201 })
    } else if (type === 'expert') {
      const { name, specialty, qualifications, workingHours, bio, experience } = data

      // Validate required fields
      if (!name || !specialty) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Create new expert
      const newExpert = await prisma.expert.create({
        data: {
          name,
          specialty,
          qualifications: qualifications || [],
          workingHours: workingHours || '9:00-18:00',
          bio: bio || '',
          experience: experience || '0年',
          status: 'offline',
          rating: 0
        }
      })

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
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { type, id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (type === 'consultation') {
      // Update consultation
      const updatedConsultation = await prisma.consultation.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          expert: {
            select: { id: true, name: true, specialty: true }
          }
        }
      })

      return NextResponse.json({ consultation: updatedConsultation })
    } else if (type === 'expert') {
      // Update expert
      const updatedExpert = await prisma.expert.update({
        where: { id },
        data: updateData
      })

      return NextResponse.json({ expert: updatedExpert })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating support data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
