'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface AssessmentTool {
  id: string
  name: string
  type: string
  description: string
  ageRange: string
  questions: number
  completions: number
  status: string
  lastUpdated: string
  category?: string
  difficulty?: string
  estimatedTime?: string
}

export default function TestPublishButtonPage() {
  const [assessmentTools, setAssessmentTools] = useState<AssessmentTool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // 从API获取评估工具列表
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/assessments', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('API响应数据:', data)
          
          if (data.assessments) {
            // 确保每个工具都有status字段
            const toolsWithStatus = data.assessments.map((tool: any) => ({
              ...tool,
              status: tool.status || (tool.isActive ? 'active' : 'draft')
            }))
            console.log('处理后的工具数据:', toolsWithStatus)
            setAssessmentTools(toolsWithStatus)
          } else {
            setError(data.error || '获取评估工具列表失败')
          }
        } else {
          const errorData = await response.json()
          setError(errorData.error || '获取评估工具列表失败')
        }
      } catch (err) {
        console.error('Error fetching assessments:', err)
        setError('网络错误，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  // 切换评估工具状态
  const toggleAssessmentStatus = async (toolId: string, currentStatus: string) => {
    console.log('切换状态:', { toolId, currentStatus })
    setUpdatingStatus(toolId)
    try {
      const newStatus = currentStatus === 'draft' ? 'active' : 'draft'

      const response = await fetch('/api/admin/assessments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: toolId,
          status: newStatus
        })
      })

      if (response.ok) {
        // 更新本地状态
        setAssessmentTools(prev => prev.map(tool =>
          tool.id === toolId
            ? { ...tool, status: newStatus }
            : tool
        ))
        console.log('状态更新成功:', { toolId, newStatus })
      } else {
        const error = await response.json()
        console.error('状态更新失败:', error)
        alert(error.error || '状态更新失败')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('网络错误，请重试')
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">加载失败</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">发布按钮功能测试</h1>
        
        {/* 调试信息 */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">🔧 调试信息</h2>
          <div className="text-sm text-blue-700 space-y-2">
            <p>评估工具数量: {assessmentTools.length}</p>
            <p>已发布: {assessmentTools.filter(tool => tool.status === 'active').length}</p>
            <p>草稿: {assessmentTools.filter(tool => tool.status === 'draft').length}</p>
            <p>数据加载状态: {loading ? '加载中' : '已完成'}</p>
          </div>
        </Card>

        {/* 评估工具列表 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">评估工具列表</h2>
          
          <div className="space-y-4">
            {assessmentTools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">类型: {tool.type}</span>
                    <span className="text-xs text-gray-500">年龄: {tool.ageRange}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tool.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tool.status === 'active' ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAssessmentStatus(tool.id, tool.status)}
                    disabled={updatingStatus === tool.id}
                    className={tool.status === 'draft'
                      ? "text-green-600 border-green-600 hover:bg-green-50"
                      : "text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    }
                    title={`当前状态: ${tool.status}, 点击${tool.status === 'draft' ? '发布' : '取消发布'}`}
                  >
                    {updatingStatus === tool.id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : tool.status === 'draft' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        发布
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        取消发布
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {assessmentTools.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无评估工具</p>
            </div>
          )}
        </Card>

        {/* 原始数据显示 */}
        <Card className="p-6 mt-8 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">原始数据</h2>
          <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-96">
            {JSON.stringify(assessmentTools, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  )
}
