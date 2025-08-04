'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Calendar, TrendingUp, Award, Camera, FileText, Heart, Star, Plus } from 'lucide-react'

// 模拟成长记录数据
const mockRecords = {
  milestones: [
    {
      id: '1',
      childName: '小明',
      title: '第一次独立完成作业',
      description: '小明今天第一次在没有任何帮助的情况下完成了数学作业，表现出很强的独立性。',
      date: '2025-01-01',
      category: '学习成长',
      importance: 'high',
      photos: []
    },
    {
      id: '2',
      childName: '小红',
      title: '学会了骑自行车',
      description: '经过一周的练习，小红终于学会了骑自行车，非常开心和自豪。',
      date: '2024-12-28',
      category: '运动发展',
      importance: 'high',
      photos: []
    },
    {
      id: '3',
      childName: '小明',
      title: '主动帮助同学',
      description: '在学校里主动帮助摔倒的同学，展现出很好的同理心和助人精神。',
      date: '2024-12-25',
      category: '社交发展',
      importance: 'medium',
      photos: []
    }
  ],
  assessmentProgress: [
    {
      id: '1',
      childName: '小明',
      assessmentType: '综合评估',
      date: '2025-01-01',
      score: 78,
      previousScore: 72,
      improvement: '+6',
      highlights: ['生活照护能力提升显著', '安全意识增强']
    },
    {
      id: '2',
      childName: '小红',
      assessmentType: 'SDQ问卷',
      date: '2024-12-20',
      score: 12,
      previousScore: 15,
      improvement: '-3',
      highlights: ['情绪管理能力改善', '注意力集中度提高']
    }
  ],
  achievements: [
    {
      id: '1',
      childName: '小明',
      title: '阅读小达人',
      description: '本月阅读了10本课外书',
      date: '2024-12-31',
      icon: '📚',
      category: '学习成就'
    },
    {
      id: '2',
      childName: '小红',
      title: '小小艺术家',
      description: '绘画作品在学校展览中获得好评',
      date: '2024-12-20',
      icon: '🎨',
      category: '艺术成就'
    }
  ]
}

export default function GrowthRecordsPage() {
  const [selectedChild, setSelectedChild] = useState('all')
  const [activeTab, setActiveTab] = useState('milestones')

  const children = ['小明', '小红']

  const filterRecordsByChild = (records: any[]) => {
    if (selectedChild === 'all') return records
    return records.filter(record => record.childName === selectedChild)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return '重要'
      case 'medium': return '一般'
      case 'low': return '普通'
      default: return '未知'
    }
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
              <h1 className="text-2xl font-bold text-gray-900">成长记录</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有孩子</SelectItem>
                  {children.map(child => (
                    <SelectItem key={child} value={child}>{child}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加记录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">成长里程碑</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filterRecordsByChild(mockRecords.milestones).length}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">评估记录</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filterRecordsByChild(mockRecords.assessmentProgress).length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">获得成就</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filterRecordsByChild(mockRecords.achievements).length}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">记录天数</p>
                    <p className="text-2xl font-bold text-gray-900">45</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="milestones">成长里程碑</TabsTrigger>
              <TabsTrigger value="assessments">评估进展</TabsTrigger>
              <TabsTrigger value="achievements">成就奖励</TabsTrigger>
            </TabsList>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-4">
              {filterRecordsByChild(mockRecords.milestones).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有记录成长里程碑</p>
                  </CardContent>
                </Card>
              ) : (
                filterRecordsByChild(mockRecords.milestones).map((milestone) => (
                  <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{milestone.childName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                            <p className="text-sm text-gray-500">{milestone.childName} · {formatDate(milestone.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getImportanceColor(milestone.importance)} text-white`}>
                            {getImportanceText(milestone.importance)}
                          </Badge>
                          <Badge variant="secondary">{milestone.category}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{milestone.description}</p>
                      {milestone.photos.length > 0 && (
                        <div className="flex space-x-2">
                          {milestone.photos.map((photo, index) => (
                            <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-4">
              {filterRecordsByChild(mockRecords.assessmentProgress).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有评估进展记录</p>
                  </CardContent>
                </Card>
              ) : (
                filterRecordsByChild(mockRecords.assessmentProgress).map((progress) => (
                  <Card key={progress.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{progress.childName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{progress.assessmentType}</h3>
                            <p className="text-sm text-gray-500">{progress.childName} · {formatDate(progress.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{progress.score}</div>
                          <div className={`text-sm ${progress.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {progress.improvement}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">主要亮点</h4>
                        <div className="space-y-1">
                          {progress.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span className="text-sm text-gray-700">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              {filterRecordsByChild(mockRecords.achievements).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有获得成就奖励</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filterRecordsByChild(mockRecords.achievements).map((achievement) => (
                    <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{achievement.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{achievement.childName}</span>
                          <span>{formatDate(achievement.date)}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {achievement.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                返回评估馆
              </Link>
            </Button>
            <Button asChild>
              <Link href="/assessment/children">
                管理孩子档案
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
