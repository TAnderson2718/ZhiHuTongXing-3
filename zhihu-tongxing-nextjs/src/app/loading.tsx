import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          正在加载...
        </h2>
        <p className="text-gray-600">
          请稍候，智护童行正在为您准备内容
        </p>
      </div>
    </div>
  )
}
