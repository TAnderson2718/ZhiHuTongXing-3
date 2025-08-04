'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Video, FileText, Loader2, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import Button from './button'

interface FileUploadProps {
  type: 'image' | 'video' | 'document'
  onUploadSuccess: (fileData: {
    url: string
    filename: string
    originalName: string
    size: number
    type: string
  }) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSize?: number
  className?: string
  multiple?: boolean
  showPreview?: boolean
}

interface UploadFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
}

export default function FileUpload({
  type,
  onUploadSuccess,
  onUploadError,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  multiple = false,
  showPreview = true
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptTypes = () => {
    if (accept) return accept

    switch (type) {
      case 'image':
        return 'image/jpeg,image/png,image/gif,image/webp'
      case 'video':
        return 'video/mp4,video/webm,video/ogg'
      case 'document':
        return 'application/pdf,.doc,.docx'
      default:
        return '*/*'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-gray-400" />
      case 'video':
        return <Video className="w-8 h-8 text-gray-400" />
      case 'document':
        return <FileText className="w-8 h-8 text-gray-400" />
      default:
        return <Upload className="w-8 h-8 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const generateFileId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSize) {
      return { valid: false, error: `文件大小不能超过 ${formatFileSize(maxSize)}` }
    }

    const acceptedTypes = getAcceptTypes().split(',')
    const fileType = file.type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    const isValidType = acceptedTypes.some(acceptType => {
      if (acceptType.startsWith('.')) {
        return fileExtension === acceptType
      }
      return fileType.match(acceptType.replace('*', '.*'))
    })

    if (!isValidType) {
      return { valid: false, error: '不支持的文件类型' }
    }

    return { valid: true }
  }

  const addFilesToQueue = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newUploadFiles: UploadFile[] = []

    for (const file of fileArray) {
      const validation = validateFile(file)
      if (!validation.valid) {
        onUploadError?.(validation.error || '文件验证失败')
        continue
      }

      newUploadFiles.push({
        file,
        id: generateFileId(),
        status: 'pending',
        progress: 0
      })
    }

    if (multiple) {
      setUploadFiles(prev => [...prev, ...newUploadFiles])
    } else {
      setUploadFiles(newUploadFiles)
    }

    // 开始上传
    newUploadFiles.forEach(uploadFile => {
      uploadSingleFile(uploadFile)
    })
  }

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    // 更新状态为上传中
    setUploadFiles(prev => prev.map(f =>
      f.id === uploadFile.id
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ))

    try {
      const formData = new FormData()
      formData.append('files', uploadFile.file)
      formData.append('type', type)

      const xhr = new XMLHttpRequest()

      // 监听上传进度
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadFiles(prev => prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, progress }
              : f
          ))
        }
      })

      // 处理上传完成
      xhr.addEventListener('load', () => {
        try {
          const result = JSON.parse(xhr.responseText)

          if (xhr.status === 200 && result.success) {
            const fileData = result.data[0] // 取第一个文件的数据
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'success', progress: 100, url: fileData.url }
                : f
            ))
            onUploadSuccess(fileData)
          } else {
            const error = result.error || '上传失败'
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'error', error }
                : f
            ))
            onUploadError?.(error)
          }
        } catch (error) {
          console.error('解析响应失败:', error)
          setUploadFiles(prev => prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', error: '上传失败' }
              : f
          ))
          onUploadError?.('上传失败')
        }
      })

      // 处理上传错误
      xhr.addEventListener('error', () => {
        setUploadFiles(prev => prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: '网络错误' }
            : f
        ))
        onUploadError?.('网络错误')
      })

      xhr.open('POST', '/api/upload')
      xhr.send(formData)

    } catch (error) {
      console.error('上传错误:', error)
      setUploadFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? { ...f, status: 'error', error: '上传失败' }
          : f
      ))
      onUploadError?.('上传失败，请重试')
    }
  }

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    const uploadFile = uploadFiles.find(f => f.id === fileId)
    if (uploadFile) {
      uploadSingleFile(uploadFile)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      addFilesToQueue(files)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getFilePreview = (uploadFile: UploadFile) => {
    if (!showPreview) return null

    const { file, url } = uploadFile

    if (type === 'image' && (url || file.type.startsWith('image/'))) {
      const src = url || URL.createObjectURL(file)
      return (
        <img
          src={src}
          alt={file.name}
          className="w-16 h-16 object-cover rounded"
          onLoad={() => {
            if (!url) URL.revokeObjectURL(src)
          }}
        />
      )
    }

    if (type === 'video' && (url || file.type.startsWith('video/'))) {
      const src = url || URL.createObjectURL(file)
      return (
        <video
          src={src}
          className="w-16 h-16 object-cover rounded"
          muted
          onLoadedData={() => {
            if (!url) URL.revokeObjectURL(src)
          }}
        />
      )
    }

    return (
      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  const isUploading = uploadFiles.some(f => f.status === 'uploading')

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={isUploading}
      />

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center">
          {getIcon()}
          <p className="mt-2 text-sm text-gray-600">
            点击选择文件或拖拽文件到此处
          </p>
          <p className="text-xs text-gray-400 mt-1">
            支持 {getAcceptTypes().split(',').join(', ')} 格式
          </p>
          <p className="text-xs text-gray-400">
            最大文件大小: {formatFileSize(maxSize)}
            {multiple && ' | 支持批量上传'}
          </p>
        </div>
      </div>

      {/* 文件列表 */}
      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadFiles.map((uploadFile) => (
            <div key={uploadFile.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {/* 文件预览 */}
              {getFilePreview(uploadFile)}

              {/* 文件信息 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadFile.file.size)}
                </p>

                {/* 进度条 */}
                {uploadFile.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadFile.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadFile.progress}%</p>
                  </div>
                )}

                {/* 错误信息 */}
                {uploadFile.status === 'error' && uploadFile.error && (
                  <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                )}
              </div>

              {/* 状态图标和操作 */}
              <div className="flex items-center space-x-2">
                {uploadFile.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}

                {uploadFile.status === 'error' && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryUpload(uploadFile.id)}
                      className="text-xs"
                    >
                      重试
                    </Button>
                  </div>
                )}

                {uploadFile.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}

                {uploadFile.url && showPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(uploadFile.url, '_blank')}
                    title="预览文件"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadFile.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
