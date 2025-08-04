import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

// 模拟讨论数据（在实际应用中，这应该从数据库获取）
const mockDiscussions: Record<string, any> = {
  '1': {
    id: '1',
    title: '如何培养孩子的阅读习惯？',
    description: '我家孩子5岁了，对书本不太感兴趣，总是喜欢看电视和玩游戏。有什么好方法可以培养他的阅读兴趣吗？',
    author: '李妈妈',
    category: '教育方法',
    tags: ['阅读习惯', '学龄前', '兴趣培养']
  },
  '2': {
    id: '2',
    title: '二胎家庭如何平衡两个孩子的关系？',
    description: '大宝今年8岁，二宝2岁。最近大宝总是表现出嫉妒情绪，有时候会故意欺负弟弟。作为父母应该如何处理这种情况？',
    author: '王爸爸',
    category: '心理健康',
    tags: ['二胎家庭', '手足关系', '嫉妒情绪']
  },
  '3': {
    id: '3',
    title: '孩子不爱吃蔬菜，有什么好办法？',
    description: '3岁的女儿特别挑食，尤其是绿叶蔬菜一点都不吃。试过很多方法都不管用，求有经验的家长分享一些实用技巧。',
    author: '张妈妈',
    category: '营养饮食',
    tags: ['挑食', '营养均衡', '蔬菜']
  }
}

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const discussion = mockDiscussions[params.id]
  
  if (!discussion) {
    return {
      title: '讨论未找到',
      description: '您访问的讨论不存在或已被删除'
    }
  }

  return generatePageMetadata({
    title: `${discussion.title} - 家长社区讨论`,
    description: discussion.description,
    path: `/community/discussions/${params.id}`,
    keywords: ['家长讨论', '育儿交流', ...discussion.tags, discussion.category]
  })
}

export default function DiscussionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
