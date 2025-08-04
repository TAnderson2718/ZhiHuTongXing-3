'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Download, Calendar, User, Activity, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { 
  OperationLog, 
  OperationLogQuery, 
  OperationLogPaginatedResponse,
  OperationType,
  UserRole,
  OperationResult
} from '@/types/operation-log'

export default function OperationLogsPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const [logs, setLogs] = useState<OperationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // 筛选和搜索状态
  const [filters, setFilters] = useState<OperationLogQuery>({
    page: 1,
    limit: 20,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  })
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // 获取操作日志
  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/operation-logs?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setLogs(data.data.logs)
        setPagination(data.data.pagination)
      } else {
        setError(data.error || '获取操作日志失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Error fetching operation logs:', err)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和筛选变化时重新获取数据
  useEffect(() => {
    if (!authLoading && user) {
      fetchLogs()
    }
  }, [filters, authLoading, user])

  // 处理搜索
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      searchKeyword,
      page: 1
    }))
  }

  // 处理筛选器变化
  const handleFilterChange = (key: keyof OperationLogQuery, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  // 导出操作日志
  const handleExport = async (format: 'json' | 'csv' = 'csv') => {
    try {
      const response = await fetch('/api/admin/operation-logs/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: filters,
          format
        })
      })

      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `operation-logs-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        if (data.success) {
          const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `operation-logs-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      }
    } catch (err) {
      console.error('Export error:', err)
      alert('导出失败，请稍后重试')
    }
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  // 获取操作类型的中文名称
  const getOperationTypeName = (type: OperationType) => {
    const typeNames: Record<OperationType, string> = {
      [OperationType.LOGIN]: '登录',
      [OperationType.LOGOUT]: '登出',
      [OperationType.REGISTER]: '注册',
      [OperationType.PASSWORD_CHANGE]: '修改密码',
      [OperationType.PASSWORD_RESET]: '重置密码',
      [OperationType.USER_CREATE]: '创建用户',
      [OperationType.USER_UPDATE]: '更新用户',
      [OperationType.USER_DELETE]: '删除用户',
      [OperationType.USER_ACTIVATE]: '激活用户',
      [OperationType.USER_DEACTIVATE]: '停用用户',
      [OperationType.ARTICLE_CREATE]: '创建文章',
      [OperationType.ARTICLE_UPDATE]: '更新文章',
      [OperationType.ARTICLE_DELETE]: '删除文章',
      [OperationType.ARTICLE_PUBLISH]: '发布文章',
      [OperationType.ARTICLE_UNPUBLISH]: '取消发布文章',
      [OperationType.ASSESSMENT_CREATE]: '创建评估',
      [OperationType.ASSESSMENT_UPDATE]: '更新评估',
      [OperationType.ASSESSMENT_DELETE]: '删除评估',
      [OperationType.ASSESSMENT_TAKE]: '参与评估',
      [OperationType.DISCUSSION_CREATE]: '创建讨论',
      [OperationType.DISCUSSION_UPDATE]: '更新讨论',
      [OperationType.DISCUSSION_DELETE]: '删除讨论',
      [OperationType.REPLY_CREATE]: '创建回复',
      [OperationType.REPLY_UPDATE]: '更新回复',
      [OperationType.REPLY_DELETE]: '删除回复',
      [OperationType.SETTINGS_UPDATE]: '更新设置',
      [OperationType.SYSTEM_CONFIG_UPDATE]: '更新系统配置',
      [OperationType.FILE_UPLOAD]: '文件上传',
      [OperationType.FILE_DELETE]: '文件删除',
      [OperationType.SECURITY_VIOLATION]: '安全违规',
      [OperationType.SUSPICIOUS_ACTIVITY]: '可疑活动',
      [OperationType.DATA_EXPORT]: '数据导出',
      [OperationType.DATA_IMPORT]: '数据导入',
      [OperationType.BACKUP_CREATE]: '创建备份',
      [OperationType.BACKUP_RESTORE]: '恢复备份'
    }
    return typeNames[type] || type
  }

  // 获取用户角色的中文名称
  const getUserRoleName = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.ADMIN]: '管理员',
      [UserRole.USER]: '用户',
      [UserRole.GUEST]: '访客'
    }
    return roleNames[role] || role
  }

  // 获取操作结果的图标和样式
  const getResultIcon = (result: OperationResult) => {
    switch (result) {
      case OperationResult.SUCCESS:
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case OperationResult.FAILURE:
        return <XCircle className="w-4 h-4 text-red-500" />
      case OperationResult.PARTIAL_SUCCESS:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">请先登录管理员账户</p>
          <a href="/admin/login" className="text-blue-600 hover:underline">
            前往登录
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">操作日志</h1>
          <p className="text-gray-600">查看和管理系统操作日志</p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜索操作描述、用户名或目标资源..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                搜索
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
            </div>
          </div>

          {/* 筛选器 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 操作类型筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">操作类型</label>
                  <select
                    value={filters.operationType || ''}
                    onChange={(e) => handleFilterChange('operationType', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">全部</option>
                    {Object.values(OperationType).map(type => (
                      <option key={type} value={type}>
                        {getOperationTypeName(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 用户角色筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户角色</label>
                  <select
                    value={filters.userRole || ''}
                    onChange={(e) => handleFilterChange('userRole', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">全部</option>
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>
                        {getUserRoleName(role)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 操作结果筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">操作结果</label>
                  <select
                    value={filters.result || ''}
                    onChange={(e) => handleFilterChange('result', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">全部</option>
                    <option value={OperationResult.SUCCESS}>成功</option>
                    <option value={OperationResult.FAILURE}>失败</option>
                    <option value={OperationResult.PARTIAL_SUCCESS}>部分成功</option>
                  </select>
                </div>

                {/* 日期范围 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* 操作日志表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">暂无操作日志</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作描述
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        目标资源
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        结果
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP地址
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {log.username || '未知用户'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getUserRoleName(log.userRole)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getOperationTypeName(log.operationType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {log.operationDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.targetResource || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getResultIcon(log.result)}
                            <span className="ml-2 text-sm text-gray-900">
                              {log.result === OperationResult.SUCCESS ? '成功' :
                               log.result === OperationResult.FAILURE ? '失败' : '部分成功'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        上一页
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        下一页
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          显示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 到{' '}
                          <span className="font-medium">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                          </span>{' '}
                          条，共 <span className="font-medium">{pagination.total}</span> 条记录
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            上一页
                          </button>
                          
                          {/* 页码按钮 */}
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pageNum === pagination.page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                          
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            下一页
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
