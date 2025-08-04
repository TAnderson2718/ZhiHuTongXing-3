'use client'

import { useState } from 'react'
import { X, Upload, Video } from 'lucide-react'
import Button from './button'
import Input from './Input'
import FileUpload from './FileUpload'
import { VideoCategory, VIDEO_CATEGORIES } from '@/types/video'

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function VideoUploadModal({
  isOpen,
  onClose,
  onSuccess
}: VideoUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'info'>('upload')
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [videoInfo, setVideoInfo] = useState({
    title: '',
    description: '',
    category: 'education' as VideoCategory,
    tags: '',
    visibility: 'public' as 'public' | 'private'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFileUpload = (fileData: any) => {
    setUploadedFile(fileData)
    setVideoInfo(prev => ({
      ...prev,
      title: fileData.originalName.replace(/\.[^/.]+$/, '') // 移除文件扩展名
    }))
    setStep('info')
  }

  const handleSubmit = async () => {
    if (!uploadedFile || !videoInfo.title || !videoInfo.category) {
      alert('请填写完整的视频信息')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: videoInfo.title,
          description: videoInfo.description,
          category: videoInfo.category,
          tags: videoInfo.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          visibility: videoInfo.visibility,
          fileData: uploadedFile
        })
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
        handleClose()
      } else {
        alert(data.error || '创建视频失败')
      }
    } catch (error) {
      console.error('Submit video error:', error)
      alert('创建视频失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep('upload')
    setUploadedFile(null)
    setVideoInfo({
      title: '',
      description: '',
      category: 'education',
      tags: '',
      visibility: 'public'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'upload' ? '上传视频' : '视频信息'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择视频文件</h3>
                <p className="text-gray-600">
                  支持 MP4、WebM、OGG 格式，最大 50MB
                </p>
              </div>

              <FileUpload
                type="video"
                onUploadSuccess={handleFileUpload}
                onUploadError={(error) => alert(error)}
                accept="video/mp4,video/webm,video/ogg"
                maxSize={50 * 1024 * 1024} // 50MB
                className="border-2 border-dashed border-gray-300 rounded-lg p-8"
              />

              <div className="text-sm text-gray-500 space-y-1">
                <p>• 建议分辨率：1920x1080 或 1280x720</p>
                <p>• 建议时长：不超过 10 分钟</p>
                <p>• 支持格式：MP4（推荐）、WebM、OGG</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 已上传文件信息 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      文件上传成功
                    </p>
                    <p className="text-sm text-green-600">
                      {uploadedFile?.originalName} ({(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* 视频信息表单 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频标题 *
                  </label>
                  <Input
                    type="text"
                    value={videoInfo.title}
                    onChange={(e) => setVideoInfo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="输入视频标题"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频描述
                  </label>
                  <textarea
                    value={videoInfo.description}
                    onChange={(e) => setVideoInfo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入视频描述（可选）"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      分类 *
                    </label>
                    <select
                      value={videoInfo.category}
                      onChange={(e) => setVideoInfo(prev => ({ ...prev, category: e.target.value as VideoCategory }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(VIDEO_CATEGORIES).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      可见性
                    </label>
                    <select
                      value={videoInfo.visibility}
                      onChange={(e) => setVideoInfo(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">公开</option>
                      <option value="private">私有</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <Input
                    type="text"
                    value={videoInfo.tags}
                    onChange={(e) => setVideoInfo(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="输入标签，用逗号分隔（如：教育,育儿,健康）"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    用逗号分隔多个标签
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            取消
          </Button>

          {step === 'info' && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep('upload')}
                disabled={isSubmitting}
              >
                重新上传
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !videoInfo.title || !videoInfo.category}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? '创建中...' : '创建视频'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
