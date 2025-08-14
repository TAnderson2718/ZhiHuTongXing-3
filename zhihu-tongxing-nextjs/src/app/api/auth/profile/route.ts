import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 模拟用户数据存储
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: '测试用户',
    avatar: null,
    phone: '13800138000',
    bio: '这是一个测试用户的个人简介。',
    birthDate: '1990-01-01',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    email: 'admin@zhihutongxing.com',
    password: 'Admin@2025!Secure#',
    name: '管理员',
    avatar: null,
    phone: '13900139000',
    bio: '智护童行平台管理员。',
    birthDate: '1985-05-15',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

// 验证更新数据的 schema
const updateProfileSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(50, '姓名不能超过50个字符'),
  phone: z.string().optional(),
  bio: z.string().max(500, '个人简介不能超过500个字符').optional(),
  birthDate: z.string().optional(),
})

// 获取用户资料
export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 从 session token 中提取用户 ID（简单实现）
    const userId = sessionToken.split('-')[0]
    
    // 查找用户
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 返回用户信息（不包含密码）
    const { password, ...userProfile } = user
    
    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 从 session token 中提取用户 ID
    const userId = sessionToken.split('-')[0]
    
    // 查找用户
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 解析请求体
    const body = await request.json()
    
    // 验证数据
    const validationResult = updateProfileSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: '数据验证失败',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { name, phone, bio, birthDate } = validationResult.data

    // 更新用户信息到数据库
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(bio && { bio }),
        ...(birthDate && { birthDate }),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        birthDate: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
