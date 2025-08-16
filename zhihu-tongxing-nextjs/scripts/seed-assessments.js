#!/usr/bin/env node

/**
 * 评估工具种子数据脚本
 * 创建测试用的评估工具模板数据
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

// 评估工具模板数据
const assessmentTemplates = [
  {
    id: 'cme8orvfe0000kpjf39krbes1', // 使用页面中的ID
    name: '测试评估工具',
    type: 'behavior',
    title: '测试评估工具',
    description: '这是一个测试用的评估工具，用于验证系统功能是否正常工作',
    ageRange: '全年龄段',
    category: 'behavior',
    difficulty: 'medium',
    duration: '10-15分钟',
    questions: { count: 0 },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cme8orvfe0000kpjf39krbes2',
    name: '儿童行为评估量表',
    type: 'behavior',
    title: '儿童行为评估量表',
    description: '专业的儿童行为评估工具，帮助家长了解孩子的行为发展状况',
    ageRange: '3-12岁',
    category: 'behavior',
    difficulty: 'medium',
    duration: '15-20分钟',
    questions: { count: 25 },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cme8orvfe0000kpjf39krbes3',
    name: '家庭教养方式评估',
    type: 'parenting',
    title: '家庭教养方式评估',
    description: '评估家庭的教养方式和亲子关系质量',
    ageRange: '0-18岁',
    category: 'parenting',
    difficulty: 'easy',
    duration: '10-15分钟',
    questions: { count: 20 },
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cme8orvfe0000kpjf39krbes4',
    name: '儿童发展里程碑评估',
    type: 'development',
    title: '儿童发展里程碑评估',
    description: '评估儿童在各个发展阶段的里程碑达成情况',
    ageRange: '0-6岁',
    category: 'development',
    difficulty: 'hard',
    duration: '20-30分钟',
    questions: { count: 35 },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedAssessments() {
  console.log('🌱 开始创建评估工具种子数据...')
  
  try {
    // 清空现有的评估工具模板数据
    console.log('🧹 清理现有评估工具数据...')
    await prisma.assessmentTemplate.deleteMany({})
    
    // 创建评估工具模板
    console.log('📝 创建评估工具模板...')
    for (const template of assessmentTemplates) {
      const created = await prisma.assessmentTemplate.create({
        data: template
      })
      console.log(`✅ 创建评估工具: ${created.name} (${created.id})`)
    }
    
    // 验证数据
    const count = await prisma.assessmentTemplate.count()
    console.log(`\n🎉 评估工具种子数据创建完成！`)
    console.log(`📊 总计创建: ${count} 个评估工具模板`)
    
    // 显示创建的数据
    const templates = await prisma.assessmentTemplate.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        isActive: true
      }
    })
    
    console.log('\n📋 创建的评估工具列表:')
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.type}) - ${template.isActive ? '已发布' : '草稿'}`)
    })
    
  } catch (error) {
    console.error('❌ 创建评估工具种子数据失败:')
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行种子数据脚本
seedAssessments()
