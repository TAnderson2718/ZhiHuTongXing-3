#!/usr/bin/env node

/**
 * 检查评估工具数据脚本
 * 调查评估工具在评估馆页面不显示的问题
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

async function checkAssessmentData() {
  console.log('🔍 开始检查评估工具数据...')
  
  try {
    // 1. 检查assessments表中的数据
    console.log('\n1. 检查assessments表数据:')
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        child: {
          select: { name: true }
        }
      }
    })
    
    console.log(`✅ 找到 ${assessments.length} 条评估记录`)
    
    if (assessments.length > 0) {
      assessments.forEach((assessment, index) => {
        console.log(`\n${index + 1}. 评估记录:`)
        console.log(`   ID: ${assessment.id}`)
        console.log(`   类型: ${assessment.type}`)
        console.log(`   标题: ${assessment.title}`)
        console.log(`   描述: ${assessment.description || '无'}`)
        console.log(`   状态: ${assessment.status}`)
        console.log(`   分数: ${assessment.score || '未评分'}`)
        console.log(`   创建时间: ${assessment.createdAt}`)
        console.log(`   用户: ${assessment.user?.name} (${assessment.user?.email})`)
        console.log(`   孩子: ${assessment.child?.name || '未指定'}`)
      })
    } else {
      console.log('⚠️  assessments表中没有数据')
    }

    // 2. 检查数据库schema中是否有评估工具模板表
    console.log('\n2. 检查数据库表结构:')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log('数据库中的所有表:')
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`)
    })

    // 3. 检查是否有评估工具类型的统计
    console.log('\n3. 按类型统计评估记录:')
    const typeStats = await prisma.assessment.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })
    
    if (typeStats.length > 0) {
      typeStats.forEach(stat => {
        console.log(`   ${stat.type}: ${stat._count.id} 条记录`)
      })
    } else {
      console.log('   没有找到任何评估类型统计')
    }

    // 4. 检查最近创建的评估记录
    console.log('\n4. 最近创建的评估记录:')
    const recentAssessments = await prisma.assessment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        status: true,
        createdAt: true
      }
    })
    
    if (recentAssessments.length > 0) {
      recentAssessments.forEach(assessment => {
        console.log(`   ${assessment.createdAt.toISOString()} - ${assessment.type} - ${assessment.title} (${assessment.status})`)
      })
    } else {
      console.log('   没有找到最近的评估记录')
    }

    console.log('\n🎉 评估数据检查完成！')
    
  } catch (error) {
    console.error('\n❌ 检查评估数据时出错:')
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行检查
checkAssessmentData()
