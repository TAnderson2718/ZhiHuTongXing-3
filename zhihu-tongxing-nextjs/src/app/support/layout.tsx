import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '专业支持馆',
  description: '智护童行专业支持馆提供一对一专家咨询、心理辅导、特殊需求支持等专业服务，为家庭提供个性化的专业指导。',
  path: '/support',
  keywords: ['专业支持', '专家咨询', '心理辅导', '特殊需求', '个性化指导', '专业服务']
})

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
