'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Video,
  Image as ImageIcon,
  Upload,
  X,
  Play,
  ExternalLink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
  Eye,
  Settings,
  Type,
  Palette,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
// Explicit import for Video icon to fix potential import issues
import { Video as VideoIcon } from 'lucide-react'
import Button from './button'
import Input from './Input'
import FileUpload from './FileUpload'
import { parseVideoUrl, generateVideoEmbedHtml, getSupportedPlatforms } from '@/lib/video-platforms'

interface EnhancedRichTextEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  showToolbar?: boolean
  enableFileUpload?: boolean
  enableVideoEmbed?: boolean
  enablePreview?: boolean
  autoSave?: boolean
  autoSaveInterval?: number
  onAutoSave?: (content: string) => void
}

export default function EnhancedRichTextEditor({
  content,
  onChange,
  className = '',
  placeholder = '开始编写内容...',
  minHeight = 300,
  maxHeight = 600,
  showToolbar = true,
  enableFileUpload = true,
  enableVideoEmbed = true,
  enablePreview = true,
  autoSave = false,
  autoSaveInterval = 30000,
  onAutoSave
}: EnhancedRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentViewMode, setCurrentViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [videoData, setVideoData] = useState({
    url: '',
    title: '',
    useUpload: false
  })
  const [imageData, setImageData] = useState({
    url: '',
    alt: '',
    useUpload: false
  })
  const [history, setHistory] = useState<string[]>([content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isUserTyping, setIsUserTyping] = useState(false)

  // 自动保存功能
  useEffect(() => {
    if (autoSave && onAutoSave) {
      const interval = setInterval(() => {
        if (content && content !== history[historyIndex]) {
          onAutoSave(content)
          setLastSaved(new Date())
        }
      }, autoSaveInterval)

      return () => clearInterval(interval)
    }
  }, [autoSave, onAutoSave, content, autoSaveInterval, history, historyIndex])

  // 历史记录管理
  const addToHistory = useCallback((newContent: string) => {
    if (newContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [history, historyIndex])

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousContent = history[newIndex]
      onChange(previousContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent
      }
    }
  }, [historyIndex, history, onChange])

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextContent = history[newIndex]
      onChange(nextContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent
      }
    }
  }, [historyIndex, history, onChange])

  // 格式化文本
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      addToHistory(newContent)
    }
  }

  // 插入视频
  const insertVideo = () => {
    if (!videoData.url || !videoData.title) return

    let videoHtml = ''

    // 检查是否为支持的视频平台链接
    const videoInfo = parseVideoUrl(videoData.url)
    if (videoInfo) {
      // 使用平台嵌入代码
      videoHtml = generateVideoEmbedHtml(videoInfo, {
        title: videoData.title,
        width: 800,
        height: 450
      })
    } else {
      // 使用自定义视频播放器
      videoHtml = `
        <div class="video-container" data-video-id="${Date.now()}">
          <video-player 
            src="${videoData.url}"
            title="${videoData.title}"
            poster="https://picsum.photos/seed/video/800/450"
          ></video-player>
        </div>
      `
    }

    insertHtmlAtCursor(videoHtml)
    setVideoData({ url: '', title: '', useUpload: false })
    setShowVideoModal(false)
  }

  // 插入图片
  const insertImage = () => {
    if (!imageData.url) return

    const imgHtml = `
      <div class="image-container">
        <img 
          src="${imageData.url}" 
          alt="${imageData.alt || '图片'}"
          style="max-width: 100%; height: auto; border-radius: 8px;"
        />
        ${imageData.alt ? `<p class="image-caption">${imageData.alt}</p>` : ''}
      </div>
    `

    insertHtmlAtCursor(imgHtml)
    setImageData({ url: '', alt: '', useUpload: false })
    setShowImageModal(false)
  }

  // 在光标位置插入HTML
  const insertHtmlAtCursor = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const element = document.createElement('div')
        element.innerHTML = html
        range.insertNode(element)
      } else {
        editorRef.current.innerHTML += html
      }
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
      addToHistory(newContent)
    }
  }

  // 切换全屏模式
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // 获取预览模式的样式
  const getPreviewStyles = () => {
    const baseStyles = {
      width: '100%',
      transition: 'all 0.3s ease',
    }

    switch (currentViewMode) {
      case 'mobile':
        return { ...baseStyles, maxWidth: '375px', margin: '0 auto' }
      case 'tablet':
        return { ...baseStyles, maxWidth: '768px', margin: '0 auto' }
      default:
        return baseStyles
    }
  }

  // 保存和恢复光标位置
  const saveCursorPosition = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0)
    }
    return null
  }

  const restoreCursorPosition = (range: Range) => {
    const selection = window.getSelection()
    if (selection && range) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // 处理内容变化
  const handleContentChange = () => {
    if (editorRef.current) {
      setIsUserTyping(true)
      const newContent = editorRef.current.innerHTML
      onChange(newContent)

      // 延迟添加到历史记录，避免频繁更新
      setTimeout(() => {
        addToHistory(newContent)
        setIsUserTyping(false)
      }, 1000)
    }
  }

  // 处理文件上传成功
  const handleVideoUploadSuccess = (fileData: any) => {
    setVideoData(prev => ({ ...prev, url: fileData.url }))
  }

  const handleImageUploadSuccess = (fileData: any) => {
    setImageData(prev => ({ ...prev, url: fileData.url }))
  }

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = content || ''
    }
  }, [])

  // 同步外部内容变化到编辑器（避免用户输入时的冲突）
  useEffect(() => {
    if (editorRef.current && !isUserTyping) {
      const currentContent = editorRef.current.innerHTML
      if (currentContent !== content) {
        const savedRange = saveCursorPosition()
        editorRef.current.innerHTML = content
        if (savedRange) {
          // 延迟恢复光标位置，确保DOM更新完成
          setTimeout(() => {
            restoreCursorPosition(savedRange)
          }, 0)
        }
      }
    }
  }, [content, isUserTyping])

  const supportedPlatforms = getSupportedPlatforms()

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'border border-gray-300 rounded-lg'} ${className}`}>
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-1">
            {/* 撤销重做 */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="撤销"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="重做"
            >
              <Redo className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* 文本格式 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="粗体"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="斜体"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          title="下划线"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 对齐方式 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyLeft')}
          title="左对齐"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyCenter')}
          title="居中对齐"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyRight')}
          title="右对齐"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 列表 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          title="无序列表"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertOrderedList')}
          title="有序列表"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        {/* 引用和代码 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'blockquote')}
          title="引用"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('formatBlock', 'pre')}
          title="代码块"
        >
          <Code className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 链接和媒体 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('请输入链接地址:')
            if (url) formatText('createLink', url)
          }}
          title="插入链接"
        >
          <Link2 className="w-4 h-4" />
        </Button>

        {enableVideoEmbed && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowVideoModal(true)}
            title="插入视频"
          >
            <VideoIcon className="w-4 h-4" />
          </Button>
        )}

        {enableFileUpload && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageModal(true)}
            title="插入图片"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 右侧控制区 */}
      <div className="flex items-center space-x-1">
        {enablePreview && (
          <>
            {/* 预览模式切换 */}
            <div className="flex items-center space-x-1 mr-2">
              <Button
                type="button"
                variant={currentViewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentViewMode('desktop')}
                title="桌面预览"
              >
                <Monitor className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant={currentViewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentViewMode('tablet')}
                title="平板预览"
              >
                <Tablet className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant={currentViewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentViewMode('mobile')}
                title="手机预览"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant={showPreview ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title="预览模式"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          title={isFullscreen ? '退出全屏' : '全屏编辑'}
        >
          <Settings className="w-4 h-4" />
        </Button>

        {autoSave && lastSaved && (
          <span className="text-xs text-gray-500 ml-2">
            已保存 {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  )}

      {/* 编辑器内容区 */}
      <div className="flex-1 flex" style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}>
        {/* 编辑模式 */}
        {!showPreview && (
          <div
            ref={editorRef}
            contentEditable
            className="flex-1 p-4 focus:outline-none overflow-y-auto"
            onInput={handleContentChange}
            onKeyDown={(e) => {
              // 快捷键支持
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 'z':
                    e.preventDefault()
                    if (e.shiftKey) {
                      redo()
                    } else {
                      undo()
                    }
                    break
                  case 'b':
                    e.preventDefault()
                    formatText('bold')
                    break
                  case 'i':
                    e.preventDefault()
                    formatText('italic')
                    break
                  case 'u':
                    e.preventDefault()
                    formatText('underline')
                    break
                }
              }
            }}
            placeholder={placeholder}
            style={{
              minHeight: `${minHeight - 60}px`,
              maxHeight: `${maxHeight - 60}px`,
              whiteSpace: 'pre-wrap'
            }}
          />
        )}

        {/* 预览模式 */}
        {showPreview && (
          <div
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
            style={getPreviewStyles()}
          >
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>

      {/* 视频插入模态框 */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">插入视频</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* 上传方式选择 */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!videoData.useUpload}
                    onChange={() => setVideoData(prev => ({ ...prev, useUpload: false }))}
                    className="mr-2"
                  />
                  链接嵌入
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={videoData.useUpload}
                    onChange={() => setVideoData(prev => ({ ...prev, useUpload: true }))}
                    className="mr-2"
                  />
                  文件上传
                </label>
              </div>

              {videoData.useUpload ? (
                <FileUpload
                  type="video"
                  onUploadSuccess={handleVideoUploadSuccess}
                  onUploadError={(error) => alert(error)}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频地址
                  </label>
                  <Input
                    type="url"
                    value={videoData.url}
                    onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/video.mp4 或平台链接"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    支持平台: {supportedPlatforms.map(p => p.name).join(', ')}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  视频标题
                </label>
                <Input
                  type="text"
                  value={videoData.title}
                  onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入视频标题"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowVideoModal(false)}
              >
                取消
              </Button>
              <Button
                onClick={insertVideo}
                disabled={!videoData.url || !videoData.title}
                className="bg-blue-600 hover:bg-blue-700"
              >
                插入视频
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 图片插入模态框 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">插入图片</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* 上传方式选择 */}
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!imageData.useUpload}
                    onChange={() => setImageData(prev => ({ ...prev, useUpload: false }))}
                    className="mr-2"
                  />
                  链接嵌入
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={imageData.useUpload}
                    onChange={() => setImageData(prev => ({ ...prev, useUpload: true }))}
                    className="mr-2"
                  />
                  文件上传
                </label>
              </div>

              {imageData.useUpload ? (
                <FileUpload
                  type="image"
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={(error) => alert(error)}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片地址
                  </label>
                  <Input
                    type="url"
                    value={imageData.url}
                    onChange={(e) => setImageData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片描述 (可选)
                </label>
                <Input
                  type="text"
                  value={imageData.alt}
                  onChange={(e) => setImageData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="请输入图片描述"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowImageModal(false)}
              >
                取消
              </Button>
              <Button
                onClick={insertImage}
                disabled={!imageData.url}
                className="bg-blue-600 hover:bg-blue-700"
              >
                插入图片
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
