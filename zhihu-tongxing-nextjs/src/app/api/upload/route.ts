import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { validateFileUpload } from '@/lib/validation'
import { upload as uploadConfig } from '@/config/app'

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest) {
  try {
    const { getSession } = await import('@/lib/auth')
    const user = await getSession()

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

// 文件安全检查
function performSecurityCheck(file: File): { safe: boolean; reason?: string } {
  // 检查文件名是否包含危险字符
  const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/
  if (dangerousChars.test(file.name)) {
    return { safe: false, reason: '文件名包含非法字符' }
  }

  // 检查文件扩展名是否在允许列表中
  const extension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', // 图片
    'mp4', 'webm', 'ogg', // 视频
    'pdf', 'doc', 'docx' // 文档
  ]

  if (!extension || !allowedExtensions.includes(extension)) {
    return { safe: false, reason: '不支持的文件扩展名' }
  }

  // 检查文件大小
  if (file.size > uploadConfig.maxFileSize) {
    return { safe: false, reason: '文件大小超出限制' }
  }

  return { safe: true }
}

// 生成安全的文件名
function generateSafeFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase()
  return `${timestamp}_${randomStr}.${extension}`
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const type = formData.get('type') as string // 'image' | 'video' | 'document'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要上传的文件' },
        { status: 400 }
      )
    }

    // 验证文件类型配置
    const allowedTypes = uploadConfig.allowedTypes[type as keyof typeof uploadConfig.allowedTypes]
    if (!allowedTypes) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型分类' },
        { status: 400 }
      )
    }

    const uploadResults = []
    const errors = []

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', type)
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      try {
        // 安全检查
        const securityCheck = performSecurityCheck(file)
        if (!securityCheck.safe) {
          errors.push(`${file.name}: ${securityCheck.reason}`)
          continue
        }

        // 验证文件
        const validation = validateFileUpload(file, {
          maxSize: uploadConfig.maxFileSize,
          allowedTypes: allowedTypes,
        })

        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.errors.join(', ')}`)
          continue
        }

        // 生成安全文件名
        const filename = generateSafeFilename(file.name)
        const filepath = join(uploadDir, filename)

        // 保存文件
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // 记录成功上传的文件
        uploadResults.push({
          url: `/uploads/${type}/${filename}`,
          filename: filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
        })

      } catch (error) {
        console.error(`上传文件 ${file.name} 失败:`, error)
        errors.push(`${file.name}: 上传失败`)
      }
    }

    // 返回结果
    if (uploadResults.length === 0) {
      return NextResponse.json(
        { success: false, error: '所有文件上传失败', details: errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: uploadResults,
      errors: errors.length > 0 ? errors : undefined,
      message: `成功上传 ${uploadResults.length} 个文件${errors.length > 0 ? `，${errors.length} 个文件失败` : ''}`
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    )
  }
}

// 获取上传的文件列表
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'image'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads', type)

      // 确保目录存在
      await mkdir(uploadDir, { recursive: true })

      // 读取文件列表
      const files = await readdir(uploadDir)
      const fileDetails = []

      for (const filename of files) {
        try {
          const filepath = join(uploadDir, filename)
          const stats = await stat(filepath)

          if (stats.isFile()) {
            fileDetails.push({
              filename,
              url: `/uploads/${type}/${filename}`,
              size: stats.size,
              createdAt: stats.birthtime,
              modifiedAt: stats.mtime,
            })
          }
        } catch (error) {
          console.error(`获取文件 ${filename} 信息失败:`, error)
        }
      }

      // 按创建时间倒序排列
      fileDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // 分页
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedFiles = fileDetails.slice(startIndex, endIndex)

      return NextResponse.json({
        success: true,
        data: {
          files: paginatedFiles,
          pagination: {
            page,
            limit,
            total: fileDetails.length,
            totalPages: Math.ceil(fileDetails.length / limit)
          }
        },
        message: '获取文件列表成功'
      })

    } catch (error) {
      console.error('读取文件目录失败:', error)
      return NextResponse.json({
        success: true,
        data: {
          files: [],
          pagination: { page: 1, limit, total: 0, totalPages: 0 }
        },
        message: '文件目录不存在或为空'
      })
    }

  } catch (error) {
    console.error('获取文件列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取文件列表失败' },
      { status: 500 }
    )
  }
}

// 删除文件
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const type = searchParams.get('type')

    if (!filename || !type) {
      return NextResponse.json(
        { success: false, error: '缺少文件名或类型参数' },
        { status: 400 }
      )
    }

    // 安全检查：确保文件名不包含路径遍历字符
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { success: false, error: '非法的文件名' },
        { status: 400 }
      )
    }

    const filepath = join(process.cwd(), 'public', 'uploads', type, filename)

    try {
      await unlink(filepath)
      return NextResponse.json({
        success: true,
        message: '文件删除成功'
      })
    } catch (error) {
      console.error('删除文件失败:', error)
      return NextResponse.json(
        { success: false, error: '文件不存在或删除失败' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('删除文件失败:', error)
    return NextResponse.json(
      { success: false, error: '删除文件失败' },
      { status: 500 }
    )
  }
}
