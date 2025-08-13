#!/usr/bin/env node

/**
 * 全模块种子数据脚本
 * 初始化所有功能模块的数据到数据库
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

// 体验内容数据
const experienceData = [
  {
    title: '小小照护大任务',
    description: '模拟喂养、哄睡、更换尿布等日常照护挑战，在实践中学习高效的解决方法。',
    type: 'game',
    category: 'daily-care',
    difficulty: 'beginner',
    duration: '15-20分钟',
    targetAge: '0-3岁',
    tags: ['日常照护', '基础技能'],
    status: 'published',
    rating: 4.8,
    views: 2450,
    completions: 1890,
    content: {
      scenarios: [
        {
          id: 'feeding-time',
          title: '喂养时间',
          description: '宝宝到了喂奶时间，但是他似乎不太愿意吃奶，一直哭闹。你应该怎么办？',
          choices: [
            { id: 'comfort-first', text: '先安抚宝宝，检查是否有其他不适', score: 8 },
            { id: 'wait-later', text: '等一会儿再喂，可能宝宝还不饿', score: 6 },
            { id: 'force-feed', text: '强制喂奶，确保宝宝摄入足够营养', score: 2 }
          ]
        }
      ]
    },
    learningObjectives: ['掌握基本护理技能', '提升应急处理能力', '增强照护信心']
  },
  {
    title: '情绪大冒险',
    description: '面对孩子的各种"情绪风暴"，学习如何共情倾听、有效沟通，引导孩子管理情绪。',
    type: 'game',
    category: 'emotion',
    difficulty: 'intermediate',
    duration: '20-25分钟',
    targetAge: '3-8岁',
    tags: ['情绪管理', '沟通技巧'],
    status: 'published',
    rating: 4.9,
    views: 1890,
    completions: 1456,
    learningObjectives: ['识别基本情绪', '学习情绪调节技巧', '培养情商']
  },
  {
    title: '新手父母必看：基础照护指南',
    description: '从零开始学习婴幼儿基础照护技能，包括喂养、换尿布、洗澡等日常护理要点。',
    type: 'tutorial',
    category: 'basic',
    difficulty: 'beginner',
    duration: '25分钟',
    instructor: '李医生',
    thumbnail: 'https://picsum.photos/seed/tutorial1/800/450',
    tags: ['基础照护', '新手指南', '日常护理'],
    status: 'published',
    rating: 4.9,
    views: 15420,
    content: {
      sections: [
        {
          id: 'introduction',
          title: '课程介绍',
          duration: '3分钟',
          content: '欢迎来到新手父母基础照护指南...'
        }
      ]
    },
    learningObjectives: ['掌握基础照护技能', '建立照护信心', '学习安全注意事项']
  }
]

// 专家数据
const expertData = [
  {
    name: '李心理师',
    specialty: '儿童心理',
    qualifications: ['国家二级心理咨询师', '儿童心理学硕士'],
    experience: '8年',
    avatar: '/images/experts/expert1.jpg',
    bio: '专注儿童心理健康，擅长处理儿童情绪问题和行为障碍。',
    workingHours: '9:00-18:00',
    status: 'online',
    rating: 4.9,
    consultationCount: 1250
  },
  {
    name: '陈教育师',
    specialty: '家庭教育',
    qualifications: ['教育学博士', '家庭教育指导师'],
    experience: '12年',
    avatar: '/images/experts/expert2.jpg',
    bio: '家庭教育专家，致力于亲子关系改善和教育方法指导。',
    workingHours: '8:30-17:30',
    status: 'busy',
    rating: 4.8,
    consultationCount: 2100
  },
  {
    name: '赵营养师',
    specialty: '儿童营养',
    qualifications: ['注册营养师', '儿童营养学硕士'],
    experience: '6年',
    avatar: '/images/experts/expert3.jpg',
    bio: '儿童营养专家，专业指导婴幼儿喂养和营养搭配。',
    workingHours: '10:00-19:00',
    status: 'offline',
    rating: 4.7,
    consultationCount: 890
  }
]

// 课程数据
const courseData = [
  {
    title: '0-3岁婴幼儿发展与教育',
    description: '全面了解0-3岁婴幼儿的身心发展特点，掌握科学的教育方法',
    instructor: '李教授',
    coverImage: 'https://picsum.photos/seed/course1/800/600',
    content: '详细的课程内容...',
    duration: 480, // 8小时
    difficulty: 'beginner',
    isPublished: true
  },
  {
    title: '亲子沟通技巧专题讲座',
    description: '学习有效的亲子沟通方法，建立良好的亲子关系',
    instructor: '张心理师',
    coverImage: 'https://picsum.photos/seed/course2/800/600',
    content: '专题讲座内容...',
    duration: 120, // 2小时
    difficulty: 'intermediate',
    isPublished: true
  },
  {
    title: '青春期教育指导认证课程',
    description: '专业的青春期教育指导方法和技巧培训',
    instructor: '王专家',
    coverImage: 'https://picsum.photos/seed/course3/800/600',
    content: '认证课程内容...',
    duration: 720, // 12小时
    difficulty: 'advanced',
    isPublished: true
  }
]

async function seedAllModules() {
  console.log('🌱 开始初始化所有模块数据...')
  
  try {
    // 1. 清空现有数据
    console.log('清理现有数据...')
    await prisma.experienceReview.deleteMany({})
    await prisma.experienceProgress.deleteMany({})
    await prisma.experience.deleteMany({})
    await prisma.consultation.deleteMany({})
    await prisma.expert.deleteMany({})
    await prisma.courseProgress.deleteMany({})
    await prisma.course.deleteMany({})
    
    // 2. 插入体验内容数据
    console.log('插入体验内容数据...')
    for (const experience of experienceData) {
      const created = await prisma.experience.create({
        data: experience
      })
      console.log(`✅ 创建体验内容: ${created.title}`)
    }
    
    // 3. 插入专家数据
    console.log('插入专家数据...')
    for (const expert of expertData) {
      const created = await prisma.expert.create({
        data: expert
      })
      console.log(`✅ 创建专家: ${created.name}`)
    }
    
    // 4. 插入课程数据
    console.log('插入课程数据...')
    for (const course of courseData) {
      const created = await prisma.course.create({
        data: course
      })
      console.log(`✅ 创建课程: ${created.title}`)
    }
    
    // 5. 验证数据
    const counts = await Promise.all([
      prisma.experience.count(),
      prisma.expert.count(),
      prisma.course.count()
    ])
    
    console.log(`\n🎉 数据初始化完成！`)
    console.log(`📊 统计信息:`)
    console.log(`   - 体验内容: ${counts[0]} 个`)
    console.log(`   - 专家: ${counts[1]} 个`)
    console.log(`   - 课程: ${counts[2]} 个`)
    
  } catch (error) {
    console.error('❌ 初始化数据失败:')
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行种子数据脚本
seedAllModules()
