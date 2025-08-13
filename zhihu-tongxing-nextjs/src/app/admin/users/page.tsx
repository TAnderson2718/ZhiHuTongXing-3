'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from "@/components/ui/Input"
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  Ban,
  Key,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Modal from "@/components/ui/Modal"
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'banned'
  registeredAt: string
  lastLogin: string
  assessmentCount: number
  articleCount: number
}

// 用户数据将从API动态获取

// 重置密码相关的接口
interface ResetPasswordResult {
  temporaryPassword: string
  targetUser: {
    id: string
    name: string
    email: string
  }
  resetTime: string
  logId: string
}

export default function AdminUsersPage() {
  const { user: adminUser, loading: authLoading } = useAdminAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // 从API获取用户列表
  useEffect(() => {
    if (adminUser) {
      fetchUsers()
    }
  }, [adminUser, searchQuery, filterRole, filterStatus, pagination.page])

  const fetchUsers = async () => {
    try {
      setIsLoadingData(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filterRole !== 'all' && { role: filterRole }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsers(data.data.users || [])
          setPagination(prev => ({
            ...prev,
            total: data.data.pagination.total,
            totalPages: data.data.pagination.totalPages
          }))
        } else {
          setError(data.error || '获取用户列表失败')
        }
      } else {
        setError('获取用户列表失败')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoadingData(false)
    }
  }

  // 重置密码相关状态
  const [showResetModal, setShowResetModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [resetResult, setResetResult] = useState<ResetPasswordResult | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-yellow-600 bg-yellow-100'
      case 'banned': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100'
      case 'user': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : user
    ))
  }

  // 重置密码相关函数
  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setShowResetModal(true)
    setResetResult(null)
  }

  const confirmResetPassword = async () => {
    if (!selectedUser) return

    setIsResetting(true)
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      const data = await response.json()

      if (data.success) {
        setResetResult(data.data)
        setShowResetModal(false)
        setShowSuccessModal(true)
      } else {
        alert(`重置失败: ${data.error}`)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      alert('重置密码失败，请稍后重试')
    } finally {
      setIsResetting(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    setResetResult(null)
    setSelectedUser(null)
    setCopySuccess(false)
  }

  // Show loading state while checking authentication
  if (authLoading || isLoadingData) {
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
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">加载失败</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchUsers()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            重新加载
          </Button>
        </div>
      </div>
    )
  }

  // If not authenticated as admin, the useAdminAuth hook will redirect
  if (!adminUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          </div>
          <p className="text-gray-600">管理系统用户，查看用户信息和活动状态</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索用户名或邮箱..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="md:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">所有角色</option>
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">所有状态</option>
                  <option value="active">活跃</option>
                  <option value="inactive">非活跃</option>
                  <option value="banned">已封禁</option>
                </select>
              </div>

              {/* Add User Button */}
              <Button className="md:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                添加用户
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后登录
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动统计
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? '活跃' : user.status === 'inactive' ? '非活跃' : '已封禁'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {user.registeredAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>评估: {user.assessmentCount}</div>
                        <div>文章: {user.articleCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium min-w-[200px]">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'active' ? '禁用用户' : '启用用户'}
                        >
                          {user.status === 'active' ? (
                            <Ban className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="编辑用户"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                          className="text-orange-600 hover:text-orange-700"
                          title="重置密码"
                        >
                          <Key className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                          title="删除用户"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到用户</h3>
              <p className="mt-1 text-sm text-gray-500">
                尝试调整搜索条件或筛选器
              </p>
            </div>
          )}
        </Card>

        {/* 重置密码确认模态框 */}
        <Modal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="重置用户密码"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">重要提醒</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  重置密码后，用户将需要使用新的临时密码登录，并在首次登录时修改密码。
                </p>
              </div>
            </div>

            {selectedUser && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">目标用户信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">用户名:</span>
                    <span className="font-medium">{selectedUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">邮箱:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">角色:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
              >
                取消
              </Button>
              <Button
                onClick={confirmResetPassword}
                disabled={isResetting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isResetting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    重置中...
                  </div>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    确认重置密码
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* 重置成功模态框 */}
        <Modal
          isOpen={showSuccessModal}
          onClose={closeSuccessModal}
          title="密码重置成功"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">重置成功</h4>
                <p className="text-sm text-green-700 mt-1">
                  已为用户生成新的临时密码，请将密码安全地传达给用户。
                </p>
              </div>
            </div>

            {resetResult && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">用户信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">用户名:</span>
                      <span className="font-medium">{resetResult.targetUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">邮箱:</span>
                      <span className="font-medium">{resetResult.targetUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">重置时间:</span>
                      <span className="font-medium">
                        {new Date(resetResult.resetTime).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">临时密码</h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-white border rounded font-mono text-sm">
                      {resetResult.temporaryPassword}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(resetResult.temporaryPassword)}
                      className={copySuccess ? 'text-green-600 border-green-300' : ''}
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          复制
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    请安全地将此密码传达给用户，用户首次登录时需要修改密码。
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">安全提醒</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 请通过安全渠道（如电话、面对面）告知用户新密码</li>
                    <li>• 不要通过邮件或即时消息发送密码</li>
                    <li>• 用户首次登录后必须修改密码</li>
                    <li>• 此操作已记录在系统审计日志中</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={closeSuccessModal}>
                关闭
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
