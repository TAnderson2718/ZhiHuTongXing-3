import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const available = searchParams.get('available')

    // 构建查询条件
    const where: any = {}
    
    if (specialty) {
      where.specialties = {
        has: specialty
      }
    }

    if (available === 'true') {
      where.isAvailable = true
    }

    // 获取专家数据
    const experts = await prisma.expert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            consultations: true
          }
        }
      }
    })

    // 转换数据格式
    const formattedExperts = experts.map(expert => ({
      id: expert.id,
      name: expert.name,
      title: expert.title,
      experience: expert.experience,
      specialties: Array.isArray(expert.specialties) ? expert.specialties : [],
      rating: expert.rating,
      consultations: expert._count.consultations,
      isAvailable: expert.isAvailable,
      bio: expert.bio,
      avatar: expert.avatar || '/images/default-expert.png'
    }))

    return NextResponse.json({
      success: true,
      data: formattedExperts
    })
  } catch (error) {
    console.error('Get experts error:', error)
    return NextResponse.json(
      { success: false, error: '获取专家列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      title, 
      experience, 
      specialties, 
      bio, 
      avatar,
      rating = 5.0,
      isAvailable = true 
    } = body

    // 验证必填字段
    if (!name || !title || !experience) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    const expert = await prisma.expert.create({
      data: {
        name,
        title,
        experience,
        specialties: Array.isArray(specialties) ? specialties : [],
        bio: bio || '',
        avatar: avatar || '/images/default-expert.png',
        rating,
        isAvailable
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: expert.id,
        name: expert.name,
        title: expert.title,
        experience: expert.experience,
        specialties: expert.specialties,
        rating: expert.rating,
        isAvailable: expert.isAvailable,
        bio: expert.bio,
        avatar: expert.avatar
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create expert error:', error)
    return NextResponse.json(
      { success: false, error: '创建专家失败' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, specialties, title, isAvailable } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少专家ID' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (specialties) updateData.specialties = specialties
    if (title) updateData.title = title
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable

    const expert = await prisma.expert.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: expert
    })
  } catch (error) {
    console.error('Update expert error:', error)
    return NextResponse.json(
      { success: false, error: '更新专家失败' },
      { status: 500 }
    )
  }
}
