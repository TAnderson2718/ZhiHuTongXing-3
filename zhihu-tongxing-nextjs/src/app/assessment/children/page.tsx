'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit, Trash2, User, Calendar, MapPin, Phone, Mail, Heart } from 'lucide-react'

// 模拟孩子档案数据
const mockChildren = [
  {
    id: '1',
    name: '小明',
    avatar: '',
    age: 8,
    gender: '男',
    birthday: '2016-03-15',
    school: '阳光小学',
    grade: '二年级',
    interests: ['足球', '画画', '阅读'],
    personality: '活泼开朗，喜欢运动，对新事物充满好奇心',
    specialNeeds: '无',
    emergencyContact: {
      name: '张女士',
      relationship: '母亲',
      phone: '138****8888'
    },
    assessmentCount: 5,
    lastAssessment: '2025-01-01'
  },
  {
    id: '2',
    name: '小红',
    avatar: '',
    age: 6,
    gender: '女',
    birthday: '2018-07-22',
    school: '希望幼儿园',
    grade: '大班',
    interests: ['舞蹈', '唱歌', '手工'],
    personality: '温柔细心，富有创造力，喜欢帮助他人',
    specialNeeds: '轻微的注意力不集中',
    emergencyContact: {
      name: '李先生',
      relationship: '父亲',
      phone: '139****9999'
    },
    assessmentCount: 3,
    lastAssessment: '2024-12-20'
  }
]

export default function ChildrenManagementPage() {
  const [children, setChildren] = useState(mockChildren)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<any>(null)

  const calculateAge = (birthday: string) => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  const handleDeleteChild = (childId: string) => {
    setChildren(prev => prev.filter(child => child.id !== childId))
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
              <h1 className="text-2xl font-bold text-gray-900">孩子档案管理</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  添加孩子
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>添加孩子档案</DialogTitle>
                  <DialogDescription>
                    请填写孩子的基本信息，建立个人档案。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" placeholder="请输入孩子姓名" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">性别</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择性别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男</SelectItem>
                          <SelectItem value="female">女</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="birthday">出生日期</Label>
                      <Input id="birthday" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="school">学校/幼儿园</Label>
                    <Input id="school" placeholder="请输入学校名称" />
                  </div>
                  <div>
                    <Label htmlFor="grade">年级/班级</Label>
                    <Input id="grade" placeholder="请输入年级或班级" />
                  </div>
                  <div>
                    <Label htmlFor="personality">性格特点</Label>
                    <Textarea id="personality" placeholder="描述孩子的性格特点..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      保存
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">管理孩子数</p>
                    <p className="text-2xl font-bold text-gray-900">{children.length}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">总评估次数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {children.reduce((sum, child) => sum + child.assessmentCount, 0)}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均年龄</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(children.reduce((sum, child) => sum + child.age, 0) / children.length)} 岁
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Children List */}
          {children.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有添加孩子档案</h3>
                <p className="text-gray-500 mb-6">添加孩子的基本信息，开始建立成长档案</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加第一个孩子
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={child.avatar} />
                          <AvatarFallback className="text-lg font-semibold">
                            {child.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{child.name}</CardTitle>
                          <CardDescription className="text-base">
                            {child.age} 岁 · {child.gender} · {child.grade}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingChild(child)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteChild(child.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">基本信息</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(child.birthday)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {child.school}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">兴趣爱好</h4>
                        <div className="flex flex-wrap gap-2">
                          {child.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">性格特点</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{child.personality}</p>
                      </div>

                      {child.specialNeeds !== '无' && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">特殊需求</h4>
                          <p className="text-sm text-orange-600">{child.specialNeeds}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">紧急联系人</h4>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            <User className="w-4 h-4 mr-2" />
                            {child.emergencyContact.name} ({child.emergencyContact.relationship})
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {child.emergencyContact.phone}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span>评估次数: {child.assessmentCount}</span>
                          <span>最近评估: {formatDate(child.lastAssessment)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/assessment/new`}>
                              开始评估
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/assessment/records`}>
                              查看记录
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                返回评估馆
              </Link>
            </Button>
            {children.length > 0 && (
              <Button asChild>
                <Link href="/assessment/records">
                  查看成长记录
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
