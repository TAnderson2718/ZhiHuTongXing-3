import Link from 'next/link'
import { FileX, ArrowLeft, Search } from 'lucide-react'
import Button from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX className="w-8 h-8 text-gray-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            文章未找到
          </h1>
          
          <p className="text-gray-600 mb-8">
            抱歉，您访问的文章不存在或已被删除。请检查链接是否正确，或浏览其他文章。
          </p>
          
          <div className="space-y-4">
            <Link href="/knowledge">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回知识科普馆
              </Button>
            </Link>
            
            <Link href="/knowledge">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                浏览所有文章
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
