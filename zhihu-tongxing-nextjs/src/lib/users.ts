// 共享用户数据管理模块
// 在实际应用中，这应该是数据库操作

export interface User {
  id: string
  email: string
  password: string
  name: string
  avatar: string | null
  role: 'user' | 'admin'
  phone?: string
  bio?: string
  birthDate?: string
  createdAt?: string
}

// 模拟用户数据存储
let mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: '123456',
    name: '测试用户',
    avatar: null,
    role: 'user',
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
    role: 'admin',
    phone: '13900139000',
    bio: '智护童行平台管理员。',
    birthDate: '1985-05-15',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

// 获取所有用户
export function getAllUsers(): User[] {
  return [...mockUsers]
}

// 根据ID查找用户
export function findUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id)
}

// 根据邮箱查找用户
export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find(user => user.email === email)
}

// 根据邮箱和密码查找用户
export function findUserByEmailAndPassword(email: string, password: string): User | undefined {
  return mockUsers.find(user => user.email === email && user.password === password)
}

// 创建新用户
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: (mockUsers.length + 1).toString(),
    createdAt: new Date().toISOString(),
  }
  
  mockUsers.push(newUser)
  return newUser
}

// 更新用户信息
export function updateUser(id: string, updates: Partial<Omit<User, 'id'>>): User | null {
  const userIndex = mockUsers.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return null
  }
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates
  }
  
  return mockUsers[userIndex]
}

// 更新用户密码
export function updateUserPassword(id: string, newPassword: string): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return false
  }
  
  mockUsers[userIndex].password = newPassword
  return true
}

// 删除用户
export function deleteUser(id: string): boolean {
  const userIndex = mockUsers.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return false
  }
  
  mockUsers.splice(userIndex, 1)
  return true
}

// 检查邮箱是否已存在
export function isEmailExists(email: string): boolean {
  return mockUsers.some(user => user.email === email)
}

// 获取用户统计信息
export function getUserStats() {
  const totalUsers = mockUsers.length
  const adminUsers = mockUsers.filter(user => user.role === 'admin').length
  const regularUsers = mockUsers.filter(user => user.role === 'user').length
  
  return {
    total: totalUsers,
    admins: adminUsers,
    users: regularUsers
  }
}
