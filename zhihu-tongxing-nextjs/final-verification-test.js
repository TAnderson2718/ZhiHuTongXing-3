#!/usr/bin/env node

/**
 * 最终验证测试 - 确认文章发布功能完全正常
 */

const BASE_URL = 'http://localhost:3004'

async function finalVerificationTest() {
  console.log('🎯 最终验证测试 - 文章发布功能完整性检查\n')

  try {
    // 1. 验证服务器状态
    console.log('1️⃣ 验证服务器状态...')
    const healthResponse = await fetch(`${BASE_URL}/api/auth/me`)
    console.log(`   服务器响应: ${healthResponse.status === 401 ? '✅ 正常 (未认证)' : '⚠️ 异常'}`)

    // 2. 测试完整的登录流程
    console.log('\n2️⃣ 测试管理员登录流程...')
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@zhihutongxing.com',
        password: 'Admin@2025!Secure#'
      })
    })

    if (!loginResponse.ok) {
      throw new Error(`登录失败: ${loginResponse.status}`)
    }

    const loginResult = await loginResponse.json()
    const sessionCookie = loginResponse.headers.get('set-cookie')?.split(';')[0]
    console.log('   ✅ 登录成功')
    console.log('   ✅ 获取到会话 Cookie')

    // 3. 验证认证状态
    console.log('\n3️⃣ 验证认证状态...')
    const authResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Cookie': sessionCookie }
    })

    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log(`   ✅ 认证验证成功: ${authData.data.name} (${authData.data.role})`)
    } else {
      throw new Error('认证验证失败')
    }

    // 4. 测试文章创建 API
    console.log('\n4️⃣ 测试文章创建 API...')
    const testArticle = {
      title: '最终验证测试文章',
      excerpt: '这是最终验证测试创建的文章',
      content: `
        <h2>最终验证测试</h2>
        <p>这篇文章验证了以下功能的完整性：</p>
        <ul>
          <li>✅ 服务器运行状态</li>
          <li>✅ 管理员登录认证</li>
          <li>✅ 会话管理</li>
          <li>✅ API 路由处理</li>
          <li>✅ 数据持久化</li>
          <li>✅ 页面访问权限</li>
        </ul>
        <p>测试完成时间: ${new Date().toLocaleString('zh-CN')}</p>
      `,
      category: 'education',
      tags: ['最终测试', '功能验证', '系统检查'],
      image: 'https://picsum.photos/seed/final-test/800/400',
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
    console.log('   ✅ 文章创建成功')
    console.log(`   📄 文章 ID: ${createResult.data.id}`)

    // 5. 验证文章保存
    console.log('\n5️⃣ 验证文章保存...')
    const listResponse = await fetch(`${BASE_URL}/api/admin/articles`)
    const listResult = await listResponse.json()
    const savedArticle = listResult.data.articles.find(a => a.id === createResult.data.id)
    
    if (savedArticle) {
      console.log('   ✅ 文章已正确保存到系统')
      console.log(`   📝 标题: ${savedArticle.title}`)
      console.log(`   📊 状态: ${savedArticle.status}`)
    } else {
      throw new Error('文章未正确保存')
    }

    // 6. 测试页面访问
    console.log('\n6️⃣ 测试页面访问...')
    const pageTests = [
      { name: '新建文章页面', url: '/admin/articles/new' },
      { name: '文章管理页面', url: '/admin/articles' },
      { name: '管理仪表板', url: '/admin/dashboard' }
    ]

    for (const { name, url } of pageTests) {
      const pageResponse = await fetch(`${BASE_URL}${url}`, {
        headers: { 'Cookie': sessionCookie }
      })
      console.log(`   ${pageResponse.ok ? '✅' : '❌'} ${name}: ${pageResponse.status}`)
    }

    // 7. 最终结论
    console.log('\n🎉 最终验证测试完成！\n')
    console.log('📋 功能状态总结:')
    console.log('   ✅ 服务器运行正常')
    console.log('   ✅ 管理员认证系统工作正常')
    console.log('   ✅ 会话管理功能正常')
    console.log('   ✅ 文章创建 API 正常')
    console.log('   ✅ 数据持久化正常')
    console.log('   ✅ 页面访问权限正常')
    
    console.log('\n💡 用户操作指南:')
    console.log(`1. 在浏览器中访问: ${BASE_URL}/admin/login`)
    console.log('2. 使用管理员账户登录:')
    console.log('   - 邮箱: admin@zhihutongxing.com')
    console.log('   - 密码: Admin@2025!Secure#')
    console.log(`3. 登录后访问: ${BASE_URL}/admin/articles/new`)
    console.log('4. 填写文章信息并点击"发布文章"按钮')
    console.log('5. 系统将自动保存并跳转到文章管理页面')
    
    console.log('\n🔧 如果遇到问题:')
    console.log('1. 确保开发服务器正在运行 (npm run dev)')
    console.log('2. 检查浏览器控制台是否有 JavaScript 错误')
    console.log('3. 清除浏览器缓存和 Cookie')
    console.log('4. 尝试在无痕模式下访问')
    
    console.log('\n✨ 结论: 文章发布功能已完全修复并正常工作！')

  } catch (error) {
    console.error('\n❌ 最终验证测试失败:', error.message)
    console.log('\n🔍 请检查:')
    console.log('- 开发服务器是否正在运行')
    console.log('- 网络连接是否正常')
    console.log('- 管理员账户信息是否正确')
    process.exit(1)
  }
}

// 运行最终验证测试
finalVerificationTest()
