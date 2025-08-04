'use client'

import React, { Component, ReactNode } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 检查是否是ChunkLoadError
    const isChunkError = error.name === 'ChunkLoadError' || 
                        error.message.includes('Loading chunk') ||
                        error.message.includes('Loading CSS chunk')
    
    return {
      hasError: true,
      error: isChunkError ? error : error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 记录错误到监控系统
    console.error('ChunkErrorBoundary caught an error:', error, errorInfo)
    
    // 如果是ChunkLoadError，自动尝试刷新页面
    if (error.name === 'ChunkLoadError' || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk')) {
      
      // 延迟刷新，给用户看到错误信息的时间
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message.includes('Loading chunk') ||
                          this.state.error?.message.includes('Loading CSS chunk')

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isChunkError ? '页面资源加载失败' : '页面出现错误'}
              </h2>
              <p className="text-gray-600 mb-6">
                {isChunkError 
                  ? '页面正在自动刷新，请稍候...' 
                  : '抱歉，页面遇到了一些问题'
                }
              </p>
            </div>

            {isChunkError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mr-2"></div>
                  <span className="text-sm text-gray-500">正在重新加载...</span>
                </div>
                <button
                  onClick={this.handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  立即刷新
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors mr-3"
                >
                  重试
                </button>
                <button
                  onClick={this.handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新页面
                </button>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  查看错误详情
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 overflow-auto">
                  <div className="mb-2">
                    <strong>错误信息:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>错误类型:</strong> {this.state.error.name}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>错误堆栈:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ChunkErrorBoundary
