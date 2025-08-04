import { Metadata } from 'next'
import { generateArticleMetadata } from '@/lib/metadata'

// 模拟文章数据（在实际应用中，这应该从数据库获取）
const mockArticles: Record<string, any> = {
  '1': {
    id: '1',
    title: '家庭安全隐患排查清单',
    description: '全面的家庭安全隐患排查指南，帮助家长识别和消除家中的潜在危险，为孩子创造安全的成长环境。',
    category: '安全防护',
    author: '安全专家团队',
    publishedTime: '2025-01-15T00:00:00Z',
    tags: ['家庭安全', '隐患排查', '儿童安全', '安全防护']
  },
  '2': {
    id: '2',
    title: '儿童营养均衡饮食指南',
    description: '科学的儿童营养搭配方案，详细介绍各年龄段孩子的营养需求，帮助家长制定健康的饮食计划。',
    category: '生活照护',
    author: '营养专家团队',
    publishedTime: '2025-01-10T00:00:00Z',
    tags: ['儿童营养', '均衡饮食', '健康成长', '营养搭配']
  },
  '3': {
    id: '3',
    title: '如何培养孩子的情绪管理能力',
    description: '专业的儿童情绪管理指导，教授家长如何帮助孩子认识、理解和管理自己的情绪，培养健康的心理素质。',
    category: '心理健康',
    author: '心理专家团队',
    publishedTime: '2025-01-05T00:00:00Z',
    tags: ['情绪管理', '心理健康', '儿童心理', '情商培养']
  }
}

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = mockArticles[params.id]
  
  if (!article) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在或已被删除'
    }
  }

  return generateArticleMetadata({
    title: article.title,
    description: article.description,
    slug: params.id,
    publishedTime: article.publishedTime,
    author: article.author,
    category: article.category,
    tags: article.tags
  })
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
