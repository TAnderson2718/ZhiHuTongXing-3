'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LoadingState from '@/components/ui/loading-state'
import { articlesData } from '@/data/articles'
import { extendedArticlesData } from '@/data/articles-extended'
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Eye, 
  Star, 
  Share2, 
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Settings
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

// 合并所有文章数据
const mockArticles = {
  ...articlesData,
  ...extendedArticlesData
}

// 视频播放器组件
function VideoPlayer({ src, title, poster }: { src: string; title: string; poster: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    // 全屏功能实现
    console.log('Fullscreen requested')
  }

  const handleRestart = () => {
    setIsPlaying(false)
    // 重新开始播放
    console.log('Video restarted')
  }

  const handleSettings = () => {
    // 设置功能
    console.log('Settings opened')
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6">
      <div className="aspect-video relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <p className="mb-2">视频加载失败</p>
              <Button onClick={() => setHasError(false)} variant="outline" size="sm">
                重试
              </Button>
            </div>
          </div>
        ) : (
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        )}

        {/* 播放控制覆盖层 */}
        {showControls && !isLoading && !hasError && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlay}
                size="lg"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
            </div>

            {/* 底部控制栏 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleMute}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <span className="text-sm">{title}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleRestart}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSettings}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  const [article, setArticle] = useState<any>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // 模拟从API获取文章数据
    const fetchArticle = () => {
      const articleData = mockArticles[articleId as keyof typeof mockArticles]
      if (articleData) {
        setArticle(articleData)
      }
    }

    fetchArticle()
  }, [articleId])

  if (!article) {
    return <LoadingState />
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.title,
        url: window.location.href,
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  // 处理文章内容中的视频标签
  const processContent = (content: string) => {
    // 这里可以处理视频标签的替换逻辑
    return content
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/knowledge" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回知识科普馆
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBookmark}
                variant="ghost"
                size="sm"
                className={isBookmarked ? 'text-blue-600' : 'text-gray-600'}
              >
                <Bookmark className="w-4 h-4 mr-1" />
                {isBookmarked ? '已收藏' : '收藏'}
              </Button>
              
              <Button onClick={handleShare} variant="ghost" size="sm" className="text-gray-600">
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* 文章头图 */}
          <div className="aspect-video relative">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            {/* 文章标题和元信息 */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-600 space-x-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views} 阅读
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {article.rating} 评分
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* 文章正文 */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: processContent(article.content) }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
