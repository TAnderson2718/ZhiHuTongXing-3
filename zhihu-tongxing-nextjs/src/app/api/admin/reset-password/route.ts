import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { logOperation, getClientIP, getUserAgent } from '@/lib/operation-log'
import { OperationType, UserRole, OperationResult } from '@/types/operation-log'

// 生成临时密码的函数
function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
  let password = ''
  
  // 确保包含至少一个大写字母、小写字母、数字和特殊字符
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnpqrstuvwxyz'
  const numbers = '23456789'
  const special = '!@#$%^&*'
  
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // 填充剩余字符
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // 打乱字符顺序
  return password.split('').sort(() => Math.random() - 0.5).join('')
}



export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const currentUser = await getSession()
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 检查是否为管理员
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足，只有管理员可以重置密码' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      )
    }

    // 模拟从数据库获取目标用户信息
    // 在实际应用中，这里应该查询数据库
    const mockUsers = [
      {
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      },
      {
        id: '2',
        name: '管理员',
        email: 'admin@zhihutongxing.com',
        role: 'admin',
        status: 'active'
      },
      {
        id: '3',
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'user',
        status: 'active'
      },
      {
        id: '4',
        name: '李四',
        email: 'lisi@example.com',
        role: 'user',
        status: 'inactive'
      }
    ]

    const targetUser = mockUsers.find(user => user.id === userId)

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 安全检查：不能重置其他管理员的密码（除非是超级管理员）
    if (targetUser.role === 'admin' && currentUser.id !== targetUser.id) {
      // 在实际应用中，可以添加超级管理员的检查
      const isSuperAdmin = currentUser.email === 'admin@zhihutongxing.com' // 简单示例
      
      if (!isSuperAdmin) {
        return NextResponse.json(
          { success: false, error: '不能重置其他管理员的密码' },
          { status: 403 }
        )
      }
    }

    // 生成临时密码
    const temporaryPassword = generateTemporaryPassword()

    // 在实际应用中，这里应该：
    // 1. 将新密码哈希后存储到数据库
    // 2. 设置密码重置标志，要求用户下次登录时修改密码
    // 3. 可选：发送邮件通知用户

    // 记录操作日志
    await logOperation({
      userId: currentUser.id,
      username: currentUser.username,
      userRole: UserRole.ADMIN,
      operationType: OperationType.PASSWORD_RESET,
      operationDescription: `管理员重置用户密码`,
      targetResource: 'user',
      targetResourceId: targetUser.id,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result: OperationResult.SUCCESS,
      metadata: {
        adminEmail: currentUser.email,
        targetUserEmail: targetUser.email,
        targetUserName: targetUser.name
      }
    })

    // 模拟数据库更新延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: {
        temporaryPassword,
        targetUser: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email
        },
        resetTime: new Date().toISOString()
      },
      message: '密码重置成功'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: '重置密码失败，请稍后重试' },
      { status: 500 }
    )
  }
}
