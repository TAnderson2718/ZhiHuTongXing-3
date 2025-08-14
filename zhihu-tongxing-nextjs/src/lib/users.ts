// 共享用户数据管理模块
// 使用 Prisma 连接 PostgreSQL 数据库

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface User {
  id: string
  email: string
  password: string // 存储哈希后的密码
  name: string
  image: string | null
  role?: 'user' | 'admin'
  phone?: string | undefined
  bio?: string | undefined
  birthDate?: string | undefined
  createdAt?: Date | string | undefined
}

// 使用 PostgreSQL 数据库代替 mock 数据
// 所有用户数据现在存储在数据库中

// 获取所有用户
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany()
  return users.map(user => ({
    ...user,
    role: 'user' as 'user' | 'admin' // 默认角色，实际应用中可以从数据库读取
  }))
}

// 根据ID查找用户
export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id }
  })
  if (!user) return null
  return {
    ...user,
    role: user.email === 'admin@zhihutongxing.com' ? 'admin' : 'user' // 根据邮箱判断管理员角色
  }
}

// 根据邮箱查找用户
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) return null
  return {
    ...user,
    role: email === 'admin@zhihutongxing.com' ? 'admin' : 'user' // 管理员邮箱检查
  }
}

// 根据邮箱和密码查找用户（使用bcrypt验证）
export async function findUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) {
    return null
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }
  
  return {
    ...user,
    role: email === 'admin@zhihutongxing.com' ? 'admin' : 'user' // 管理员邮箱检查
  }
}

// 创建新用户（密码自动哈希）
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      image: userData.image
      // 注意：phone, bio, birthDate 等字段在当前 schema 中不存在
    }
  })

  return {
    ...newUser,
    role: userData.email === 'admin@zhihutongxing.com' ? 'admin' : 'user',
    phone: userData.phone, // 保持接口兼容性，但不存储到数据库
    bio: userData.bio,
    birthDate: userData.birthDate
  }
}

// 更新用户信息
export async function updateUser(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(updates.email && { email: updates.email }),
        ...(updates.password && { password: updates.password }),
        ...(updates.name && { name: updates.name }),
        ...(updates.image !== undefined && { image: updates.image })
        // 注意：phone, bio, birthDate 等字段在当前 schema 中不存在
      }
    })

    return {
      ...updatedUser,
      role: updatedUser.email === 'admin@zhihutongxing.com' ? 'admin' : 'user',
      phone: updates.phone, // 保持接口兼容性
      bio: updates.bio,
      birthDate: updates.birthDate
    }
  } catch (error) {
    return null
  }
}

// 更新用户密码（自动哈希）
export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })
    return true
  } catch (error) {
    return false
  }
}

// 删除用户
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id }
    })
    return true
  } catch (error) {
    return false
  }
}

// 检查邮箱是否已存在
export async function isEmailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  return user !== null
}

// 获取用户统计信息
export async function getUserStats() {
  const totalUsers = await prisma.user.count()
  const adminUsers = await prisma.user.count({
    where: { email: 'admin@zhihutongxing.com' }
  })
  const regularUsers = totalUsers - adminUsers
  
  return {
    total: totalUsers,
    admins: adminUsers,
    users: regularUsers
  }
}
