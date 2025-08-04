import { Metadata } from 'next'

// 基础网站信息
export const siteConfig = {
  name: '智护童行',
  description: '专业的家庭教育与儿童照护平台，为每个家庭提供科学、专业的育儿指导和支持服务',
  url: 'https://zhihutongxing.com',
  ogImage: 'https://zhihutongxing.com/og-image.jpg',
  creator: '智护童行团队',
  keywords: [
    '家庭教育',
    '儿童照护',
    '育儿指导',
    '亲子教育',
    '儿童发展',
    '家长培训',
    '科学育儿',
    '儿童心理',
    '安全防护',
    '营养健康'
  ]
}

// 默认元数据
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@zhihutongxing'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
  }
}

// 页面特定元数据生成器
export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  keywords = [],
  noIndex = false
}: {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || siteConfig.ogImage
  
  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: url
    },
    robots: noIndex ? {
      index: false,
      follow: false
    } : undefined
  }
}

// 文章元数据生成器
export function generateArticleMetadata({
  title,
  description,
  slug,
  image,
  publishedTime,
  modifiedTime,
  author = '智护童行专家团队',
  category,
  tags = []
}: {
  title: string
  description: string
  slug: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  category?: string
  tags?: string[]
}): Metadata {
  const url = `${siteConfig.url}/knowledge/article/${slug}`
  const ogImage = image || siteConfig.ogImage
  
  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...tags, category].filter(Boolean),
    authors: [{ name: author }],
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      publishedTime,
      modifiedTime,
      authors: [author],
      section: category
    },
    twitter: {
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: url
    }
  }
}

// 结构化数据生成器
export function generateStructuredData(type: 'website' | 'article' | 'organization', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : type === 'article' ? 'Article' : 'Organization'
  }

  switch (type) {
    case 'website':
      return {
        ...baseData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    
    case 'article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        image: data.image || siteConfig.ogImage,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          '@type': 'Person',
          name: data.author || '智护童行专家团队'
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`
          }
        }
      }
    
    case 'organization':
      return {
        ...baseData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '400-123-4567',
          contactType: 'customer service',
          availableLanguage: 'Chinese'
        },
        sameAs: [
          'https://weibo.com/zhihutongxing',
          'https://www.zhihu.com/org/zhihutongxing'
        ]
      }
    
    default:
      return baseData
  }
}
