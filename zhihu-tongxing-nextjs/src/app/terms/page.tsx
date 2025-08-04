import { FileText, Scale, AlertTriangle, Shield, Users, Gavel } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="w-16 h-16 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">服务条款</h1>
          <p className="text-xl text-gray-600">
            欢迎使用智护童行平台，请仔细阅读以下服务条款
          </p>
          <p className="text-sm text-gray-500 mt-2">
            最后更新时间：2025年1月20日
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">服务条款概述</h2>
            <p className="text-gray-700 leading-relaxed">
              欢迎使用智护童行（以下简称"本平台"或"我们"）提供的家庭教育与儿童照护服务。
              本服务条款（以下简称"条款"）是您与智护童行之间关于使用本平台服务的法律协议。
              通过访问或使用我们的服务，您同意受本条款的约束。
            </p>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">服务描述</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              智护童行是一个专业的家庭教育与儿童照护平台，提供以下服务：
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">核心服务</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 儿童能力评估工具</li>
                  <li>• 科学照护知识科普</li>
                  <li>• 虚拟照护情境体验</li>
                  <li>• 专业支持与咨询服务</li>
                  <li>• 家庭教育课程培训</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">增值服务</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 个性化成长方案</li>
                  <li>• 专家一对一咨询</li>
                  <li>• 社区交流与分享</li>
                  <li>• 定期评估报告</li>
                  <li>• 线下活动参与</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">用户责任</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. 账户安全</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>您有责任保护账户密码的安全性</li>
                  <li>不得与他人共享账户信息</li>
                  <li>发现账户异常应立即通知我们</li>
                  <li>对账户下的所有活动承担责任</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. 内容规范</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>不得发布违法、有害或不当内容</li>
                  <li>尊重他人隐私和知识产权</li>
                  <li>不得传播虚假或误导性信息</li>
                  <li>维护平台的良好秩序和氛围</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. 合理使用</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>不得滥用平台资源或功能</li>
                  <li>不得进行商业推广或广告活动</li>
                  <li>不得干扰平台正常运行</li>
                  <li>遵守相关法律法规</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">禁止行为</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-3">以下行为被严格禁止：</p>
              <div className="space-y-2 text-red-700">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>发布涉及儿童不当内容或有害信息</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>恶意攻击、骚扰或威胁其他用户</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>传播病毒、恶意软件或进行网络攻击</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>侵犯他人知识产权或隐私权</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>进行欺诈、诈骗或其他违法活动</p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">知识产权</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">平台内容</h3>
                <p className="text-gray-700">
                  本平台的所有内容，包括但不限于文字、图片、视频、音频、软件、设计等，
                  均受知识产权法保护。未经授权，不得复制、传播、修改或商业使用。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">用户内容</h3>
                <p className="text-gray-700">
                  您在平台上发布的内容仍归您所有，但您授予我们在平台范围内使用、展示、
                  传播该内容的权利。您保证拥有发布内容的合法权利。
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">隐私和数据保护</h2>
            <p className="text-gray-700 mb-4">
              我们高度重视您的隐私保护。关于个人信息的收集、使用和保护，
              请参阅我们的《隐私政策》，该政策是本条款的重要组成部分。
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>特别提醒：</strong>
                由于我们的服务涉及儿童相关内容，我们对儿童隐私保护有更严格的标准。
                14岁以下儿童使用本服务需要监护人同意和监督。
              </p>
            </div>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">服务可用性</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                我们努力确保服务的稳定性和可用性，但不保证服务不会中断。
                以下情况可能导致服务暂停或中断：
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">系统维护和升级</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">不可抗力因素（如自然灾害、网络故障等）</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">政府政策或法律法规要求</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">第三方服务提供商的问题</p>
                </div>
              </div>
            </div>
          </section>

          {/* Liability Limitation */}
          <section>
            <div className="flex items-center mb-4">
              <Gavel className="w-6 h-6 text-teal-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">责任限制</h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 mb-3">
                <strong>重要声明：</strong>
              </p>
              <div className="space-y-2 text-yellow-700">
                <p>• 本平台提供的内容仅供参考，不能替代专业医疗或教育建议</p>
                <p>• 用户应根据实际情况谨慎使用平台信息</p>
                <p>• 我们不对用户使用服务产生的任何直接或间接损失承担责任</p>
                <p>• 在法律允许的最大范围内，我们的责任限于服务费用</p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">服务终止</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">用户终止</h3>
                <p className="text-gray-700">
                  您可以随时停止使用我们的服务并删除账户。删除账户后，
                  您将无法访问相关数据和内容。
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">平台终止</h3>
                <p className="text-gray-700">
                  如果您违反本条款，我们有权暂停或终止您的账户。
                  严重违规行为可能导致永久封禁。
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">条款修改</h2>
            <p className="text-gray-700">
              我们可能会不时修改本服务条款。重大修改将通过网站公告、邮件或其他方式通知您。
              继续使用服务即表示您接受修改后的条款。
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">适用法律</h2>
            <p className="text-gray-700">
              本条款受中华人民共和国法律管辖。如发生争议，应首先通过友好协商解决；
              协商不成的，提交北京市朝阳区人民法院管辖。
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-teal-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <p className="text-gray-700 mb-4">
              如果您对本服务条款有任何疑问，请通过以下方式联系我们：
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>邮箱：</strong> legal@zhihutongxing.com</p>
              <p><strong>电话：</strong> 400-123-4567</p>
              <p><strong>地址：</strong> 北京市朝阳区智护大厦</p>
              <p><strong>工作时间：</strong> 周一至周五 9:00-18:00</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
