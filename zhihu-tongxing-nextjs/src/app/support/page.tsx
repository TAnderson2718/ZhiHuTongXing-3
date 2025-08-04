'use client'

import Link from 'next/link'
import { HeartHandshake, MessageCircle, Users, ExternalLink, Phone, Mail, Clock, Star, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-purple-100 p-4 rounded-full mb-6">
              <HeartHandshake className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              专业支持与服务资源馆
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              当您需要帮助时，我们都在。这里汇集了智能咨询、互助社区与权威资源，
              为您提供全方位的专业支持和服务。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support/consultation">
                <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  在线咨询
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  加入社区
                </Button>
              </Link>
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">在线支持</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">5,000+</div>
              <div className="text-gray-600">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">4.9</div>
              <div className="text-gray-600">满意度评分</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">&lt;2分钟</div>
              <div className="text-gray-600">平均响应时间</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Support Services */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-8 h-8 mr-3 text-purple-500" />
                  专业咨询服务
                </h2>
                <p className="text-gray-600 mb-6">
                  我们的专业团队随时为您提供个性化的育儿指导和心理支持，帮助您解决在育儿过程中遇到的各种问题。
                </p>
                
                <div className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">在线即时咨询</h3>
                        <p className="text-gray-600 mb-4">
                          通过智能客服系统，获得即时的育儿问题解答和专业建议。
                        </p>
                        <Link href="/support/consultation">
                          <Button className="bg-blue-500 hover:bg-blue-600">
                            开始咨询
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">专家电话咨询</h3>
                        <p className="text-gray-600 mb-4">
                          预约专业育儿专家进行一对一电话咨询，获得深度指导。
                        </p>
                        <Link href="/support/appointment">
                          <Button className="bg-green-500 hover:bg-green-600">
                            预约咨询
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">邮件咨询服务</h3>
                        <p className="text-gray-600 mb-4">
                          详细描述您的问题，我们将在24小时内提供专业的书面回复。
                        </p>
                        <Link href="/support/contact">
                          <Button className="bg-orange-500 hover:bg-orange-600">
                            发送邮件
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Contact Information */}
              <Card className="p-6 bg-purple-50 border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">联系我们</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">咨询热线：400-123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">邮箱：support@zhihutongxing.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">服务时间：周一至周日 9:00-21:00</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">微信公众号：育见未来ing</span>
                  </div>
                </div>
              </Card>

              {/* WeChat QR Code */}
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
                  微信联系
                </h3>
                <div className="text-center">
                  <div className="mb-3">
                    <img
                      src="https://i.postimg.cc/XJLd4fQ4/SCR-20250802-lxua.png"
                      alt="微信二维码"
                      className="w-24 h-24 mx-auto rounded-lg border border-green-200 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <div className="w-24 h-24 mx-auto rounded-lg border border-green-200 bg-green-100 flex items-center justify-center text-green-600 hidden">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-green-900">天天向上</p>
                    <p className="text-sm text-green-700">扫码添加微信</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Resources and Community */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <ExternalLink className="w-8 h-8 mr-3 text-purple-500" />
                  权威资源导航
                </h2>
                <p className="text-gray-600 mb-6">
                  精选的权威机构和专业资源，为您提供可靠的育儿信息和支持服务。
                </p>

                <div className="space-y-4">
                  <a
                    href="http://www.zjjy.org.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">中国家庭教育学会</h4>
                          <p className="text-sm text-gray-600">官方权威家庭教育指导</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </a>

                  <a
                    href="http://www.cydf.org.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">中国青少年发展基金会</h4>
                          <p className="text-sm text-gray-600">青少年发展支持资源</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </a>

                  <a
                    href="http://www.nhc.gov.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">国家卫生健康委员会</h4>
                          <p className="text-sm text-gray-600">儿童健康发展指南</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </a>

                  <a
                    href="http://www.cpsbeijing.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">中国心理学会</h4>
                          <p className="text-sm text-gray-600">儿童心理健康资源</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </a>
                </div>
              </div>

              {/* Community Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-7 h-7 mr-3 text-purple-500" />
                  家长互助社区
                </h3>
                <p className="text-gray-600 mb-6">
                  分享您的育儿经验和情感困惑，在温暖的社区中与其他家长共同成长，获得专家和同伴的支持。
                </p>
                
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">加入我们的社区</h4>
                    <p className="text-gray-600 mb-4">
                      与5000+家长一起分享经验，互相支持
                    </p>
                    <Link href="/community">
                      <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                        <Users className="w-4 h-4 mr-2" />
                        进入社区
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Community Features */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">经验分享</h5>
                    <p className="text-sm text-gray-600">分享育儿心得</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <HeartHandshake className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h5 className="font-medium text-gray-900">互助支持</h5>
                    <p className="text-sm text-gray-600">获得温暖帮助</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            需要帮助？我们随时为您服务
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            专业的支持团队和温暖的社区，让您在育儿路上不再孤单
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support/consultation">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <MessageCircle className="w-5 h-5 mr-2" />
                立即咨询
              </Button>
            </Link>
            <a href="tel:400-123-4567">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Phone className="w-5 h-5 mr-2" />
                电话支持
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
