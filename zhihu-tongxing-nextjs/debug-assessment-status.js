const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugAssessmentStatus() {
  try {
    console.log('🔍 检查评估工具状态...\n')
    
    // 获取所有评估工具模板
    const templates = await prisma.assessmentTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            assessments: true
          }
        }
      }
    })

    console.log(`📊 总共找到 ${templates.length} 个评估工具模板:\n`)

    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name}`)
      console.log(`   ID: ${template.id}`)
      console.log(`   Type: ${template.type}`)
      console.log(`   isActive: ${template.isActive}`)
      console.log(`   Status: ${template.isActive ? 'active (已发布)' : 'draft (草稿)'}`)
      console.log(`   Description: ${template.description}`)
      console.log(`   Age Range: ${template.ageRange}`)
      console.log(`   Created: ${template.createdAt.toISOString()}`)
      console.log(`   Updated: ${template.updatedAt.toISOString()}`)
      console.log(`   Completions: ${template._count.assessments}`)
      console.log('   ---')
    })

    // 统计状态分布
    const activeCount = templates.filter(t => t.isActive).length
    const draftCount = templates.filter(t => !t.isActive).length

    console.log('\n📈 状态统计:')
    console.log(`   已发布 (active): ${activeCount}`)
    console.log(`   草稿 (draft): ${draftCount}`)

    // 检查用户界面可见的评估工具
    const visibleTemplates = await prisma.assessmentTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`\n👁️  用户界面可见的评估工具 (${visibleTemplates.length} 个):`)
    visibleTemplates.forEach((template, index) => {
      console.log(`   ${index + 1}. ${template.name} (${template.type})`)
    })

  } catch (error) {
    console.error('❌ 错误:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugAssessmentStatus()
