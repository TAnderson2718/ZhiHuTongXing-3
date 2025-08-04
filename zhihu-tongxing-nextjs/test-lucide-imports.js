#!/usr/bin/env node

/**
 * 测试 lucide-react 图标导入
 */

async function testLucideImports() {
  console.log('🔍 测试 lucide-react 图标导入...\n')

  try {
    // 动态导入 lucide-react
    const lucide = await import('lucide-react')
    
    console.log('📦 lucide-react 包加载成功')
    
    // 检查关键图标是否存在
    const iconsToCheck = [
      'Video',
      'Bold',
      'Italic',
      'Upload',
      'Image',
      'Play',
      'Settings',
      'Eye',
      'Save'
    ]
    
    console.log('\n🔍 检查图标可用性:')
    
    for (const iconName of iconsToCheck) {
      const iconExists = iconName in lucide
      console.log(`   ${iconExists ? '✅' : '❌'} ${iconName}: ${iconExists ? '可用' : '不存在'}`)
      
      if (!iconExists) {
        // 尝试查找相似的图标名称
        const allIcons = Object.keys(lucide).filter(key => 
          key.toLowerCase().includes(iconName.toLowerCase()) ||
          iconName.toLowerCase().includes(key.toLowerCase())
        )
        
        if (allIcons.length > 0) {
          console.log(`      💡 相似图标: ${allIcons.slice(0, 3).join(', ')}`)
        }
      }
    }
    
    // 检查总的图标数量
    const totalIcons = Object.keys(lucide).filter(key => 
      typeof lucide[key] === 'function' && 
      key[0] === key[0].toUpperCase()
    ).length
    
    console.log(`\n📊 总共可用图标数量: ${totalIcons}`)
    
    // 列出一些视频相关的图标
    const videoRelatedIcons = Object.keys(lucide).filter(key => 
      key.toLowerCase().includes('video') ||
      key.toLowerCase().includes('play') ||
      key.toLowerCase().includes('media')
    )
    
    if (videoRelatedIcons.length > 0) {
      console.log('\n🎥 视频相关图标:')
      videoRelatedIcons.forEach(icon => {
        console.log(`   - ${icon}`)
      })
    }
    
  } catch (error) {
    console.error('❌ lucide-react 导入失败:', error.message)
    
    // 检查是否是模块未找到的问题
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('\n💡 建议解决方案:')
      console.log('1. 重新安装依赖: npm install')
      console.log('2. 检查 package.json 中的 lucide-react 版本')
      console.log('3. 清除 node_modules 并重新安装: rm -rf node_modules && npm install')
    }
  }
}

// 运行测试
testLucideImports()
