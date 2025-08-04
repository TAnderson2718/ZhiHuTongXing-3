'use client'

import { useState } from 'react'
import { X, Video, Link, Upload, Play, ExternalLink } from 'lucide-react'
import Button from './button'
import Input from './Input'
import { 
  parseVideoUrl, 
  generateEmbedCode, 
  getSupportedPlatforms,
  VideoInfo 
} from '@/lib/video-platform-parser'

interface VideoInsertModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (embedCode: string) => void
}

export default function VideoInsertModal({
  isOpen,
  onClose,
  onInsert
}: VideoInsertModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [embedOptions, setEmbedOptions] = useState({
    width: '100%',
    height: '400',
    autoplay: false,
    allowFullscreen: true
  })

  if (!isOpen) return null

  const handleUrlChange = (url: string) => {
    setVideoUrl(url)
    setError(null)
    
    if (url.trim()) {
      const info = parseVideoUrl(url.trim())
      if (info) {
        setVideoInfo(info)
      } else {
        setVideoInfo(null)
        setError('不支持的视频平台或URL格式错误')
      }
    } else {
      setVideoInfo(null)
    }
  }

  const handleInsert = () => {
    if (!videoInfo) {
      setError('请输入有效的视频链接')
      return
    }

    const embedCode = generateEmbedCode(videoInfo, embedOptions)
    onInsert(embedCode)
    handleClose()
  }

  const handleClose = () => {
    setVideoUrl('')
    setVideoInfo(null)
    setError(null)
    setActiveTab('url')
    onClose()
  }

  const supportedPlatforms = getSupportedPlatforms()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">插入视频</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'url'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              第三方视频链接
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              上传本地视频
            </button>
          </nav>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {activeTab === 'url' ? (
            <div className="space-y-6">
              {/* URL输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频链接
                </label>
                <Input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="粘贴腾讯视频、优酷、B站等视频链接..."
                  className="w-full"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              {/* 支持的平台 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">支持的视频平台</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {supportedPlatforms.map((platform) => (
                    <div 
                      key={platform.key}
                      className="flex items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <Video className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {platform.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {platform.domains[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 视频预览 */}
              {videoInfo && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">视频预览</h3>
                  <div className="flex items-start space-x-4">
                    {videoInfo.thumbnail && (
                      <img
                        src={videoInfo.thumbnail}
                        alt="视频缩略图"
                        className="w-24 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {videoInfo.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {videoInfo.videoId}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                        <a 
                          href={videoInfo.originalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 truncate"
                        >
                          {videoInfo.originalUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 嵌入选项 */}
              {videoInfo && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">嵌入选项</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">宽度</label>
                      <Input
                        type="text"
                        value={embedOptions.width}
                        onChange={(e) => setEmbedOptions(prev => ({ ...prev, width: e.target.value }))}
                        placeholder="100% 或 640"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">高度</label>
                      <Input
                        type="text"
                        value={embedOptions.height}
                        onChange={(e) => setEmbedOptions(prev => ({ ...prev, height: e.target.value }))}
                        placeholder="400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={embedOptions.autoplay}
                        onChange={(e) => setEmbedOptions(prev => ({ ...prev, autoplay: e.target.checked }))}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-600">自动播放</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={embedOptions.allowFullscreen}
                        onChange={(e) => setEmbedOptions(prev => ({ ...prev, allowFullscreen: e.target.checked }))}
                        className="rounded border-gray-300 mr-2"
                      />
                      <span className="text-sm text-gray-600">允许全屏</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">上传本地视频</h3>
              <p className="text-gray-600 mb-4">
                此功能将跳转到视频管理页面进行上传
              </p>
              <Button
                onClick={() => {
                  window.open('/admin/videos', '_blank')
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Video className="w-4 h-4 mr-2" />
                前往视频管理
              </Button>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            取消
          </Button>

          {activeTab === 'url' && (
            <Button
              onClick={handleInsert}
              disabled={!videoInfo}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              插入视频
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
