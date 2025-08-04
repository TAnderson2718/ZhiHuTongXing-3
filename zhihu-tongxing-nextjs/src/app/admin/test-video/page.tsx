'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/Input'
import { parseVideoUrl, generateVideoEmbedHtml, getSupportedPlatforms } from '@/lib/video-platforms'
import { useAdminAuth } from '@/hooks/useAdminAuth'

export default function TestVideoPage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const [videoUrl, setVideoUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [embedHtml, setEmbedHtml] = useState('')
  const [error, setError] = useState('')

  const testUrls = [
    'https://www.bilibili.com/video/BV1xx411c7mu',
    'https://v.qq.com/x/cover/mzc00200mp8vo9b/u0041aa087j.html',
    'https://v.youku.com/v_show/id_XNDkzNjQxNjY4MA==.html',
    'https://www.iqiyi.com/v_19rr7aqk45.html'
  ]

  const handleParseVideo = () => {
    setError('')
    setVideoInfo(null)
    setEmbedHtml('')

    if (!videoUrl.trim()) {
      setError('请输入视频链接')
      return
    }

    const info = parseVideoUrl(videoUrl.trim())
    if (info) {
      setVideoInfo(info)
      const html = generateVideoEmbedHtml(info, {
        width: 800,
        height: 450,
        title: '测试视频'
      })
      setEmbedHtml(html)
    } else {
      setError('不支持的视频平台或URL格式错误')
    }
  }

  const supportedPlatforms = getSupportedPlatforms()

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录管理员账户</p>
          <Button onClick={() => window.location.href = '/admin/login'}>
            前往登录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">第三方视频平台集成测试</h1>
          <p className="text-gray-600 mt-2">测试腾讯视频、优酷、B站等平台的视频链接解析和嵌入功能</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：测试输入 */}
          <div className="space-y-6">
            {/* URL输入 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">视频链接测试</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频链接
                  </label>
                  <Input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="粘贴视频链接..."
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={handleParseVideo}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  解析视频
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* 测试链接 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">测试链接</h3>
              <div className="space-y-2">
                {testUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setVideoUrl(url)}
                    className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </Card>

            {/* 支持的平台 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">支持的平台</h3>
              <div className="grid grid-cols-1 gap-3">
                {supportedPlatforms.map((platform) => (
                  <div 
                    key={platform.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{platform.name}</div>
                      <div className="text-sm text-gray-500">
                        {platform.domains.join(', ')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {platform.supportedFeatures.autoplay ? '自动播放' : ''}
                      {platform.supportedFeatures.fullscreen ? ' 全屏' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 右侧：解析结果 */}
          <div className="space-y-6">
            {/* 视频信息 */}
            {videoInfo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">解析结果</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">平台：</span>
                    <span className="ml-2 text-gray-900">{videoInfo.platform}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">视频ID：</span>
                    <span className="ml-2 text-gray-900 font-mono text-sm">{videoInfo.videoId}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">嵌入链接：</span>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono break-all">
                      {videoInfo.embedUrl}
                    </div>
                  </div>
                  {videoInfo.thumbnail && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">缩略图：</span>
                      <div className="mt-2">
                        <img 
                          src={videoInfo.thumbnail} 
                          alt="视频缩略图"
                          className="w-32 h-20 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 嵌入代码 */}
            {embedHtml && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">生成的嵌入代码</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML代码
                    </label>
                    <textarea
                      value={embedHtml}
                      readOnly
                      className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      预览效果
                    </label>
                    <div 
                      className="border border-gray-300 rounded-md p-4 bg-white"
                      dangerouslySetInnerHTML={{ __html: embedHtml }}
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
