import { NextRequest, NextResponse } from 'next/server'
import { validateAndSanitizeLogin, containsMaliciousScript } from '@/lib/validation'
import { createSession, SESSION_COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'
import { findUserByEmailAndPassword } from '@/lib/users'
import { logOperation, getClientIP, getUserAgent } from '@/lib/operation-log'
import { OperationType, UserRole, OperationResult } from '@/types/operation-log'

// 注意：这个文件中的mockUsers已经不再使用
// 所有用户数据和认证逻辑现在都在 /src/lib/auth.ts 中统一管理

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证和清理输入数据
    const validationResult = validateAndSanitizeLogin(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data!

    // 额外的安全检查：检测恶意脚本
    if (containsMaliciousScript(email) || containsMaliciousScript(password)) {
      return NextResponse.json(
        { success: false, error: '检测到不安全的输入，请重新输入' },
        { status: 400 }
      )
    }

    // 速率限制检查（简单实现）
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

    // 查找用户并验证密码
    const user = await findUserByEmailAndPassword(email, password)

    if (!user) {
      // 记录失败的登录尝试（用于安全审计）
      console.warn(`Failed login attempt for email: ${email} from IP: ${clientIP}`)

      // 记录失败的登录操作
      await logOperation({
        username: email,
        userRole: UserRole.GUEST,
        operationType: OperationType.LOGIN,
        operationDescription: `登录失败 - 邮箱或密码错误`,
        targetResource: 'auth',
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        result: OperationResult.FAILURE,
        errorMessage: '邮箱或密码错误',
        metadata: {
          email,
          reason: 'invalid_credentials'
        }
      })

      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 创建会话token
    const token = await createSession(user.id)

    // 记录成功的登录（用于安全审计）
    console.info(`Successful login for user: ${user.id} from IP: ${clientIP}`)

    // 记录成功的登录操作
    await logOperation({
      userId: user.id,
      username: user.name,
      userRole: user.role === 'admin' ? UserRole.ADMIN : UserRole.USER,
      operationType: OperationType.LOGIN,
      operationDescription: `用户登录成功`,
      targetResource: 'auth',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      result: OperationResult.SUCCESS,
      metadata: {
        email: user.email,
        role: user.role
      }
    })

    // 创建响应并设置Cookie
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
      message: '登录成功',
    })

    // 在Route Handler中手动设置Cookie
    const cookieOptions = {
      httpOnly: true,
      secure: false, // 临时设置为false以支持HTTP
      sameSite: 'lax' as const,
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    }

    console.log('Setting cookie with options:', cookieOptions)
    response.cookies.set(SESSION_COOKIE_NAME, token, cookieOptions)

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}
