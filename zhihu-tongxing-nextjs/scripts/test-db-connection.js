#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 验证PostgreSQL数据库连接和基本操作
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  console.log('🔍 开始测试数据库连接...')
  console.log(`📊 数据库URL: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***@')}`)
  
  try {
    // 测试数据库连接
    console.log('\n1. 测试数据库连接...')
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 检查数据库版本
    console.log('\n2. 检查数据库版本...')
    const result = await prisma.$queryRaw`SELECT version()`
    console.log(`✅ PostgreSQL版本: ${result[0].version}`)

    // 检查表结构
    console.log('\n3. 检查数据库表...')
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    if (tables.length > 0) {
      console.log('✅ 数据库表:')
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })
    } else {
      console.log('⚠️  没有找到数据库表')
    }

    // 测试基本CRUD操作
    console.log('\n4. 测试基本数据库操作...')
    
    // 检查用户表
    const userCount = await prisma.user.count()
    console.log(`✅ 用户表记录数: ${userCount}`)

    // 检查文章表
    const articleCount = await prisma.article.count()
    console.log(`✅ 文章表记录数: ${articleCount}`)

    // 检查课程表
    const courseCount = await prisma.course.count()
    console.log(`✅ 课程表记录数: ${courseCount}`)

    console.log('\n🎉 数据库连接测试完成！所有测试通过。')
    
  } catch (error) {
    console.error('\n❌ 数据库连接测试失败:')
    console.error(error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 建议检查:')
      console.error('   - PostgreSQL服务是否正在运行')
      console.error('   - 数据库连接参数是否正确')
      console.error('   - 防火墙设置是否阻止连接')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行测试
testDatabaseConnection()
