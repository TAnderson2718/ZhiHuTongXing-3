import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { findUserById, updateUserPassword } from '@/lib/users'
import { validatePasswordStrength, isPasswordCompromised } from '@/lib/password-validation'
import { z } from 'zod'

// 密码修改请求验证schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '当前密码不能为空'),
  newPassword: z.string()
    .min(12, '新密码至少需要12个字符')
    .regex(/[a-z]/, '新密码必须包含小写字母')
    .regex(/[A-Z]/, '新密码必须包含大写字母')
    .regex(/\d/, '新密码必须包含数字')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '新密码必须包含特殊符号')
    .refine(password => !/(.)\1{2,}/.test(password), '新密码不能包含连续重复字符')
})



// 安全日志记录
const logSecurityEvent = (event: {
  type: string
  userId: string
  userEmail: string
  details: any
  timestamp: string
  ip?: string
  userAgent?: string
}) => {
  console.log('🔐 Security Event:', JSON.stringify(event, null, 2))
  
  // 在实际应用中，这里应该写入专门的安全日志系统
  // 例如：写入数据库、发送到日志服务等
}



export async function POST(request: NextRequest) {
  try {
    // 获取客户端信息
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 验证管理员权限
    const currentUser = await getSession()
    
    if (!currentUser) {
      logSecurityEvent({
        type: 'UNAUTHORIZED_PASSWORD_CHANGE_ATTEMPT',
        userId: 'unknown',
        userEmail: 'unknown',
        details: { reason: '未登录' },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 检查是否为管理员
    if (currentUser.role !== 'admin') {
      logSecurityEvent({
        type: 'UNAUTHORIZED_PASSWORD_CHANGE_ATTEMPT',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { reason: '权限不足', userRole: currentUser.role },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '权限不足，只有管理员可以修改密码' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()

    // 验证输入数据
    const validationResult = changePasswordSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ')
      
      logSecurityEvent({
        type: 'INVALID_PASSWORD_CHANGE_REQUEST',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { validationErrors: errors },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validationResult.data

    // 查找当前用户
    const user = findUserById(currentUser.id)
    if (!user) {
      logSecurityEvent({
        type: 'USER_NOT_FOUND_PASSWORD_CHANGE',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { reason: '用户不存在' },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 验证当前密码
    if (user.password !== currentPassword) {
      logSecurityEvent({
        type: 'INCORRECT_CURRENT_PASSWORD',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { reason: '当前密码错误' },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '当前密码错误' },
        { status: 400 }
      )
    }

    // 检查新密码是否与当前密码相同
    if (currentPassword === newPassword) {
      logSecurityEvent({
        type: 'SAME_PASSWORD_CHANGE_ATTEMPT',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { reason: '新密码与当前密码相同' },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '新密码不能与当前密码相同' },
        { status: 400 }
      )
    }

    // 检查密码是否在泄露数据库中
    if (isPasswordCompromised(newPassword)) {
      logSecurityEvent({
        type: 'COMPROMISED_PASSWORD_REJECTED',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: { reason: '密码已在数据泄露中被发现' },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: '此密码已在数据泄露中被发现，请选择其他密码' },
        { status: 400 }
      )
    }

    // 验证新密码强度
    const passwordStrength = validatePasswordStrength(newPassword)
    if (!passwordStrength.isValid) {
      const failedRequirements = passwordStrength.requirements
        .filter(req => !req.test)
        .map(req => req.message)

      logSecurityEvent({
        type: 'WEAK_PASSWORD_REJECTED',
        userId: currentUser.id,
        userEmail: currentUser.email,
        details: {
          reason: '密码强度不足',
          failedRequirements,
          strength: passwordStrength.strength,
          score: passwordStrength.score,
          level: passwordStrength.level
        },
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent
      })

      return NextResponse.json(
        { success: false, error: `密码强度不足: ${failedRequirements.join(', ')}` },
        { status: 400 }
      )
    }

    // 更新密码
    const updateSuccess = updateUserPassword(currentUser.id, newPassword)
    if (!updateSuccess) {
      return NextResponse.json(
        { success: false, error: '密码更新失败' },
        { status: 500 }
      )
    }

    // 记录成功的密码修改
    logSecurityEvent({
      type: 'PASSWORD_CHANGED_SUCCESSFULLY',
      userId: currentUser.id,
      userEmail: currentUser.email,
      details: { 
        reason: '管理员密码修改成功',
        passwordStrength: passwordStrength.strength
      },
      timestamp: new Date().toISOString(),
      ip: clientIP,
      userAgent
    })

    // 模拟数据库更新延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: '密码修改成功，请重新登录',
      data: {
        userId: currentUser.id,
        changeTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Change password error:', error)
    
    // 记录系统错误
    logSecurityEvent({
      type: 'PASSWORD_CHANGE_SYSTEM_ERROR',
      userId: 'unknown',
      userEmail: 'unknown',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { success: false, error: '密码修改失败，请稍后重试' },
      { status: 500 }
    )
  }
}
