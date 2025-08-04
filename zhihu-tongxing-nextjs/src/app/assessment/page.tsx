import Link from 'next/link'
import { ClipboardList, FileText, Users, Calendar, Plus, TrendingUp, Heart, Brain, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { getSession } from '@/lib/auth'

export default async function AssessmentPage() {
  const user = await getSession()

  const assessmentTypes = [
    {
      id: 'comprehensive',
      title: '综合能力评估',
      description: '全面评估孩子的认知、语言、社交、运动等各方面发展水平',
      duration: '30-45分钟',
      ageRange: '2-12岁',
      icon: ClipboardList,
      color: 'bg-blue-500',
      features: ['认知能力', '语言发展', '社交技能', '运动协调', '情绪管理']
    },
    {
      id: 'sdq',
      title: 'SDQ行为评估',
      description: '儿童行为问题筛查量表，评估孩子的行为和情绪状态',
      duration: '15-20分钟',
      ageRange: '3-16岁',
      icon: FileText,
      color: 'bg-green-500',
      features: ['情绪症状', '行为问题', '多动注意力', '同伴关系', '亲社会行为']
    },
    {
      id: 'embu',
      title: 'EMBU教养方式评估',
      description: '评估父母的教养方式对孩子发展的影响',
      duration: '20-25分钟',
      ageRange: '适用于家长',
      icon: Users,
      color: 'bg-purple-500',
      features: ['情感温暖', '拒绝否认', '过度保护', '偏爱被试', '惩罚严厉']
    },
    {
      id: 'childcare-ability',
      title: '儿童照护能力量表',
      description: '评估父母在日常照护、健康管理、安全防护、情感支持等方面的能力',
      duration: '25-30分钟',
      ageRange: '适用于家长',
      icon: Heart,
      color: 'bg-red-500',
      features: ['日常照护', '健康管理', '安全防护', '情感支持', '照护技能']
    },
    {
      id: 'parent-child-relationship',
      title: '亲子关系量表',
      description: '评估亲子间的亲密度、沟通质量、冲突处理和共同活动等关系维度',
      duration: '20-25分钟',
      ageRange: '适用于家长',
      icon: Heart,
      color: 'bg-pink-500',
      features: ['亲密度', '沟通质量', '冲突处理', '共同活动', '关系质量']
    },
    {
      id: 'parental-self-efficacy',
      title: '父母自我效能感量表',
      description: '评估父母对自己育儿能力的信心和效能感水平',
      duration: '15-20分钟',
      ageRange: '适用于家长',
      icon: Brain,
      color: 'bg-indigo-500',
      features: ['育儿信心', '问题解决能力', '情绪调节', '支持寻求', '自我效能']
    },
    {
      id: 'parenting-competence',
      title: '父母教养能力量表',
      description: '全面评估父母的教养策略、行为管理、学习支持和社交指导能力',
      duration: '30-35分钟',
      ageRange: '适用于家长',
      icon: GraduationCap,
      color: 'bg-orange-500',
      features: ['教养策略', '行为管理', '学习支持', '社交指导', '教养技能']
    }
  ]

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
                            assessment.id === 'childcare-ability' ? '/assessment/childcare-ability' :
                            assessment.id === 'parent-child-relationship' ? '/assessment/parent-child-relationship' :
                            assessment.id === 'parental-self-efficacy' ? '/assessment/parental-self-efficacy' :
                            assessment.id === 'parenting-competence' ? '/assessment/parenting-competence' :
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
