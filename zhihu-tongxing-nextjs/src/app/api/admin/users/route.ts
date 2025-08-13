import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { findUserById, getUserStats } from '@/lib/users'
import { prisma } from '@/lib/prisma'

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
    // 验证管理员权限
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
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role && role !== 'all') {
      // 根据邮箱判断角色
      if (role === 'admin') {
        where.email = 'admin@zhihutongxing.com'
      } else {
        where.email = { not: 'admin@zhihutongxing.com' }
      }
    }

    // 获取用户总数
    const total = await prisma.user.count({ where })

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    // 转换数据格式，添加角色和状态信息
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.email === 'admin@zhihutongxing.com' ? 'admin' : 'user',
      status: 'active', // 默认状态，可以后续扩展
      registeredAt: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.updatedAt.toISOString().split('T')[0],
      assessmentCount: 0, // 可以后续从相关表获取
      articleCount: 0     // 可以后续从相关表获取
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { id, name, email } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.email === 'admin@zhihutongxing.com' ? 'admin' : 'user'
      },
      message: '用户信息更新成功'
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 检查是否是管理员账户
    const user = await prisma.user.findUnique({ where: { id } })
    if (user?.email === 'admin@zhihutongxing.com') {
      return NextResponse.json(
        { success: false, error: '不能删除管理员账户' },
        { status: 403 }
      )
    }

    // 删除用户
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    )
  }
}
