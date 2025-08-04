'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Search, Download, Share2, Eye, Calendar, TrendingUp, FileText, Filter } from 'lucide-react'

// 模拟评估报告数据
const mockReports = [
  {
    id: 'comprehensive-2025-01-01',
    title: '儿童照护能力综合评估报告',
    childName: '小明',
    assessmentType: 'comprehensive',
    completedAt: '2025-01-01',
    score: 78,
    level: '良好',
    levelColor: 'bg-green-500',
    summary: '您在儿童照护方面表现良好，特别是在生活照护和安全防护方面表现出色。建议在心理支持方面继续提升。',
    keyFindings: [
      '生活照护能力优秀，能够很好地满足孩子的基本需求',
      '安全防护意识较强，能够为孩子创造安全环境',
      '心理支持方面有提升空间，可以更多关注孩子的情感需求'
    ],
    recommendations: 3,
    pages: 8
  },
  {
    id: 'sdq-2024-12-15',
    title: '长处和困难问卷 (SDQ) 评估报告',
    childName: '小明',
    assessmentType: 'sdq',
    completedAt: '2024-12-15',
    score: 12,
    level: '正常范围',
    levelColor: 'bg-green-500',
    summary: '孩子的整体心理健康状况良好，各项指标均在正常范围内。社交能力表现优秀，情绪状态稳定。',
    keyFindings: [
      '社交能力表现优秀，能够很好地与同伴相处',
      '情绪状态稳定，很少出现情绪问题',
      '行为表现良好，符合年龄特点'
    ],
    recommendations: 2,
    pages: 5
  },
  {
    id: 'embu-2024-12-01',
    title: '父母教育方式量表 (EMBU) 评估报告',
    childName: '小红',
    assessmentType: 'embu',
    completedAt: '2024-12-01',
    score: 75,
    level: '均衡型',
    levelColor: 'bg-blue-500',
    summary: '您的教养方式整体均衡，能够给予孩子充分的关爱和支持，同时保持适度的管教和引导。',
    keyFindings: [
      '能够给予孩子充分的情感温暖和支持',
      '在保护和自主之间找到了较好的平衡',
      '对孩子的接纳程度较高'
    ],
    recommendations: 2,
    pages: 6
  },
  {
    id: 'comprehensive-2024-11-15',
    title: '儿童照护能力综合评估报告',
    childName: '小红',
    assessmentType: 'comprehensive',
    completedAt: '2024-11-15',
    score: 72,
    level: '良好',
    levelColor: 'bg-green-500',
    summary: '您在儿童照护方面表现良好，各个维度发展较为均衡。建议继续保持现有优势，并在教育引导方面进一步提升。',
    keyFindings: [
      '各维度发展较为均衡，没有明显短板',
      '生活照护和心理支持能力较强',
      '教育引导方面有进一步提升的空间'
    ],
    recommendations: 4,
    pages: 8
  }
]

export default function AssessmentReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterChild, setFilterChild] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const children = ['小明', '小红']
  const assessmentTypes = [
    { value: 'comprehensive', label: '综合评估' },
    { value: 'sdq', label: 'SDQ问卷' },
    { value: 'embu', label: 'EMBU量表' }
  ]

  // 过滤和排序逻辑
  const filteredReports = mockReports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.childName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesChild = filterChild === 'all' || report.childName === filterChild
      const matchesType = filterType === 'all' || report.assessmentType === filterType
      return matchesSearch && matchesChild && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      } else if (sortBy === 'score') {
        return b.score - a.score
      } else if (sortBy === 'child') {
        return a.childName.localeCompare(b.childName)
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

  const getAssessmentTypeLabel = (type: string) => {
    const found = assessmentTypes.find(t => t.value === type)
    return found ? found.label : type
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
              <h1 className="text-2xl font-bold text-gray-900">评估报告</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                筛选和搜索
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索报告..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterChild} onValueChange={setFilterChild}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择孩子" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有孩子</SelectItem>
                    {children.map(child => (
                      <SelectItem key={child} value={child}>{child}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="评估类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    {assessmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">按日期排序</SelectItem>
                    <SelectItem value="score">按得分排序</SelectItem>
                    <SelectItem value="child">按孩子排序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总报告数</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredReports.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均得分</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredReports.length > 0 
                        ? Math.round(filteredReports.reduce((sum, report) => sum + report.score, 0) / filteredReports.length)
                        : 0
                      }
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">最新报告</p>
                    <p className="text-lg font-bold text-gray-900">
                      {filteredReports.length > 0 ? formatDate(filteredReports[0].completedAt) : '无'}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总页数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredReports.reduce((sum, report) => sum + report.pages, 0)}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="space-y-6">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到匹配的报告</h3>
                  <p className="text-gray-500 mb-6">尝试调整筛选条件或开始新的评估</p>
                  <Button asChild>
                    <Link href="/assessment/new">开始新评估</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                        <CardDescription className="text-base">
                          {report.childName} · {formatDate(report.completedAt)} · {getAssessmentTypeLabel(report.assessmentType)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{report.score}</div>
                          <Badge className={`${report.levelColor} text-white`}>
                            {report.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">报告摘要</h4>
                        <p className="text-gray-700">{report.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">主要发现</h4>
                        <div className="space-y-1">
                          {report.keyFindings.map((finding, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                              <span className="text-sm text-gray-700">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{report.pages} 页</span>
                          <span>{report.recommendations} 条建议</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/assessment/${report.assessmentType}/result`}>
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            分享
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
