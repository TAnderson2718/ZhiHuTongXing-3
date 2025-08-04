import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSession } from '@/lib/auth'
import { defaultMetadata, generateStructuredData } from '@/lib/metadata'
import NotificationProvider from '@/components/common/notification-provider'
import ChunkErrorBoundary from '@/components/ChunkErrorBoundary'
import CacheManager from '@/components/CacheManager'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  const websiteStructuredData = generateStructuredData('website', {})
  const organizationStructuredData = generateStructuredData('organization', {})

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData)
          }}
        />
      </head>
      <body className={inter.className}>

        <CacheManager />
        <NotificationProvider>
          <ChunkErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header user={user} />
              <main className="flex-1">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">页面加载中...</p>
                    </div>
                  </div>
                }>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </ChunkErrorBoundary>
        </NotificationProvider>
      </body>
    </html>
  )
}
