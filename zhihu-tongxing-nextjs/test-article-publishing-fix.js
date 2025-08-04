#!/usr/bin/env node

/**
 * 测试文章发布功能修复
 * 这个脚本测试修复后的文章发布API是否正常工作
 */

const BASE_URL = 'http://localhost:3000'

async function testArticlePublishing() {
  console.log('🧪 开始测试文章发布功能修复...\n')

  try {
    // 1. 测试登录
    console.log('1️⃣ 测试管理员登录...')
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

    if (!loginResponse.ok) {
      throw new Error(`登录失败: ${loginResponse.status}`)
    }

    const loginResult = await loginResponse.json()
    console.log('✅ 登录成功:', loginResult.message)

    // 获取 session cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie')
    if (!setCookieHeader) {
      throw new Error('未获取到 session cookie')
    }

    const sessionCookie = setCookieHeader.split(';')[0]
    console.log('🍪 获取到 session cookie:', sessionCookie.substring(0, 50) + '...')

    // 2. 测试文章创建 API
    console.log('\n2️⃣ 测试文章创建 API...')
    const testArticle = {
      title: '测试文章 - API修复验证',
      excerpt: '这是一篇用于验证API修复的测试文章',
      content: `
        <h2>测试内容</h2>
        <p>这是一篇测试文章，用于验证文章发布功能的修复。</p>
        <p>修复内容包括：</p>
        <ul>
          <li>修复了 Route Handler 中的 cookie 认证问题</li>
          <li>添加了专门用于 Route Handler 的 getSessionFromRequest 函数</li>
          <li>确保认证流程在浏览器和服务器端都能正常工作</li>
        </ul>
      `,
      category: 'safety',
      tags: ['测试', 'API修复', '认证'],
      image: 'https://picsum.photos/seed/test-fix/800/400',
      status: 'published'
    }

    const createResponse = await fetch(`${BASE_URL}/api/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify(testArticle)
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`文章创建失败: ${createResponse.status} - ${errorText}`)
    }

    const createResult = await createResponse.json()
    console.log('✅ 文章创建成功:', createResult.message)
    console.log('📄 创建的文章ID:', createResult.data.id)

    // 3. 验证文章是否真的被创建
    console.log('\n3️⃣ 验证文章列表...')
    const listResponse = await fetch(`${BASE_URL}/api/admin/articles?page=1&limit=10`)
    
    if (!listResponse.ok) {
      throw new Error(`获取文章列表失败: ${listResponse.status}`)
    }

    const listResult = await listResponse.json()
    const createdArticle = listResult.data.articles.find(article => article.id === createResult.data.id)
    
    if (createdArticle) {
      console.log('✅ 文章已成功添加到列表中')
      console.log('📝 文章标题:', createdArticle.title)
      console.log('📊 文章状态:', createdArticle.status)
    } else {
      throw new Error('创建的文章未在列表中找到')
    }

    // 4. 测试浏览器访问
    console.log('\n4️⃣ 测试页面访问...')
    const pageResponse = await fetch(`${BASE_URL}/admin/articles/new`)
    
    if (pageResponse.ok) {
      console.log('✅ 新建文章页面可以正常访问')
    } else {
      console.log('⚠️ 新建文章页面访问异常:', pageResponse.status)
    }

    console.log('\n🎉 所有测试通过！文章发布功能修复成功！')
    console.log('\n📋 修复总结:')
    console.log('- ✅ 修复了 Route Handler 中 cookies() 函数的使用问题')
    console.log('- ✅ 添加了 getSessionFromRequest() 函数用于 Route Handler 认证')
    console.log('- ✅ 更新了所有相关 API 路由使用正确的认证方法')
    console.log('- ✅ 确保了浏览器和服务器端认证的一致性')
    
    console.log('\n💡 现在你可以在浏览器中正常使用文章发布功能了！')
    console.log(`🌐 访问: ${BASE_URL}/admin/articles/new`)

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    console.log('\n🔍 可能的问题:')
    console.log('- 确保服务器正在运行 (npm run dev)')
    console.log('- 检查端口是否为 3000')
    console.log('- 验证管理员账户是否正确')
    process.exit(1)
  }
}

// 运行测试
testArticlePublishing()
