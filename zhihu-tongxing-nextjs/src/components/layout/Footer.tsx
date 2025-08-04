import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">智</span>
              </div>
              <span className="text-xl font-bold">智护童行</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              专业的家庭教育与儿童照护平台，为每个家庭提供科学、专业的育儿指导和支持服务。
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">用心守护每个孩子的成长</span>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/assessment" className="text-gray-300 hover:text-white transition-colors">
                  能力评估
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="text-gray-300 hover:text-white transition-colors">
                  知识科普
                </Link>
              </li>
              <li>
                <Link href="/experience" className="text-gray-300 hover:text-white transition-colors">
                  情境体验
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  专业支持
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-300 hover:text-white transition-colors">
                  课程培训
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@zhihutongxing.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">400-123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">北京市朝阳区智护大厦</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 智护童行. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                服务条款
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                关于我们
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
