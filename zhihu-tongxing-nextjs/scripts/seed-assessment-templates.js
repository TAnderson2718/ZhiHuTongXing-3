#!/usr/bin/env node

/**
 * 评估工具模板种子数据脚本
 * 初始化评估工具模板数据到数据库
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

const assessmentTemplates = [
  {
    name: '综合能力评估',
    type: 'comprehensive',
    title: '综合能力评估',
    description: '全面评估孩子的认知、语言、社交、运动等各方面发展水平',
    ageRange: '2-12岁',
    duration: '30-45分钟',
    difficulty: 'medium',
    category: 'development',
    icon: 'ClipboardList',
    color: 'bg-blue-500',
    features: ['认知能力', '语言发展', '社交技能', '运动协调', '情绪管理'],
    isActive: true
  },
  {
    name: 'SDQ行为评估',
    type: 'sdq',
    title: 'SDQ行为评估',
    description: '儿童行为问题筛查量表，评估孩子的行为和情绪状态',
    ageRange: '3-16岁',
    duration: '15-20分钟',
    difficulty: 'low',
    category: 'behavior',
    icon: 'FileText',
    color: 'bg-green-500',
    features: ['情绪症状', '行为问题', '多动注意力', '同伴关系', '亲社会行为'],
    isActive: true
  },
  {
    name: 'EMBU教养方式评估',
    type: 'embu',
    title: 'EMBU教养方式评估',
    description: '评估父母的教养方式对孩子发展的影响',
    ageRange: '适用于家长',
    duration: '20-25分钟',
    difficulty: 'medium',
    category: 'parenting',
    icon: 'Users',
    color: 'bg-purple-500',
    features: ['情感温暖', '拒绝否认', '过度保护', '偏爱被试', '惩罚严厉'],
    isActive: true
  },
  {
    name: '儿童照护能力量表',
    type: 'childcare-ability',
    title: '儿童照护能力量表',
    description: '评估父母在日常照护、健康管理、安全防护、情感支持等方面的能力',
    ageRange: '适用于家长',
    duration: '25-30分钟',
    difficulty: 'medium',
    category: 'caregiving',
    icon: 'Heart',
    color: 'bg-red-500',
    features: ['日常照护', '健康管理', '安全防护', '情感支持', '照护技能'],
    isActive: true
  },
  {
    name: '亲子关系量表',
    type: 'parent-child-relationship',
    title: '亲子关系量表',
    description: '评估亲子间的亲密度、沟通质量、冲突处理和共同活动等关系维度',
    ageRange: '适用于家长',
    duration: '20-25分钟',
    difficulty: 'medium',
    category: 'relationship',
    icon: 'Heart',
    color: 'bg-pink-500',
    features: ['亲密度', '沟通质量', '冲突处理', '共同活动', '关系质量'],
    isActive: true
  },
  {
    name: '父母自我效能感量表',
    type: 'parental-self-efficacy',
    title: '父母自我效能感量表',
    description: '评估父母对自己育儿能力的信心和效能感水平',
    ageRange: '适用于家长',
    duration: '15-20分钟',
    difficulty: 'low',
    category: 'self-efficacy',
    icon: 'Brain',
    color: 'bg-indigo-500',
    features: ['育儿信心', '问题解决能力', '情绪调节', '支持寻求', '自我效能'],
    isActive: true
  },
  {
    name: '父母教养能力量表',
    type: 'parenting-competence',
    title: '父母教养能力量表',
    description: '全面评估父母的教养策略、行为管理、学习支持和社交指导能力',
    ageRange: '适用于家长',
    duration: '30-35分钟',
    difficulty: 'high',
    category: 'competence',
    icon: 'GraduationCap',
    color: 'bg-orange-500',
    features: ['教养策略', '行为管理', '学习支持', '社交指导', '教养技能'],
    isActive: true
  }
]

async function seedAssessmentTemplates() {
  console.log('🌱 开始初始化评估工具模板数据...')
  
  try {
    // 清空现有的评估工具模板数据
    console.log('清理现有数据...')
    await prisma.assessmentTemplate.deleteMany({})
    
    // 插入新的评估工具模板数据
    console.log('插入评估工具模板数据...')
    
    for (const template of assessmentTemplates) {
      const created = await prisma.assessmentTemplate.create({
        data: template
      })
      console.log(`✅ 创建评估工具: ${created.name} (ID: ${created.id})`)
    }
    
    // 验证数据
    const count = await prisma.assessmentTemplate.count()
    console.log(`\n🎉 成功创建 ${count} 个评估工具模板！`)
    
    // 显示创建的模板列表
    const templates = await prisma.assessmentTemplate.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        category: true,
        isActive: true
      }
    })
    
    console.log('\n📋 评估工具模板列表:')
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.type}) - ${template.category} - ${template.isActive ? '激活' : '禁用'}`)
    })
    
  } catch (error) {
    console.error('❌ 初始化评估工具模板数据失败:')
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行种子数据脚本
seedAssessmentTemplates()
