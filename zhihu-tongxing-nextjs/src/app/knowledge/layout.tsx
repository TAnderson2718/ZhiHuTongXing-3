import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '知识科普馆',
  description: '智护童行知识科普馆提供专业的儿童照护知识、育儿指导文章和科学育儿方法。涵盖生活照护、心理健康、安全防护、教育发展等多个领域。',
  path: '/knowledge',
  keywords: ['儿童照护知识', '育儿指导', '科学育儿', '生活照护', '心理健康', '安全防护', '教育发展']
})

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
