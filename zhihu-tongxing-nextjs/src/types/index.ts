import { User, Child, Assessment, GrowthRecord, Article, Post, Comment, Course, CourseProgress } from '@prisma/client'

// 扩展的用户类型
export type UserWithChildren = User & {
  children: Child[]
}

// 扩展的评估类型
export type AssessmentWithUser = Assessment & {
  user: User
  child?: Child | null
}

// 扩展的成长记录类型
export type GrowthRecordWithChild = GrowthRecord & {
  child: Child
}

// 扩展的帖子类型
export type PostWithUserAndComments = Post & {
  user: User
  comments: (Comment & { user: User })[]
}

// 扩展的课程类型
export type CourseWithProgress = Course & {
  progress?: CourseProgress[]
}

// 认证相关类型
export interface SessionUser {
  id: string
  email: string
  name: string
  avatar?: string | null
  role: string
}

// 表单数据类型
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  name: string
}

export interface ChildFormData {
  name: string
  birthday: string
  gender: 'male' | 'female'
  avatar?: string
}

export interface GrowthRecordFormData {
  title: string
  content: string
  date: string
  childId: string
  images?: string[]
}

export interface PostFormData {
  title: string
  content: string
}

// 评估相关类型
export interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  type: 'single' | 'multiple'
}

export interface AssessmentResult {
  score: number
  category: string
  recommendations: string[]
  completedAt: Date
}

// 游戏相关类型
export interface GameChoice {
  id: string
  text: string
  feedback: 'good' | 'ok' | 'bad'
}

export interface GameScenario {
  id: string
  title: string
  description: string
  image: string
  choices: GameChoice[]
  feedbackMessages: {
    good: string
    ok: string
    bad: string
  }
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页类型
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
