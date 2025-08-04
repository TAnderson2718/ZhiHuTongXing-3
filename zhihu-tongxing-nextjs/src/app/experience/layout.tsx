import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '情境体验馆',
  description: '智护童行情境体验馆通过虚拟现实和互动游戏，让家长和孩子在安全的环境中体验各种照护情境，提升实际操作能力。',
  path: '/experience',
  keywords: ['情境体验', '虚拟现实', '互动游戏', '照护体验', '实操训练', '安全体验']
})

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
