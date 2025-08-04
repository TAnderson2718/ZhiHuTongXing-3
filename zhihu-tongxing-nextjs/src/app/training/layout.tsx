import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '课程培训馆',
  description: '智护童行课程培训馆提供系统化的家庭教育课程，包括在线课程、线下工作坊、认证培训等，帮助家长提升育儿技能。',
  path: '/training',
  keywords: ['家庭教育课程', '育儿培训', '在线课程', '工作坊', '认证培训', '技能提升']
})

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
