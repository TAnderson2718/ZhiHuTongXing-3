import { NextRequest, NextResponse } from 'next/server'
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
  address: '北京市朝阳区智护大厦'
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

// GET - 获取公开的系统设置（不需要管理员权限）
export async function GET(request: NextRequest) {
  try {
    const settings = loadSettings()
    
    // 只返回公开的设置信息
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      supportPhone: settings.supportPhone,
      address: settings.address
    }

    return NextResponse.json({
      success: true,
      data: publicSettings
    })
  } catch (error) {
    console.error('Get public settings error:', error)
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    )
  }
}
