// 第三方视频平台解析器

export interface VideoInfo {
  platform: string
  videoId: string
  title?: string
  thumbnail?: string
  embedUrl: string
  originalUrl: string
}

export interface PlatformConfig {
  name: string
  domains: string[]
  urlPattern: RegExp
  embedTemplate: string
  extractVideoId: (url: string) => string | null
  getEmbedUrl: (videoId: string) => string
  getThumbnail?: (videoId: string) => string
}

// 支持的视频平台配置
export const VIDEO_PLATFORMS: Record<string, PlatformConfig> = {
  // 腾讯视频
  tencent: {
    name: '腾讯视频',
    domains: ['v.qq.com'],
    urlPattern: /(?:https?:\/\/)?(?:v\.qq\.com\/x\/(?:cover|page)\/|v\.qq\.com\/x\/cover\/.*\.html\?vid=)([a-zA-Z0-9]+)/,
    embedTemplate: 'https://v.qq.com/txp/iframe/player.html?vid={videoId}&tiny=0&auto=0',
    extractVideoId: (url: string) => {
      const match = url.match(/(?:vid=|\/cover\/.*\/|\/page\/)([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    },
    getEmbedUrl: (videoId: string) => `https://v.qq.com/txp/iframe/player.html?vid=${videoId}&tiny=0&auto=0`,
    getThumbnail: (videoId: string) => `https://puui.qpic.cn/qqvideo_ori/0/${videoId}_496_280/0`
  },

  // 优酷
  youku: {
    name: '优酷',
    domains: ['v.youku.com'],
    urlPattern: /(?:https?:\/\/)?(?:v\.youku\.com\/v_show\/id_)([a-zA-Z0-9]+)/,
    embedTemplate: 'https://player.youku.com/embed/{videoId}',
    extractVideoId: (url: string) => {
      const match = url.match(/id_([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    },
    getEmbedUrl: (videoId: string) => `https://player.youku.com/embed/${videoId}`
  },

  // 爱奇艺
  iqiyi: {
    name: '爱奇艺',
    domains: ['www.iqiyi.com'],
    urlPattern: /(?:https?:\/\/)?(?:www\.iqiyi\.com\/v_)([a-zA-Z0-9]+)/,
    embedTemplate: 'https://www.iqiyi.com/common/flashplayer/20150916/player.html?tvId={videoId}',
    extractVideoId: (url: string) => {
      const match = url.match(/v_([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    },
    getEmbedUrl: (videoId: string) => `https://www.iqiyi.com/common/flashplayer/20150916/player.html?tvId=${videoId}`
  },

  // 哔哩哔哩
  bilibili: {
    name: '哔哩哔哩',
    domains: ['www.bilibili.com', 'bilibili.com'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]+|av\d+)/,
    embedTemplate: 'https://player.bilibili.com/player.html?bvid={videoId}&page=1&as_wide=1&high_quality=1&danmaku=0',
    extractVideoId: (url: string) => {
      const match = url.match(/\/video\/(BV[a-zA-Z0-9]+|av\d+)/);
      return match ? match[1] : null;
    },
    getEmbedUrl: (videoId: string) => {
      if (videoId.startsWith('BV')) {
        return `https://player.bilibili.com/player.html?bvid=${videoId}&page=1&as_wide=1&high_quality=1&danmaku=0`;
      } else {
        return `https://player.bilibili.com/player.html?aid=${videoId.replace('av', '')}&page=1&as_wide=1&high_quality=1&danmaku=0`;
      }
    }
  },

  // YouTube (国外平台，可能需要代理)
  youtube: {
    name: 'YouTube',
    domains: ['www.youtube.com', 'youtube.com', 'youtu.be'],
    urlPattern: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    embedTemplate: 'https://www.youtube.com/embed/{videoId}',
    extractVideoId: (url: string) => {
      const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    },
    getEmbedUrl: (videoId: string) => `https://www.youtube.com/embed/${videoId}`,
    getThumbnail: (videoId: string) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
};

/**
 * 解析视频URL，提取平台信息和视频ID
 */
export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // 清理URL
  const cleanUrl = url.trim();

  // 遍历所有支持的平台
  for (const [platformKey, config] of Object.entries(VIDEO_PLATFORMS)) {
    // 检查域名匹配
    const domainMatch = config.domains.some(domain => cleanUrl.includes(domain));
    
    if (domainMatch) {
      const videoId = config.extractVideoId(cleanUrl);
      
      if (videoId) {
        return {
          platform: config.name,
          videoId,
          embedUrl: config.getEmbedUrl(videoId),
          originalUrl: cleanUrl,
          thumbnail: config.getThumbnail?.(videoId)
        };
      }
    }
  }

  return null;
}

/**
 * 生成嵌入式iframe代码
 */
export function generateEmbedCode(videoInfo: VideoInfo, options: {
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  allowFullscreen?: boolean;
} = {}): string {
  const {
    width = '100%',
    height = '400',
    autoplay = false,
    allowFullscreen = true
  } = options;

  const autoplayParam = autoplay ? '&autoplay=1' : '';
  const embedUrl = videoInfo.embedUrl + autoplayParam;

  return `<iframe 
    src="${embedUrl}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    ${allowFullscreen ? 'allowfullscreen' : ''}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  ></iframe>`;
}

/**
 * 检查URL是否为支持的视频平台
 */
export function isSupportedVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null;
}

/**
 * 获取所有支持的平台列表
 */
export function getSupportedPlatforms(): Array<{ key: string; name: string; domains: string[] }> {
  return Object.entries(VIDEO_PLATFORMS).map(([key, config]) => ({
    key,
    name: config.name,
    domains: config.domains
  }));
}

/**
 * 从HTML内容中提取视频链接
 */
export function extractVideoLinksFromHtml(html: string): VideoInfo[] {
  const videoInfos: VideoInfo[] = [];
  const urlRegex = /https?:\/\/[^\s<>"]+/g;
  const urls = html.match(urlRegex) || [];

  for (const url of urls) {
    const videoInfo = parseVideoUrl(url);
    if (videoInfo) {
      videoInfos.push(videoInfo);
    }
  }

  return videoInfos;
}

/**
 * 将视频链接转换为嵌入代码
 */
export function convertVideoLinksToEmbeds(html: string, options?: {
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  allowFullscreen?: boolean;
}): string {
  let result = html;
  const videoInfos = extractVideoLinksFromHtml(html);

  for (const videoInfo of videoInfos) {
    const embedCode = generateEmbedCode(videoInfo, options);
    result = result.replace(videoInfo.originalUrl, embedCode);
  }

  return result;
}
