import { GraduationCap, Play, BookOpen, Award, Clock, Users, Star, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-red-100 p-4 rounded-full mb-6">
              <GraduationCap className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              家庭教育课程培训馆
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              系统化提升您的专业素养，用科学方法有效陪伴孩子成长。
              提供在线课程、专家讲座、实践指导和认证培训。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-500 hover:bg-red-600">
                <Play className="w-5 h-5 mr-2" />
                开始学习
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                浏览课程
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-gray-600">精品课程</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">50,000+</div>
              <div className="text-gray-600">学员</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">完成率</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="text-gray-600">课程评分</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="https://picsum.photos/seed/course/800/600" 
                  alt="精品课程" 
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4 w-fit">
                  <Star className="w-4 h-4 mr-1" />
                  精品推荐
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  科学育儿全方位指导课程
                </h2>
                <p className="text-gray-600 mb-6">
                  由权威专家团队精心打造的系统化课程，涵盖0-12岁儿童发展的各个阶段，
                  帮助家长掌握科学的育儿理念和实用技能。
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>40课时</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>12,580人学习</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span>4.9分</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Play className="w-4 h-4 mr-2" />
                    立即学习
                  </Button>
                  <Button variant="outline">
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              课程分类
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              多样化的课程内容，满足不同阶段的学习需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 基础育儿课程 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">基础育儿课程</h3>
              <p className="text-gray-600 mb-4">
                涵盖新生儿护理、喂养指导、睡眠管理等基础育儿知识。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">25门课程</span>
                <span className="text-sm text-gray-500">初级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>

            {/* 儿童心理发展 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">儿童心理发展</h3>
              <p className="text-gray-600 mb-4">
                深入了解儿童心理发展规律，掌握情绪管理和行为引导技巧。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">18门课程</span>
                <span className="text-sm text-gray-500">中级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>

            {/* 教育方法与技巧 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">教育方法与技巧</h3>
              <p className="text-gray-600 mb-4">
                学习科学的教育方法，培养孩子的学习能力和良好习惯。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">22门课程</span>
                <span className="text-sm text-gray-500">中级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>

            {/* 安全与健康 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">安全与健康</h3>
              <p className="text-gray-600 mb-4">
                儿童安全防护、健康管理、急救知识等实用技能培训。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">15门课程</span>
                <span className="text-sm text-gray-500">初级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>

            {/* 专业认证课程 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">专业认证课程</h3>
              <p className="text-gray-600 mb-4">
                获得权威机构认证，提升专业素养，成为合格的家庭教育指导师。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">8门课程</span>
                <span className="text-sm text-gray-500">高级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>

            {/* 特殊需求儿童 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">特殊需求儿童</h3>
              <p className="text-gray-600 mb-4">
                针对特殊需求儿童的专业指导，提供个性化的教育支持方案。
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">12门课程</span>
                <span className="text-sm text-gray-500">高级</span>
              </div>
              <Button variant="outline" className="w-full">
                查看课程
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              学习路径
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              系统化的学习路径，循序渐进提升育儿技能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-500">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">基础入门</h3>
              <p className="text-gray-600 mb-6">
                从基础育儿知识开始，建立科学的育儿理念和基本技能。
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  新生儿护理
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  喂养指导
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  睡眠管理
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-500">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">进阶提升</h3>
              <p className="text-gray-600 mb-6">
                深入学习儿童心理发展和教育方法，掌握更专业的技能。
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  心理发展
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  行为引导
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  教育方法
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-500">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">专业认证</h3>
              <p className="text-gray-600 mb-6">
                获得权威认证，成为专业的家庭教育指导师。
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  专业考核
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  实践指导
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  证书颁发
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开始您的学习之旅
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            系统化的课程体系，专业的师资团队，助您成为更好的家长
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100">
              <Play className="w-5 h-5 mr-2" />
              免费试听
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-500">
              <GraduationCap className="w-5 h-5 mr-2" />
              查看全部课程
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
