import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">隐私政策</h1>
          <p className="text-xl text-gray-600">
            智护童行致力于保护您的隐私和个人信息安全
          </p>
          <p className="text-sm text-gray-500 mt-2">
            最后更新时间：2025年1月20日
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">引言</h2>
            <p className="text-gray-700 leading-relaxed">
              智护童行（以下简称"我们"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
              我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、
              选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">我们收集的信息</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. 账户信息</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>用户名、邮箱地址、手机号码</li>
                  <li>头像、个人简介等个人资料</li>
                  <li>账户设置和偏好</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. 使用信息</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>评估记录和测试结果</li>
                  <li>学习进度和课程完成情况</li>
                  <li>浏览历史和搜索记录</li>
                  <li>互动记录（评论、点赞、分享等）</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. 技术信息</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>设备信息（设备型号、操作系统、浏览器类型）</li>
                  <li>IP地址、访问时间、访问页面</li>
                  <li>Cookie和类似技术收集的信息</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Usage */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">信息使用方式</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">提供、维护和改进我们的服务</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">个性化内容推荐和用户体验优化</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">发送重要通知和服务更新</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">防范欺诈和滥用行为，确保平台安全</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">进行数据分析以改善服务质量</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">遵守法律法规要求</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">信息共享</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              我们不会出售、出租或以其他方式披露您的个人信息给第三方，除非：
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">获得您的明确同意</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">法律法规要求或政府部门要求</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">为保护我们或他人的权利、财产或安全</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">与可信的第三方服务提供商合作（如云存储、数据分析）</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">数据安全</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              我们采用多种安全措施来保护您的个人信息：
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">技术保护</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SSL/TLS加密传输</li>
                  <li>• 数据库加密存储</li>
                  <li>• 访问控制和身份验证</li>
                  <li>• 定期安全审计</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">管理保护</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 员工隐私培训</li>
                  <li>• 最小权限原则</li>
                  <li>• 数据访问日志记录</li>
                  <li>• 应急响应机制</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section>
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">您的权利</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              您对自己的个人信息享有以下权利：
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-900 font-medium">访问权</p>
                  <p className="text-gray-700 text-sm">您有权了解我们收集、使用您个人信息的情况</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-900 font-medium">更正权</p>
                  <p className="text-gray-700 text-sm">您有权要求我们更正或补充错误或不完整的个人信息</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-900 font-medium">删除权</p>
                  <p className="text-gray-700 text-sm">在特定情况下，您有权要求我们删除您的个人信息</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-900 font-medium">撤回同意权</p>
                  <p className="text-gray-700 text-sm">您有权随时撤回对个人信息处理的同意</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie使用</h2>
            <p className="text-gray-700 mb-4">
              我们使用Cookie和类似技术来改善您的用户体验。Cookie是存储在您设备上的小文件，
              帮助我们记住您的偏好设置和提供个性化服务。
            </p>
            <p className="text-gray-700">
              您可以通过浏览器设置管理Cookie，但请注意，禁用Cookie可能会影响某些功能的正常使用。
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">儿童隐私保护</h2>
            <p className="text-gray-700">
              我们特别重视儿童的隐私保护。对于14岁以下的儿童，我们要求在监护人同意下使用我们的服务。
              我们不会故意收集14岁以下儿童的个人信息，如发现此类情况，我们会立即删除相关信息。
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">政策更新</h2>
            <p className="text-gray-700">
              我们可能会不时更新本隐私政策。重大变更时，我们会通过网站公告、邮件或其他方式通知您。
              请定期查看本政策以了解最新信息。
            </p>
          </section>

          {/* Contact */}
          <section className="bg-teal-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">联系我们</h2>
            </div>
            <p className="text-gray-700 mb-4">
              如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>邮箱：</strong> privacy@zhihutongxing.com</p>
              <p><strong>电话：</strong> 400-123-4567</p>
              <p><strong>地址：</strong> 北京市朝阳区智护大厦</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
