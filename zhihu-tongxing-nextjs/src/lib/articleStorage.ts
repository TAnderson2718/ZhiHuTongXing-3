import fs from 'fs'
import path from 'path'

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'data')
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')

// 文章类型定义
export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  readTime: string
  views: string
  rating: string
  category: string
  tags: string[]
  image: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

// 默认文章数据
const defaultArticles: Article[] = [
  {
    id: '1',
    title: '家庭安全隐患排查清单',
    excerpt: '对于充满好奇心和活力的孩子们来说，家是他们探索世界的第一站，但也可能隐藏着意想不到的危险...',
    content: `
      <h2>家庭安全的重要性</h2>
      <p>对于充满好奇心和活力的孩子们来说，家是他们探索世界的第一站，但也可能隐藏着意想不到的危险。作为家长，我们需要时刻保持警觉，定期进行家庭安全隐患排查。</p>
      
      <h3>客厅安全检查</h3>
      <p>客厅是家庭活动的主要场所，也是孩子们经常玩耍的地方。以下是客厅安全检查的要点：</p>
      <ul>
        <li>检查电源插座是否有安全保护盖</li>
        <li>确保电线整理妥当，避免绊倒</li>
        <li>检查家具尖角是否有防护措施</li>
        <li>确保重物放置稳固</li>
      </ul>
      
      <div class="video-container" data-video-id="safety-demo-1">
        <video-player 
          src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          title="客厅安全检查演示"
          poster="https://picsum.photos/seed/safety1/800/450"
        ></video-player>
      </div>
      
      <h3>厨房安全防护</h3>
      <p>厨房是家中最危险的区域之一，需要特别注意以下几点：</p>
      <ul>
        <li>安装儿童安全锁</li>
        <li>收好刀具和尖锐物品</li>
        <li>检查燃气设备</li>
        <li>保持地面干燥</li>
      </ul>
      
      <div class="video-container" data-video-id="kitchen-safety-1">
        <video-player 
          src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
          title="厨房安全防护指南"
          poster="https://picsum.photos/seed/kitchen1/800/450"
        ></video-player>
      </div>
      
      <h3>总结</h3>
      <p>家庭安全需要我们持续关注和维护。定期进行安全检查，及时发现和消除隐患，为孩子创造一个安全的成长环境。</p>
    `,
    author: '智护童行专家团队',
    publishedAt: '2025-01-15',
    readTime: '8分钟',
    views: '2300',
    rating: '4.8',
    category: 'safety',
    tags: ['家庭安全', '儿童防护', '安全检查'],
    image: 'https://picsum.photos/seed/safety/800/400',
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: '儿童营养均衡饮食指南',
    excerpt: '儿童正处于快速生长发育期，营养均衡对他们的身体和智力发展至关重要...',
    content: `
      <h2>营养均衡的重要性</h2>
      <p>儿童正处于快速生长发育期，营养均衡对他们的身体和智力发展至关重要。</p>
      
      <div class="video-container" data-video-id="nutrition-intro">
        <video-player 
          src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          title="儿童营养基础知识"
          poster="https://picsum.photos/seed/nutrition1/800/450"
        ></video-player>
      </div>
      
      <h3>每日营养需求</h3>
      <p>根据年龄段的不同，儿童的营养需求也有所差异...</p>
    `,
    author: '营养专家李医生',
    publishedAt: '2025-01-10',
    readTime: '12分钟',
    views: '1800',
    rating: '4.9',
    category: 'life',
    tags: ['营养', '饮食', '健康'],
    image: 'https://picsum.photos/seed/food/800/400',
    status: 'published',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  }
]

// 确保数据目录存在
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 从文件加载文章
export function loadArticles(): Article[] {
  try {
    // 在构建时返回默认数据，避免文件系统访问
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return defaultArticles
    }

    ensureDataDirectory()

    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf8')
      return JSON.parse(data)
    } else {
      // 如果文件不存在，创建默认数据文件
      saveArticles(defaultArticles)
      return defaultArticles
    }
  } catch (error) {
    console.error('Error loading articles:', error)
    return defaultArticles
  }
}

// 保存文章到文件
export function saveArticles(articles: Article[]): void {
  try {
    // 在构建时跳过文件写入
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return
    }

    ensureDataDirectory()
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving articles:', error)
  }
}

// 添加新文章
export function addArticle(article: Article): void {
  const articles = loadArticles()
  articles.push(article)
  saveArticles(articles)
}

// 更新文章
export function updateArticle(id: string, updateData: Partial<Article>): Article | null {
  const articles = loadArticles()
  const index = articles.findIndex(article => article.id === id)
  
  if (index === -1) {
    return null
  }
  
  articles[index] = { ...articles[index], ...updateData, updatedAt: new Date().toISOString() }
  saveArticles(articles)
  return articles[index]
}

// 删除文章
export function deleteArticle(id: string): boolean {
  const articles = loadArticles()
  const index = articles.findIndex(article => article.id === id)
  
  if (index === -1) {
    return false
  }
  
  articles.splice(index, 1)
  saveArticles(articles)
  return true
}

// 根据ID获取文章
export function getArticleById(id: string): Article | null {
  const articles = loadArticles()
  return articles.find(article => article.id === id) || null
}
