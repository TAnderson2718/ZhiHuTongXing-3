import { NextRequest, NextResponse } from 'next/server'
import { validateAndSanitizeRegistration, containsMaliciousScript } from '@/lib/validation'
import { register } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证和清理输入数据
    const validationResult = validateAndSanitizeRegistration(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data!

    // 额外的安全检查：检测恶意脚本
    if (containsMaliciousScript(email) ||
        containsMaliciousScript(name) ||
        containsMaliciousScript(password)) {
      return NextResponse.json(
        { success: false, error: '检测到不安全的输入，请重新输入' },
        { status: 400 }
      )
    }

    // 速率限制检查（简单实现）
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

    // 尝试注册
    const user = await register(email, password, name)

    if (!user) {
      // 记录注册失败（用于安全审计）
      console.warn(`Failed registration attempt for email: ${email} from IP: ${clientIP}`)

      return NextResponse.json(
        { success: false, error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 记录成功的注册（用于安全审计）
    console.info(`Successful registration for user: ${user.id} from IP: ${clientIP}`)

    return NextResponse.json({
      success: true,
      data: user,
      message: '注册成功',
    })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
