import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '能力评估馆',
  description: '智护童行能力评估馆提供专业的儿童发展评估工具，帮助家长了解孩子的成长状况，制定个性化的教育方案。',
  path: '/assessment',
  keywords: ['儿童能力评估', '发展评估', '成长记录', '个性化教育', '儿童发展', '能力测试']
})

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
