/**
 * 视频平台链接解析器
 * 支持主流视频平台的链接解析和嵌入代码生成
 */

export interface VideoInfo {
  platform: string
  videoId: string
  title?: string
  thumbnail?: string
  embedUrl: string
  originalUrl: string
  duration?: string
  description?: string
}

export interface PlatformConfig {
  name: string
  domains: string[]
  extractVideoId: (url: string) => string | null
  getEmbedUrl: (videoId: string, options?: EmbedOptions) => string
  getThumbnail?: (videoId: string) => string
  getVideoInfo?: (videoId: string) => Promise<Partial<VideoInfo>>
  supportedFeatures: {
    autoplay: boolean
    fullscreen: boolean
    responsive: boolean
    customSize: boolean
  }
}

export interface EmbedOptions {
  width?: number
  height?: number
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  responsive?: boolean
}

// 支持的视频平台配置
export const VIDEO_PLATFORMS: Record<string, PlatformConfig> = {
  bilibili: {
    name: 'Bilibili',
    domains: ['bilibili.com', 'www.bilibili.com', 'b23.tv'],
    extractVideoId: (url: string) => {
      // 支持多种Bilibili URL格式
      const patterns = [
        /(?:bilibili\.com\/video\/)([a-zA-Z0-9]+)/,
        /(?:b23\.tv\/)([a-zA-Z0-9]+)/,
        /(?:bilibili\.com\/video\/av)(\d+)/,
        /(?:bilibili\.com\/video\/BV)([a-zA-Z0-9]+)/
      ]
      
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
    getEmbedUrl: (videoId: string, options: EmbedOptions = {}) => {
      // Bilibili嵌入URL格式
      const { autoplay = false, width = 640, height = 360 } = options
      let baseUrl: string

      if (videoId.startsWith('BV')) {
        baseUrl = `//player.bilibili.com/player.html?bvid=${videoId}&page=1`
      } else if (/^\d+$/.test(videoId)) {
        baseUrl = `//player.bilibili.com/player.html?aid=${videoId}&page=1`
      } else {
        baseUrl = `//player.bilibili.com/player.html?bvid=${videoId}&page=1`
      }

      const params = new URLSearchParams()
      if (autoplay) params.append('autoplay', '1')
      params.append('high_quality', '1')
      params.append('danmaku', '0')

      const paramStr = params.toString()
      return paramStr ? `${baseUrl}&${paramStr}` : baseUrl
    },
    getThumbnail: (videoId: string) => {
      // Bilibili缩略图（需要API支持）
      return `https://picsum.photos/seed/bilibili-${videoId}/480/360`
    },
    supportedFeatures: {
      autoplay: true,
      fullscreen: true,
      responsive: true,
      customSize: true
    }
  },

  tencent: {
    name: '腾讯视频',
    domains: ['v.qq.com', 'video.qq.com'],
    extractVideoId: (url: string) => {
      const match = url.match(/(?:v\.qq\.com\/.*\/?)([a-zA-Z0-9]+)/)
      return match ? match[1] : null
    },
    getEmbedUrl: (videoId: string, options: EmbedOptions = {}) => {
      const { autoplay = false, width = 640, height = 360 } = options
      const params = new URLSearchParams()
      if (autoplay) params.append('autoplay', '1')

      const baseUrl = `//v.qq.com/txp/iframe/player.html?vid=${videoId}`
      const paramStr = params.toString()
      return paramStr ? `${baseUrl}&${paramStr}` : baseUrl
    },
    getThumbnail: (videoId: string) => {
      return `https://picsum.photos/seed/tencent-${videoId}/480/360`
    },
    supportedFeatures: {
      autoplay: true,
      fullscreen: true,
      responsive: true,
      customSize: true
    }
  },

  iqiyi: {
    name: '爱奇艺',
    domains: ['iqiyi.com', 'www.iqiyi.com'],
    extractVideoId: (url: string) => {
      const match = url.match(/(?:iqiyi\.com\/.*\/)([a-zA-Z0-9_]+)/)
      return match ? match[1] : null
    },
    getEmbedUrl: (videoId: string, options: EmbedOptions = {}) => {
      const { autoplay = false, width = 640, height = 360 } = options
      const params = new URLSearchParams()
      if (autoplay) params.append('autoplay', '1')

      const baseUrl = `//open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid=${videoId}`
      const paramStr = params.toString()
      return paramStr ? `${baseUrl}&${paramStr}` : baseUrl
    },
    getThumbnail: (videoId: string) => {
      return `https://picsum.photos/seed/iqiyi-${videoId}/480/360`
    },
    supportedFeatures: {
      autoplay: true,
      fullscreen: true,
      responsive: true,
      customSize: true
    }
  },

  youku: {
    name: '优酷',
    domains: ['youku.com', 'v.youku.com'],
    extractVideoId: (url: string) => {
      const match = url.match(/(?:youku\.com\/.*id_)([a-zA-Z0-9]+)/)
      return match ? match[1] : null
    },
    getEmbedUrl: (videoId: string, options: EmbedOptions = {}) => {
      const { autoplay = false, width = 640, height = 360 } = options
      const params = new URLSearchParams()
      if (autoplay) params.append('autoplay', '1')

      const baseUrl = `//player.youku.com/embed/${videoId}`
      const paramStr = params.toString()
      return paramStr ? `${baseUrl}&${paramStr}` : baseUrl
    },
    getThumbnail: (videoId: string) => {
      return `https://picsum.photos/seed/youku-${videoId}/480/360`
    },
    supportedFeatures: {
      autoplay: false,
      fullscreen: true,
      responsive: true,
      customSize: true
    }
  },

  youtube: {
    name: 'YouTube',
    domains: ['youtube.com', 'www.youtube.com', 'youtu.be'],
    extractVideoId: (url: string) => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    },
    getEmbedUrl: (videoId: string, options: EmbedOptions = {}) => {
      const { autoplay = false, muted = false, loop = false, controls = true } = options
      const params = new URLSearchParams()

      if (autoplay) params.append('autoplay', '1')
      if (muted) params.append('mute', '1')
      if (loop) params.append('loop', '1')
      if (!controls) params.append('controls', '0')

      const baseUrl = `//www.youtube.com/embed/${videoId}`
      const paramStr = params.toString()
      return paramStr ? `${baseUrl}?${paramStr}` : baseUrl
    },
    getThumbnail: (videoId: string) => {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    },
    supportedFeatures: {
      autoplay: true,
      fullscreen: true,
      responsive: true,
      customSize: true
    }
  }
}

/**
 * 解析视频URL，提取平台信息和视频ID
 */
export function parseVideoUrl(url: string, options: EmbedOptions = {}): VideoInfo | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // 查找匹配的平台
    for (const [platformKey, config] of Object.entries(VIDEO_PLATFORMS)) {
      if (config.domains.some(domain => hostname.includes(domain))) {
        const videoId = config.extractVideoId(url)
        if (videoId) {
          return {
            platform: platformKey,
            videoId,
            embedUrl: config.getEmbedUrl(videoId, options),
            thumbnail: config.getThumbnail?.(videoId),
            originalUrl: url
          }
        }
      }
    }

    return null
  } catch (error) {
    console.error('解析视频URL失败:', error)
    return null
  }
}

/**
 * 检测URL是否为支持的视频平台链接
 */
export function isVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    return Object.values(VIDEO_PLATFORMS).some(config =>
      config.domains.some(domain => hostname.includes(domain))
    )
  } catch {
    return false
  }
}

/**
 * 获取平台支持的功能
 */
export function getPlatformFeatures(platform: string): PlatformConfig['supportedFeatures'] | null {
  const config = VIDEO_PLATFORMS[platform]
  return config?.supportedFeatures || null
}

/**
 * 生成视频嵌入HTML代码
 */
export function generateVideoEmbedHtml(videoInfo: VideoInfo, options: EmbedOptions & {
  title?: string
  className?: string
  id?: string
} = {}): string {
  const {
    width = 800,
    height = 450,
    title = '视频播放器',
    className = '',
    id = '',
    responsive = true
  } = options

  const iframeAttrs = [
    `src="${videoInfo.embedUrl}"`,
    `title="${title}"`,
    `width="${width}"`,
    `height="${height}"`,
    'frameborder="0"',
    'allowfullscreen',
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
  ]

  if (className) iframeAttrs.push(`class="${className}"`)
  if (id) iframeAttrs.push(`id="${id}"`)

  const iframe = `<iframe ${iframeAttrs.join(' ')}></iframe>`

  if (responsive) {
    return `
      <div class="video-container" style="position: relative; padding-bottom: ${(height / width * 100).toFixed(2)}%; height: 0; overflow: hidden;">
        <iframe
          src="${videoInfo.embedUrl}"
          title="${title}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ${className ? `class="${className}"` : ''}
          ${id ? `id="${id}"` : ''}
        ></iframe>
      </div>
    `.trim()
  }

  return iframe
}

/**
 * 检查URL是否为支持的视频平台
 */
export function isSupportedVideoPlatform(url: string): boolean {
  return parseVideoUrl(url) !== null
}

/**
 * 获取所有支持的平台列表
 */
export function getSupportedPlatforms(): Array<{ key: string; name: string; domains: string[] }> {
  return Object.entries(VIDEO_PLATFORMS).map(([key, config]) => ({
    key,
    name: config.name,
    domains: config.domains
  }))
}

/**
 * 根据平台名称获取配置
 */
export function getPlatformConfig(platform: string): PlatformConfig | null {
  return VIDEO_PLATFORMS[platform] || null
}

/**
 * 生成视频缩略图URL
 */
export function getVideoThumbnail(videoInfo: VideoInfo): string | undefined {
  const config = VIDEO_PLATFORMS[videoInfo.platform]
  return config?.getThumbnail?.(videoInfo.videoId)
}

/**
 * 批量解析视频URL
 */
export function parseMultipleVideoUrls(urls: string[], options: EmbedOptions = {}): VideoInfo[] {
  return urls
    .map(url => parseVideoUrl(url, options))
    .filter((info): info is VideoInfo => info !== null)
}
