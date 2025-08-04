import Link from 'next/link'
import Image from 'next/image'
import { Gamepad2, Play, Trophy, Users } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-yellow-100 p-4 rounded-full mb-6">
              <Gamepad2 className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              虚拟照护情境体验馆
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              在安全、有趣的虚拟环境中实践和演练，轻松掌握科学育儿新技能。
              通过游戏化场景，提升实际照护技能。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/experience/games">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                  <Play className="w-5 h-5 mr-2" />
                  开始体验
                </Button>
              </Link>
              <Link href="/experience/tutorials">
                <Button variant="outline" size="lg">
                  查看教程
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
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">15,000+</div>
              <div className="text-gray-600">体验用户</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">情境场景</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">完成率</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="text-gray-600">用户评分</div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Scenarios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              体验场景
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              多样化的情境模拟，让您在实践中掌握育儿技能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* 小小照护大任务 */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 relative">
                  <Image
                    src="https://picsum.photos/seed/task/600/400"
                    alt="日常生活挑战"
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">小小照护大任务</h3>
                    <p className="text-gray-600 mb-4">
                      模拟喂养、哄睡、更换尿布等日常照护挑战，在实践中学习高效的解决方法。
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        日常照护
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        基础技能
                      </span>
                    </div>
                  </div>
                  <Link href="/experience/games/daily-care">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 w-full">
                      <Play className="w-4 h-4 mr-2" />
                      开始体验
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* 情绪大冒险 */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src="https://picsum.photos/seed/emotion/600/400" 
                    alt="情绪管理" 
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">情绪大冒险</h3>
                    <p className="text-gray-600 mb-4">
                      面对孩子的各种"情绪风暴"，学习如何共情倾听、有效沟通，引导孩子管理情绪。
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        情绪管理
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        沟通技巧
                      </span>
                    </div>
                  </div>
                  <Link href="/experience/games/emotion-adventure">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 w-full">
                      <Play className="w-4 h-4 mr-2" />
                      开始体验
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* 保护小英雄 */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src="https://picsum.photos/seed/safety/600/400" 
                    alt="安全防护" 
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">保护小英雄</h3>
                    <p className="text-gray-600 mb-4">
                      学习识别和预防各种安全隐患，掌握紧急情况下的正确应对方法。
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        安全防护
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        应急处理
                      </span>
                    </div>
                  </div>
                  <Link href="/experience/games/safety-hero">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 w-full">
                      <Play className="w-4 h-4 mr-2" />
                      开始体验
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* 榜样的力量 */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 relative">
                  <Image
                    src="https://picsum.photos/seed/example/600/400"
                    alt="榜样教育"
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">榜样的力量</h3>
                    <p className="text-gray-600 mb-4">
                      通过正面引导和榜样示范，培养孩子的良好品格和行为习惯。
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        品格培养
                      </span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                        行为引导
                      </span>
                    </div>
                  </div>
                  <Link href="/experience/games/role-model">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 w-full">
                      <Play className="w-4 h-4 mr-2" />
                      开始体验
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              体验特色
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              创新的学习方式，让育儿技能在实践中自然提升
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">游戏化学习</h3>
              <p className="text-gray-600">
                通过有趣的游戏机制，让学习过程更加轻松愉快，提高参与度和记忆效果。
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">实时反馈</h3>
              <p className="text-gray-600">
                每个决策都有即时反馈，帮助您了解行为后果，快速调整和改进策略。
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">个性化场景</h3>
              <p className="text-gray-600">
                根据您的需求和孩子的特点，提供定制化的情境体验，更贴近实际生活。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开始您的体验之旅
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            在安全的虚拟环境中练习，为现实生活做好准备
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/experience/games">
              <Button size="lg" className="bg-white text-yellow-500 hover:bg-gray-100">
                <Play className="w-5 h-5 mr-2" />
                立即开始体验
              </Button>
            </Link>
            <Link href="/experience/tutorials">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-yellow-500">
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
