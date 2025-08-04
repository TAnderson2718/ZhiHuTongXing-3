import { Loader2, Shield } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 relative">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          正在加载管理面板...
        </h2>
        <p className="text-gray-600">
          请稍候，正在验证权限并加载管理数据
        </p>
      </div>
    </div>
  )
}
