import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: '管理后台',
  description: '智护童行管理后台 - 内容管理系统',
  path: '/admin',
  noIndex: true // 管理员页面不需要被搜索引擎索引
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
