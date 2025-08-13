#!/usr/bin/env node

/**
 * 社区帖子种子数据脚本
 * 初始化社区帖子和评论数据
 */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

const prisma = new PrismaClient()

// 社区帖子数据
const postsData = [
  {
    title: "如何培养孩子的阅读习惯？",
    content: "分享一些实用的方法和经验。我家孩子3岁了，最近开始对书本感兴趣，想请教大家有什么好的方法可以培养孩子的阅读习惯？",
    likes: 256
  },
  {
    title: "二胎家庭如何平衡两个孩子的关系？",
    content: "求助：大宝总是嫉妒二宝怎么办？自从二宝出生后，大宝经常闹脾气，说不喜欢弟弟。作为父母，我们应该如何处理这种情况？",
    likes: 167
  },
  {
    title: "孩子不爱吃蔬菜，有什么好办法？",
    content: "分享一些让孩子爱上蔬菜的小技巧。我试过很多方法，包括把蔬菜做成可爱的形状，和孩子一起种菜等等，效果还不错。",
    likes: 298
  },
  {
    title: "幼儿园选择的困惑",
    content: "公立还是私立？离家近还是教学质量好？作为新手妈妈，面对这么多选择真的很纠结。希望有经验的家长能给些建议。",
    likes: 189
  },
  {
    title: "孩子总是拖拉怎么办？",
    content: "每天早上起床、吃饭、穿衣服都要催好多遍，有什么方法可以改善孩子拖拉的习惯吗？",
    likes: 234
  },
  {
    title: "分享一个有效的睡前故事技巧",
    content: "发现一个让孩子快速入睡的好方法！就是在讲故事的时候，让孩子参与进来，比如让他们猜测故事的发展，或者扮演故事中的角色。",
    likes: 145
  },
  {
    title: "孩子害怕黑暗怎么办？",
    content: "我家4岁的女儿最近开始害怕黑暗，晚上不敢一个人睡觉。试过夜灯，但效果不太好。有什么好的解决方法吗？",
    likes: 178
  },
  {
    title: "如何处理孩子的分离焦虑？",
    content: "孩子刚上幼儿园，每天送园都哭得很厉害。老师说在园里表现还好，但接园的时候又会哭。这种情况正常吗？",
    likes: 203
  }
]

// 评论数据
const commentsData = [
  {
    content: "我家孩子也是这样，后来我们建立了固定的阅读时间，每天睡前半小时一起看书，慢慢就养成习惯了。",
    postIndex: 0
  },
  {
    content: "可以试试让孩子自己选择想看的书，这样他们会更有兴趣。",
    postIndex: 0
  },
  {
    content: "这个问题我也遇到过！重要的是要让大宝感受到他仍然是被爱的，可以安排一些单独和大宝相处的时间。",
    postIndex: 1
  },
  {
    content: "我们家是让大宝参与照顾二宝，比如帮忙拿尿布、唱歌给弟弟听，这样他就有了责任感。",
    postIndex: 1
  },
  {
    content: "把蔬菜打成汁做成彩色面条，孩子特别喜欢！",
    postIndex: 2
  },
  {
    content: "我们家是和孩子一起做菜，让他参与整个过程，这样他对蔬菜就不那么抗拒了。",
    postIndex: 2
  }
]

async function seedCommunityPosts() {
  console.log('🌱 开始初始化社区帖子数据...')
  
  try {
    // 获取第一个用户作为帖子作者
    const users = await prisma.user.findMany({
      take: 5
    })
    
    if (users.length === 0) {
      console.log('❌ 没有找到用户，请先创建用户账户')
      return
    }
    
    // 清空现有的社区数据
    console.log('清理现有社区数据...')
    await prisma.comment.deleteMany({})
    await prisma.post.deleteMany({})
    
    // 插入帖子数据
    console.log('插入帖子数据...')
    const createdPosts = []
    
    for (let i = 0; i < postsData.length; i++) {
      const postData = postsData[i]
      const author = users[i % users.length] // 循环使用用户作为作者
      
      const created = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          likes: postData.likes,
          userId: author.id
        }
      })
      
      createdPosts.push(created)
      console.log(`✅ 创建帖子: ${created.title}`)
    }
    
    // 插入评论数据
    console.log('插入评论数据...')
    for (const commentData of commentsData) {
      const post = createdPosts[commentData.postIndex]
      const commenter = users[(commentData.postIndex + 1) % users.length] // 使用不同的用户作为评论者
      
      const created = await prisma.comment.create({
        data: {
          content: commentData.content,
          userId: commenter.id,
          postId: post.id
        }
      })
      
      console.log(`✅ 创建评论: ${created.content.substring(0, 30)}...`)
    }
    
    // 验证数据
    const counts = await Promise.all([
      prisma.post.count(),
      prisma.comment.count()
    ])
    
    console.log(`\n🎉 社区数据初始化完成！`)
    console.log(`📊 统计信息:`)
    console.log(`   - 帖子: ${counts[0]} 个`)
    console.log(`   - 评论: ${counts[1]} 个`)
    
  } catch (error) {
    console.error('❌ 初始化社区数据失败:')
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// 运行种子数据脚本
seedCommunityPosts()
