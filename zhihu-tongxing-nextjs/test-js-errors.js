#!/usr/bin/env node

/**
 * 检测页面中的具体 JavaScript 错误
 */

const BASE_URL = 'http://localhost:3004'

async function detectJSErrors() {
  console.log('🔍 检测页面中的 JavaScript 错误...\n')

  try {
    // 登录获取 session
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@zhihutongxing.com',
        password: 'Admin@2025!Secure#'
      })
    })

    const sessionCookie = loginResponse.headers.get('set-cookie')?.split(';')[0]

    // 获取页面内容
    const pageResponse = await fetch(`${BASE_URL}/admin/articles/new`, {
      headers: { 'Cookie': sessionCookie }
    })

    const pageContent = await pageResponse.text()

    console.log('🔍 搜索具体的错误信息...\n')

    // 搜索各种错误模式
    const errorPatterns = [
      { name: 'Video is not defined', pattern: /Video is not defined/gi },
      { name: 'ReferenceError', pattern: /ReferenceError/gi },
      { name: 'TypeError', pattern: /TypeError/gi },
      { name: 'SyntaxError', pattern: /SyntaxError/gi },
      { name: 'Cannot read properties', pattern: /Cannot read properties/gi },
      { name: 'undefined', pattern: /undefined/gi },
      { name: 'is not a function', pattern: /is not a function/gi },
      { name: 'Module not found', pattern: /Module not found/gi },
      { name: 'Import error', pattern: /Import.*error/gi },
      { name: 'Failed to resolve', pattern: /Failed to resolve/gi }
    ]

    let foundErrors = []

    for (const { name, pattern } of errorPatterns) {
      const matches = pageContent.match(pattern)
      if (matches && matches.length > 0) {
        foundErrors.push({ name, count: matches.length })
        
        // 获取错误上下文
        const lines = pageContent.split('\n')
        const errorLines = []
        
        for (let i = 0; i < lines.length; i++) {
          if (pattern.test(lines[i])) {
            const start = Math.max(0, i - 2)
            const end = Math.min(lines.length, i + 3)
            errorLines.push({
              lineNumber: i + 1,
              context: lines.slice(start, end).map((line, idx) => ({
                line: start + idx + 1,
                content: line,
                isError: start + idx === i
              }))
            })
          }
        }
        
        if (errorLines.length > 0) {
          console.log(`❌ 发现错误: ${name} (${matches.length} 次)`)
          errorLines.slice(0, 3).forEach(({ lineNumber, context }) => {
            console.log(`   位置: 第 ${lineNumber} 行`)
            context.forEach(({ line, content, isError }) => {
              const marker = isError ? '>>> ' : '    '
              console.log(`${marker}${line}: ${content.trim()}`)
            })
            console.log('')
          })
        }
      }
    }

    if (foundErrors.length === 0) {
      console.log('✅ 未发现明显的 JavaScript 错误模式')
    } else {
      console.log(`\n📊 错误统计:`)
      foundErrors.forEach(({ name, count }) => {
        console.log(`   - ${name}: ${count} 次`)
      })
    }

    // 检查页面是否包含 Next.js 错误页面标识
    const isErrorPage = pageContent.includes('__NEXT_DATA__') && 
                       pageContent.includes('"page":"/_error"')
    
    if (isErrorPage) {
      console.log('\n⚠️ 页面显示为 Next.js 错误页面')
      
      // 尝试提取错误信息
      const nextDataMatch = pageContent.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1])
          if (nextData.props?.pageProps?.statusCode) {
            console.log(`   错误状态码: ${nextData.props.pageProps.statusCode}`)
          }
          if (nextData.err) {
            console.log(`   错误信息: ${nextData.err.message}`)
            console.log(`   错误类型: ${nextData.err.name}`)
          }
        } catch (e) {
          console.log('   无法解析错误详情')
        }
      }
    }

    // 检查是否有编译错误
    const hasCompileError = pageContent.includes('Module build failed') ||
                           pageContent.includes('Compilation failed') ||
                           pageContent.includes('webpack')

    if (hasCompileError) {
      console.log('\n⚠️ 检测到可能的编译错误')
    }

    console.log('\n💡 建议的调试步骤:')
    console.log('1. 检查服务器控制台是否有编译错误')
    console.log('2. 在浏览器中打开开发者工具查看控制台')
    console.log('3. 检查网络面板是否有资源加载失败')
    console.log('4. 尝试重启开发服务器 (npm run dev)')

  } catch (error) {
    console.error('\n❌ 检测失败:', error.message)
  }
}

// 运行检测
detectJSErrors()
