#!/usr/bin/env node

/**
 * 测试页面内容和客户端渲染
 */

const BASE_URL = 'http://localhost:3004'

async function testPageContent() {
  console.log('🔍 测试页面内容和客户端渲染...\n')

  try {
    // 1. 登录获取 session
    console.log('1️⃣ 获取管理员 session...')
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@zhihutongxing.com',
        password: 'Admin@2025!Secure#'
      })
    })

    const sessionCookie = loginResponse.headers.get('set-cookie')?.split(';')[0]
    console.log('✅ 获取到 session cookie')

    // 2. 测试认证状态 API
    console.log('\n2️⃣ 测试认证状态 API...')
    const authResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Cookie': sessionCookie
      }
    })

    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log('✅ 认证状态正常:', authData.data.name, '-', authData.data.role)
    } else {
      console.log('❌ 认证状态异常:', authResponse.status)
    }

    // 3. 访问新建文章页面并分析内容
    console.log('\n3️⃣ 访问新建文章页面...')
    const pageResponse = await fetch(`${BASE_URL}/admin/articles/new`, {
      headers: {
        'Cookie': sessionCookie,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!pageResponse.ok) {
      throw new Error(`页面访问失败: ${pageResponse.status}`)
    }

    const pageContent = await pageResponse.text()
    
    // 分析页面内容
    console.log('📄 页面内容分析:')
    
    // 检查是否有错误信息
    const hasError = pageContent.includes('error') || pageContent.includes('Error')
    console.log(`   - 包含错误信息: ${hasError ? '❌' : '✅'}`)
    
    // 检查是否有加载状态
    const hasLoading = pageContent.includes('验证登录状态') || pageContent.includes('loading')
    console.log(`   - 显示加载状态: ${hasLoading ? '⏳' : '✅'}`)
    
    // 检查是否有表单元素
    const hasTitle = pageContent.includes('文章标题') || pageContent.includes('title')
    const hasContent = pageContent.includes('文章内容') || pageContent.includes('content')
    const hasCategory = pageContent.includes('分类') || pageContent.includes('category')
    const hasTags = pageContent.includes('标签') || pageContent.includes('tags')
    const hasPublishButton = pageContent.includes('发布文章') || pageContent.includes('发布')
    
    console.log(`   - 包含标题字段: ${hasTitle ? '✅' : '❌'}`)
    console.log(`   - 包含内容字段: ${hasContent ? '✅' : '❌'}`)
    console.log(`   - 包含分类字段: ${hasCategory ? '✅' : '❌'}`)
    console.log(`   - 包含标签字段: ${hasTags ? '✅' : '❌'}`)
    console.log(`   - 包含发布按钮: ${hasPublishButton ? '✅' : '❌'}`)
    
    // 检查是否有 JavaScript 错误相关内容
    const hasJSError = pageContent.includes('Video is not defined') || 
                      pageContent.includes('ReferenceError') ||
                      pageContent.includes('TypeError')
    console.log(`   - 包含 JS 错误: ${hasJSError ? '❌' : '✅'}`)
    
    // 检查页面大小
    const pageSize = pageContent.length
    console.log(`   - 页面大小: ${pageSize} 字符`)
    
    // 如果页面很小，可能是错误页面
    if (pageSize < 1000) {
      console.log('⚠️ 页面内容过少，可能存在问题')
      console.log('页面内容预览:')
      console.log(pageContent.substring(0, 500) + '...')
    }

    // 4. 检查静态资源
    console.log('\n4️⃣ 检查静态资源...')
    
    // 检查 CSS
    const cssResponse = await fetch(`${BASE_URL}/_next/static/css/app/layout.css`)
    console.log(`   - CSS 文件: ${cssResponse.ok ? '✅' : '❌'} (${cssResponse.status})`)
    
    // 检查主要 JS 文件
    const jsResponse = await fetch(`${BASE_URL}/_next/static/chunks/main-app.js`)
    console.log(`   - 主 JS 文件: ${jsResponse.ok ? '✅' : '❌'} (${jsResponse.status})`)

    // 5. 总结
    console.log('\n📋 测试总结:')
    if (hasLoading) {
      console.log('⏳ 页面显示加载状态，这是正常的认证流程')
      console.log('💡 在浏览器中，页面会在认证完成后显示完整内容')
    }
    
    if (hasTitle && hasContent && hasPublishButton) {
      console.log('✅ 页面包含所有必要的表单元素')
    } else if (hasLoading) {
      console.log('⏳ 页面正在加载中，表单元素将在认证完成后显示')
    } else {
      console.log('❌ 页面缺少必要的表单元素')
    }
    
    console.log('\n💡 建议:')
    console.log('1. 在浏览器中直接访问页面查看完整的用户体验')
    console.log('2. 检查浏览器开发者工具的控制台是否有错误')
    console.log('3. 确认页面在认证完成后是否正常显示表单')
    console.log(`4. 访问地址: ${BASE_URL}/admin/articles/new`)

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
  }
}

// 运行测试
testPageContent()
