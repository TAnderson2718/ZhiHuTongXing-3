// 修复发布按钮显示问题的脚本
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixPublishButton() {
  try {
    console.log('🔧 修复评估工具发布按钮显示问题...\n')
    
    // 1. 检查数据库中的评估工具
    const templates = await prisma.assessmentTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 数据库中共有 ${templates.length} 个评估工具模板:\n`)

    // 2. 确保所有模板都有正确的isActive字段
    let fixedCount = 0
    for (const template of templates) {
      console.log(`检查: ${template.name}`)
      console.log(`  当前 isActive: ${template.isActive}`)
      
      // 如果isActive为null或undefined，设置为false（草稿状态）
      if (template.isActive === null || template.isActive === undefined) {
        await prisma.assessmentTemplate.update({
          where: { id: template.id },
          data: { isActive: false }
        })
        console.log(`  ✅ 已修复: 设置为草稿状态`)
        fixedCount++
      } else {
        console.log(`  ✅ 状态正常: ${template.isActive ? '已发布' : '草稿'}`)
      }
      console.log('  ---')
    }

    console.log(`\n🎉 修复完成! 共修复了 ${fixedCount} 个评估工具的状态字段`)

    // 3. 验证修复结果
    console.log('\n🔍 验证修复结果:')
    const updatedTemplates = await prisma.assessmentTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    })

    updatedTemplates.forEach((template, index) => {
      const status = template.isActive ? 'active (已发布)' : 'draft (草稿)'
      console.log(`${index + 1}. ${template.name} - ${status}`)
    })

    // 4. 生成前端数据格式示例
    console.log('\n📋 前端期望的数据格式:')
    const frontendData = updatedTemplates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
      description: template.description,
      ageRange: template.ageRange,
      questions: 0, // 这里应该从实际的questions字段计算
      completions: 0, // 这里应该从关联的assessments表计算
      status: template.isActive ? 'active' : 'draft', // 关键字段！
      lastUpdated: template.updatedAt.toISOString().split('T')[0],
      category: template.category,
      difficulty: template.difficulty,
      estimatedTime: template.duration
    }))

    console.log('示例数据:')
    console.log(JSON.stringify(frontendData[0], null, 2))

  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 检查前端代码中的按钮渲染逻辑
function checkButtonLogic() {
  console.log('\n🔍 前端按钮渲染逻辑检查:')
  console.log('1. 按钮应该在第342-359行渲染')
  console.log('2. 按钮依赖于 tool.status 字段')
  console.log('3. 如果 tool.status === "draft"，显示绿色发布按钮')
  console.log('4. 如果 tool.status === "active"，显示黄色取消发布按钮')
  console.log('5. 检查API返回的数据是否包含正确的status字段')
  
  console.log('\n🛠️ 可能的问题:')
  console.log('- API返回的数据缺少status字段')
  console.log('- isActive字段没有正确映射到status字段')
  console.log('- 前端过滤逻辑过滤掉了某些数据')
  console.log('- 权限检查阻止了按钮显示')
}

async function main() {
  await fixPublishButton()
  checkButtonLogic()
  
  console.log('\n📝 下一步建议:')
  console.log('1. 重新部署生产服务器代码')
  console.log('2. 检查生产服务器的API响应格式')
  console.log('3. 确认管理员权限正常')
  console.log('4. 清除浏览器缓存并刷新页面')
}

main()
