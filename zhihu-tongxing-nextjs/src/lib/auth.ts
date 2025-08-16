import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionUser } from '@/types'
import CryptoJS from 'crypto-js'
import { findUserById, findUserByEmailAndPassword, createUser, isEmailExists } from './users'

export const SESSION_COOKIE_NAME = 'session'
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required')
}
const REFRESH_THRESHOLD = 24 * 60 * 60 * 1000 // 24 hours - refresh session if less than this time remaining



// 生成加密安全的随机会话令牌
function generateSessionToken(): string {
  // 生成32字节的随机数据
  const randomBytes = CryptoJS.lib.WordArray.random(32)
  return randomBytes.toString(CryptoJS.enc.Hex)
}

// 创建会话数据结构
interface SessionData {
  userId: string
  createdAt: number
  expiresAt: number
  refreshToken: string
}

// 加密会话数据
function encryptSessionData(data: SessionData): string {
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, SESSION_SECRET!).toString()
  return encrypted
}

// 解密会话数据
function decryptSessionData(encryptedData: string): SessionData | null {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SESSION_SECRET!)
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8)

    if (!jsonString) {
      return null
    }

    return JSON.parse(jsonString) as SessionData
  } catch (error) {
    console.error('Failed to decrypt session data:', error)
    return null
  }
}

// 创建会话
export async function createSession(userId: string): Promise<string> {
  const user = findUserById(userId)
  if (!user) {
    throw new Error('用户不存在')
  }

  const now = Date.now()
  const sessionData: SessionData = {
    userId,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
    refreshToken: generateSessionToken()
  }

  return encryptSessionData(sessionData)
}

// 设置会话Cookie
export function setSessionCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 生产环境强制HTTPS
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

// 刷新会话（延长过期时间）
async function refreshSession(sessionData: SessionData): Promise<string> {
  const now = Date.now()
  const refreshedData: SessionData = {
    ...sessionData,
    expiresAt: now + SESSION_DURATION,
    refreshToken: generateSessionToken() // 生成新的刷新令牌
  }

  return encryptSessionData(refreshedData)
}

// 获取当前会话
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  // 解密会话数据
  const sessionData = decryptSessionData(sessionToken)
  if (!sessionData) {
    return null
  }

  const now = Date.now()

  // 检查会话是否过期
  if (now > sessionData.expiresAt) {
    return null
  }

  // 查找用户 - 修复：添加 await 关键字
  const user = await findUserById(sessionData.userId)
  if (!user) {
    return null
  }

  // 如果会话即将过期（剩余时间少于阈值），自动刷新
  const timeUntilExpiry = sessionData.expiresAt - now
  if (timeUntilExpiry < REFRESH_THRESHOLD) {
    try {
      const refreshedToken = await refreshSession(sessionData)
      setSessionCookie(refreshedToken)
    } catch (error) {
      console.error('Failed to refresh session:', error)
      // 即使刷新失败，仍然返回当前用户（如果会话尚未过期）
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}

// 获取会话 (用于 Route Handlers)
export async function getSessionFromRequest(request: Request): Promise<SessionUser | null> {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    return null
  }

  // 解析 cookies
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      // URL decode the cookie value
      acc[name] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)

  const sessionToken = cookies[SESSION_COOKIE_NAME]
  if (!sessionToken) {
    return null
  }

  // 解密会话数据
  const sessionData = decryptSessionData(sessionToken)
  if (!sessionData) {
    return null
  }

  const now = Date.now()

  // 检查会话是否过期
  if (now > sessionData.expiresAt) {
    return null
  }

  // 查找用户
  const user = await findUserById(sessionData.userId)
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}

// 删除会话
export async function deleteSession() {
  const cookieStore = cookies()
  // 删除 cookie
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// 用户登录
export async function login(email: string, password: string): Promise<SessionUser | null> {
  // 查找用户
  const user = await findUserByEmailAndPassword(email, password)

  if (!user) {
    return null
  }

  const token = await createSession(user.id)
  setSessionCookie(token)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}

// 用户注册
export async function register(email: string, password: string, name: string): Promise<SessionUser | null> {
  // 检查用户是否已存在
  if (await isEmailExists(email)) {
    return null
  }

  // 创建新用户
  const newUser = await createUser({
    email,
    password,
    name,
    image: null,
    role: 'user',
  })

  const token = await createSession(newUser.id)
  setSessionCookie(token)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    image: newUser.image,
    role: newUser.role,
  }
}

// 用户登出
export async function logout() {
  await deleteSession()
  redirect('/login')
}

// 要求认证的中间件
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) {
    redirect('/login')
  }
  return user
}

// 清理过期会话（可以在定时任务中调用）
export async function cleanupExpiredSessions() {
  // 在模拟环境中，这个函数不需要做任何事情
  // 因为我们使用的是基于时间戳的简单会话验证
}

// 验证管理员权限
export async function verifyAdminAuth(request: Request) {
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
