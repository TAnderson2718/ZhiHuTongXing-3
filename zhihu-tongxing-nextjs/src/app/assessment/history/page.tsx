'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Search, Calendar, TrendingUp, Eye, Download, Brain, Heart, Users } from 'lucide-react'

// 模拟历史评估数据
const mockHistory = [
  {
    id: 'comprehensive-2025-01-01',
    type: 'comprehensive',
    title: '儿童照护能力综合评估',
    completedAt: '2025-01-01',
    score: 78,
    level: '良好',
    levelColor: 'bg-green-500',
    icon: Brain
  },
  {
    id: 'sdq-2024-12-15',
    type: 'sdq',
    title: '长处和困难问卷 (SDQ)',
    completedAt: '2024-12-15',
    score: 12,
    level: '正常范围',
    levelColor: 'bg-green-500',
    icon: Heart
  },
  {
    id: 'embu-2024-12-01',
    type: 'embu',
    title: '父母教育方式量表 (EMBU)',
    completedAt: '2024-12-01',
    score: 75,
    level: '均衡型',
    levelColor: 'bg-blue-500',
    icon: Users
  },
  {
    id: 'comprehensive-2024-11-15',
    type: 'comprehensive',
    title: '儿童照护能力综合评估',
    completedAt: '2024-11-15',
    score: 72,
    level: '良好',
    levelColor: 'bg-green-500',
    icon: Brain
  },
  {
    id: 'sdq-2024-11-01',
    type: 'sdq',
    title: '长处和困难问卷 (SDQ)',
    completedAt: '2024-11-01',
    score: 15,
    level: '轻度关注',
    levelColor: 'bg-yellow-500',
    icon: Heart
  }
]

export default function AssessmentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // 过滤和排序逻辑
  const filteredHistory = mockHistory
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || item.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      } else if (sortBy === 'score') {
        return b.score - a.score
      }
      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/assessment">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回评估馆
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">评估历史</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>筛选和搜索</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索评估..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="评估类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    <SelectItem value="comprehensive">综合评估</SelectItem>
                    <SelectItem value="sdq">SDQ问卷</SelectItem>
                    <SelectItem value="embu">EMBU量表</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">按日期排序</SelectItem>
                    <SelectItem value="score">按得分排序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总评估次数</p>
                    <p className="text-2xl font-bold text-gray-900">{mockHistory.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">最近评估</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDate(mockHistory[0]?.completedAt || '')}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均得分</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(mockHistory.reduce((sum, item) => sum + item.score, 0) / mockHistory.length)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">没有找到匹配的评估记录</p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((assessment) => {
                const IconComponent = assessment.icon
                return (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <IconComponent className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(assessment.completedAt)}
                              </span>
                              <span>得分: {assessment.score}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={`${assessment.levelColor} text-white`}>
                            {assessment.level}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/assessment/${assessment.type}/result`}>
                                <Eye className="w-4 h-4 mr-1" />
                                查看
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                返回评估馆
              </Link>
            </Button>
            <Button asChild>
              <Link href="/assessment/new">
                开始新评估
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
