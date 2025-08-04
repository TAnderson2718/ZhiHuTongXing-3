import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '家长社区',
  description: '智护童行家长社区是家长们交流育儿经验、分享教育心得的平台。在这里可以参与热门讨论、获得专业建议、结识志同道合的家长朋友。',
  path: '/community',
  keywords: ['家长社区', '育儿交流', '教育讨论', '亲子经验', '家长互助', '育儿问答']
})

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
