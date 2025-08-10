import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

// 设置文件路径
const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json')

// 默认设置
const defaultSettings = {
  siteName: '智护童行',
  siteDescription: '专业的家庭教育与儿童照护平台，为每个家庭提供科学、专业的育儿指导和支持服务。',
  contactEmail: 'support@zhihutongxing.com',
  supportPhone: '400-123-4567',
  address: '北京市朝阳区智护大厦',
  enableRegistration: true,
  maxFileUploadSize: 10,
  sessionTimeout: 30,
  passwordMinLength: 6,
  maintenanceMode: false,
  analyticsEnabled: true,
  logRetentionDays: 30
}

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

// 读取设置
function loadSettings() {
  try {
    // 确保data目录存在
    const dataDir = path.dirname(settingsFilePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // 如果设置文件不存在，创建默认设置
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2))
      return defaultSettings
    }

    const data = fs.readFileSync(settingsFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

// 保存设置
function saveSettings(settings: any) {
  try {
    // 确保data目录存在
    const dataDir = path.dirname(settingsFilePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

// GET - 获取系统设置
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

    const settings = loadSettings()

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新系统设置
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
    
    // 验证必填字段
    if (!body.siteName || !body.contactEmail) {
      return NextResponse.json(
        { success: false, error: '网站名称和联系邮箱为必填字段' },
        { status: 400 }
      )
    }

    // 合并现有设置和新设置
    const currentSettings = loadSettings()
    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: new Date().toISOString()
    }

    // 保存设置
    const saved = saveSettings(updatedSettings)
    if (!saved) {
      return NextResponse.json(
        { success: false, error: '保存设置失败' },
        { status: 500 }
      )
    }

    // 记录操作日志
    try {
      await fetch(new URL('/api/admin/operation-logs', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: JSON.stringify({
          operationType: 'SETTINGS_UPDATE',
          operationDescription: '更新系统设置',
          targetResource: 'system-settings',
          result: 'SUCCESS',
          metadata: {
            updatedFields: Object.keys(body)
          }
        })
      })
    } catch (logError) {
      console.error('Failed to log operation:', logError)
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: '设置保存成功'
    })
  } catch (error) {
    console.error('Update settings error:', error)
    
    // 记录失败日志
    try {
      await fetch(new URL('/api/admin/operation-logs', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: JSON.stringify({
          operationType: 'SETTINGS_UPDATE',
          operationDescription: '更新系统设置失败',
          targetResource: 'system-settings',
          result: 'FAILURE',
          errorMessage: error instanceof Error ? error.message : '未知错误'
        })
      })
    } catch (logError) {
      console.error('Failed to log operation:', logError)
    }

    return NextResponse.json(
      { success: false, error: '更新设置失败' },
      { status: 500 }
    )
  }
}
