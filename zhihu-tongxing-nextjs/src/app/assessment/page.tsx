import Link from 'next/link'
import { ClipboardList, FileText, Users, Calendar, Plus, TrendingUp, Heart, Brain, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 图标映射
const iconMap = {
  ClipboardList,
  FileText,
  Users,
  Heart,
  Brain,
  GraduationCap,
  Calendar,
  Plus,
  TrendingUp
}

export default async function AssessmentPage() {
  const user = await getSession()

  // 从数据库获取评估工具模板
  const assessmentTemplates = await prisma.assessmentTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: {
          assessments: true
        }
      }
    }
  })

  // 转换数据格式以匹配前端组件需求
  const assessmentTypes = assessmentTemplates.map(template => ({
    id: template.id, // 使用唯一的数据库ID而不是type
    type: template.type, // 保留type字段用于特殊路由判断
    title: template.title,
    description: template.description,
    duration: template.duration,
    ageRange: template.ageRange,
    icon: iconMap[template.icon as keyof typeof iconMap] || ClipboardList,
    color: template.color || 'bg-blue-500',
    features: Array.isArray(template.features) ? template.features : [],
    completions: template._count.assessments
  }))

  const recentAssessments = [
    {
      id: '1',
      type: '综合能力评估',
      childName: '小太阳',
      date: '2025-06-20',
      status: 'completed',
      score: 85
    },
    {
      id: '2',
      type: 'SDQ行为评估',
      childName: '小月亮',
      date: '2025-06-18',
      status: 'in_progress',
      score: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">能力评估与成长记录馆</h1>
          <p className="text-lg text-gray-600">
            通过专业的评估工具，了解孩子的发展状况，记录成长轨迹
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{user ? '12' : '7'}</div>
            <div className="text-sm text-gray-600">{user ? '已完成评估' : '评估类型'}</div>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{user ? '85%' : '专业'}</div>
            <div className="text-sm text-gray-600">{user ? '平均发展水平' : '科学评估'}</div>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{user ? '24' : '全面'}</div>
            <div className="text-sm text-gray-600">{user ? '成长记录' : '发展跟踪'}</div>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{user ? '2' : '个性'}</div>
            <div className="text-sm text-gray-600">{user ? '孩子档案' : '定制建议'}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Types */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">评估类型</h2>
              <Button asChild>
                <Link href="/assessment/new">
                  <Plus className="w-4 h-4 mr-2" />
                  开始新评估
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              {assessmentTypes.map((assessment) => (
                <Card key={assessment.id} hover>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${assessment.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <assessment.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {assessment.duration}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {assessment.ageRange}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{assessment.description}</p>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">评估内容：</h4>
                        <div className="flex flex-wrap gap-2">
                          {assessment.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button size="sm" asChild>
                          <Link href={
                            // 对于特殊的评估类型，使用type作为路由
                            assessment.type === 'childcare-ability' ? '/assessment/childcare-ability' :
                            assessment.type === 'parent-child-relationship' ? '/assessment/parent-child-relationship' :
                            assessment.type === 'parental-self-efficacy' ? '/assessment/parental-self-efficacy' :
                            assessment.type === 'parenting-competence' ? '/assessment/parenting-competence' :
                            // 对于其他评估工具，使用唯一ID作为路由
                            `/assessment/${assessment.id}/start`
                          }>
                            开始评估
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/assessment/${assessment.id}/info`}>
                            了解详情
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Assessments or Login Prompt */}
            <Card>
              {user ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">最近评估</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/assessment/history">查看全部</Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentAssessments.map((assessment) => (
                      <div key={assessment.id} className="border-l-4 border-teal-500 pl-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{assessment.type}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            assessment.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {assessment.status === 'completed' ? '已完成' : '进行中'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{assessment.childName}</p>
                        <p className="text-xs text-gray-500">{assessment.date}</p>
                        {assessment.score && (
                          <p className="text-sm font-medium text-teal-600">得分: {assessment.score}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">开始您的评估之旅</h3>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      登录后可以保存评估结果，跟踪孩子的成长轨迹
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/login">登录账户</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/register">注册新账户</Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {user ? '快速操作' : '了解更多'}
              </h3>
              <div className="space-y-3">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/assessment/children">
                        <Users className="w-4 h-4 mr-2" />
                        管理孩子档案
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/assessment/records">
                        <Calendar className="w-4 h-4 mr-2" />
                        成长记录
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/assessment/reports">
                        <FileText className="w-4 h-4 mr-2" />
                        评估报告
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/knowledge">
                        <FileText className="w-4 h-4 mr-2" />
                        科学照护知识
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/experience">
                        <Users className="w-4 h-4 mr-2" />
                        虚拟情境体验
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/support">
                        <Calendar className="w-4 h-4 mr-2" />
                        专业支持服务
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
