import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始数据库种子数据填充...')

  // 创建测试用户（使用安全的bcrypt哈希）
  const testUserHashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: testUserHashedPassword,
      name: '测试用户',
      image: null,
    },
  })

  // 创建管理员用户（使用安全的bcrypt哈希）
  const adminHashedPassword = await bcrypt.hash('Admin@2025!Secure#', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zhihutongxing.com' },
    update: {},
    create: {
      email: 'admin@zhihutongxing.com',
      password: adminHashedPassword,
      name: '管理员',
      image: null,
      role: 'admin',
    },
  })

  console.log('用户创建成功:')
  console.log('- 测试用户:', user.email)
  console.log('- 管理员:', adminUser.email)

  // 创建孩子信息
  const child1 = await prisma.child.upsert({
    where: { id: 'child1' },
    update: {},
    create: {
      id: 'child1',
      name: '小太阳',
      birthday: new Date('2019-03-15'),
      gender: 'male',
      avatar: 'https://picsum.photos/seed/avatar1/100/100',
      userId: user.id,
    },
  })

  await prisma.child.upsert({
    where: { id: 'child2' },
    update: {},
    create: {
      id: 'child2',
      name: '小月亮',
      birthday: new Date('2022-11-20'),
      gender: 'female',
      avatar: 'https://picsum.photos/seed/avatar2/100/100',
      userId: user.id,
    },
  })

  // 创建文章数据
  const articles = [
    {
      title: '家庭安全隐患排查清单',
      content: `<p>对于充满好奇心和活力的孩子们来说，家是他们探索世界的第一站，但也可能隐藏着意想不到的危险。作为家长，定期排查并消除家中的安全隐患至关重要。我们为您准备了这份超全的家庭安全隐患排查清单，帮助您为孩子打造一个更安全的成长环境。</p>
      <h2>客厅区域</h2>
      <ul>
        <li><strong>家具：</strong>所有高于60厘米的独立柜子（如书柜、斗柜）都应被固定在墙上，防止倾倒。</li>
        <li><strong>桌角/茶几角：</strong>安装防撞角，避免孩子奔跑时撞伤。</li>
        <li><strong>电源插座：</strong>使用安全插座保护盖，防止孩子将手指或异物插入。</li>
      </ul>`,
      author: '智护童行专家团队',
      category: 'safety',
      coverImage: 'https://picsum.photos/seed/safety/1200/400',
    },
    {
      title: '读懂孩子的"情绪风暴"',
      content: `<p>当2岁的孩子因为一块饼干在地上打滚，当5岁的孩子因为输了游戏而大发脾气，这些"情绪风暴"常常让家长感到头疼甚至束手无策。但其实，这是孩子成长过程中的正常现象。理解风暴背后的原因，是帮助孩子管理情绪的第一步。</p>
      <h2>为什么孩子会情绪失控？</h2>
      <p>主要原因在于，儿童的大脑前额叶皮层（负责理性思考、冲动控制的区域）尚未发育成熟。当他们遇到挫折、疲劳、饥饿或无法表达自己的需求时，情绪脑（杏仁核）会迅速占据主导，导致他们无法进行理性思考，只能通过哭闹、尖叫等最原始的方式来表达强烈的感受。</p>`,
      author: '儿童心理专家 李老师',
      category: 'psychology',
      coverImage: 'https://picsum.photos/seed/emotion/1200/400',
    },
    {
      title: '婴幼儿辅食添加全攻略',
      content: `<p>辅食添加是宝宝从母乳或配方奶向成人饮食过渡的关键一步。科学地添加辅食，不仅能满足宝宝生长发育所需的营养，还能锻炼他们的咀嚼和吞咽能力。</p>
      <h2>何时开始？</h2>
      <p>世界卫生组织建议，在宝宝满6个月时开始添加辅食。过早添加可能增加过敏风险，过晚则可能导致营养不足。</p>`,
      author: '营养师 张女士',
      category: 'life',
      coverImage: 'https://picsum.photos/seed/food/1200/400',
    },
  ]

  for (const articleData of articles) {
    try {
      await prisma.article.create({
        data: articleData,
      })
    } catch (error) {
      // 如果文章已存在，跳过
      console.log(`Article "${articleData.title}" already exists, skipping...`)
    }
  }

  // 创建课程数据
  const courses = [
    {
      title: '积极养育法',
      description: '这门课程将教您如何用既不惩罚也不骄纵的方式管教孩子，培养出自律、有责任感和解决问题能力的孩子。',
      instructor: '育儿专家 王老师',
      content: '课程详细内容...',
      coverImage: 'https://picsum.photos/seed/course/600/400',
      duration: 120,
      difficulty: 'beginner',
      isPublished: true,
    },
    {
      title: '孩子的情绪与行为管理',
      description: '帮助您理解孩子的情感需求，掌握有效的行为管理技巧。',
      instructor: '心理学专家 李老师',
      content: '课程详细内容...',
      duration: 90,
      difficulty: 'intermediate',
      isPublished: true,
    },
  ]

  for (const courseData of courses) {
    try {
      await prisma.course.create({
        data: courseData,
      })
    } catch (error) {
      // 如果课程已存在，跳过
      console.log(`Course "${courseData.title}" already exists, skipping...`)
    }
  }

  // 创建成长记录
  await prisma.growthRecord.create({
    data: {
      title: '第一次自己穿好衣服',
      content: '今天早上，小太阳自己把T恤和裤子都穿好了，虽然裤子穿反了，但还是一个巨大的进步！特别骄傲！',
      date: new Date('2025-06-20'),
      images: [],
      userId: user.id,
      childId: child1.id,
    },
  })

  // 更新专家数据，添加专业领域
  try {
    await prisma.expert.updateMany({
      where: { name: '李心理师' },
      data: {
        specialty: '情绪管理',
        bio: '儿童心理学专家，专注于情绪管理和行为引导'
      }
    })

    await prisma.expert.updateMany({
      where: { name: '陈教育师' },
      data: {
        specialty: '家庭教育',
        bio: '家庭教育专家，专注于家庭沟通和教育方法'
      }
    })

    await prisma.expert.updateMany({
      where: { name: '赵营养师' },
      data: {
        specialty: '儿童营养',
        bio: '儿童营养专家，专注于营养搭配和健康饮食'
      }
    })

    console.log('专家数据更新完成！')
  } catch (error) {
    console.log('专家数据更新失败:', error)
  }

  console.log('数据库种子数据填充完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
