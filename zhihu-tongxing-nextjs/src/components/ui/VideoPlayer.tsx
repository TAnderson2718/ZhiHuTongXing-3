'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  Settings,
  Loader2
} from 'lucide-react'
import { Video } from '@/types/video'
import Button from './button'

interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
  controls?: boolean
  width?: number | string
  height?: number | string
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export default function VideoPlayer({
  video,
  autoplay = false,
  controls = true,
  width = '100%',
  height = 'auto',
  className = '',
  onPlay,
  onPause,
  onEnded
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleError = () => {
      setError('视频加载失败')
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('timeupdate', handleTimeUpdate)
    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)
    videoElement.addEventListener('ended', handleEnded)
    videoElement.addEventListener('error', handleError)
    videoElement.addEventListener('loadstart', handleLoadStart)

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
      videoElement.removeEventListener('ended', handleEnded)
      videoElement.removeEventListener('error', handleError)
      videoElement.removeEventListener('loadstart', handleLoadStart)
    }
  }, [onPlay, onPause, onEnded])

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.muted = !videoElement.muted
    setIsMuted(videoElement.muted)
  }

  const handleVolumeChange = (newVolume: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (newTime: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleFullscreen = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoElement.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height: height === 'auto' ? '300px' : height }}
      >
        <div className="text-center text-gray-600">
          <div className="text-red-500 mb-2">⚠️</div>
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              setError(null)
              setIsLoading(true)
              videoRef.current?.load()
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay={autoplay}
        muted={autoplay} // 自动播放时必须静音
        poster={video.thumbnailUrl}
        preload="metadata"
      >
        <source src={video.url} type={`video/${video.format}`} />
        您的浏览器不支持视频播放。
      </video>

      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>加载中...</p>
          </div>
        </div>
      )}

      {/* 播放按钮覆盖层 */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full p-4"
            onClick={togglePlay}
          >
            <Play className="w-8 h-8" />
          </Button>
        </div>
      )}

      {/* 控制栏 */}
      {controls && showControls && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* 进度条 */}
          <div className="mb-3">
            <div className="relative">
              <div className="w-full h-1 bg-gray-600 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              {/* 播放/暂停 */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              {/* 音量控制 */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? 
                    <VolumeX className="w-4 h-4" /> : 
                    <Volume2 className="w-4 h-4" />
                  }
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-16 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* 时间显示 */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* 设置按钮（预留） */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                onClick={() => {/* 预留设置功能 */}}
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* 全屏按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 视频信息覆盖层 */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black bg-opacity-50 text-white p-2 rounded">
          <h3 className="font-medium text-sm">{video.title}</h3>
          {video.description && (
            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
