import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Shield, 
  Lightbulb,
  Star,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-20 h-20 text-teal-200" />
            </div>
            <h1 className="text-5xl font-bold mb-6">关于智护童行</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
              专业的家庭教育与儿童照护平台，致力于为每个家庭提供科学、专业的育儿指导和支持服务，
              用心守护每个孩子的健康成长。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-teal-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">我们的使命</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              通过科学的评估工具、专业的知识内容和创新的服务模式，
              帮助家长更好地理解和支持孩子的成长发展，
              让每个孩子都能在充满爱与理解的环境中茁壮成长。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-8 h-8 text-teal-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">我们的愿景</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              成为中国领先的家庭教育与儿童照护服务平台，
              推动科学育儿理念的普及，
              为构建和谐家庭关系和培养优秀下一代贡献力量。
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心价值观</h2>
            <p className="text-xl text-gray-600">指导我们前进的基本原则</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">以爱为本</h3>
              <p className="text-gray-600">
                用爱心和耐心对待每一个家庭，
                真诚关怀每一个孩子的成长需求
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">科学专业</h3>
              <p className="text-gray-600">
                基于科学研究和专业知识，
                提供可靠、有效的育儿指导
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">安全可信</h3>
              <p className="text-gray-600">
                保护用户隐私，确保服务安全，
                建立值得信赖的平台环境
              </p>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">五大功能馆</h2>
            <p className="text-xl text-gray-600">全方位的家庭教育与儿童照护服务</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">评估馆</h3>
              <p className="text-gray-600 text-sm">
                专业的儿童能力评估工具，科学记录成长轨迹
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">知识馆</h3>
              <p className="text-gray-600 text-sm">
                科学照护知识科普，权威专家内容分享
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">体验馆</h3>
              <p className="text-gray-600 text-sm">
                虚拟照护情境体验，提升实际照护技能
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">支持馆</h3>
              <p className="text-gray-600 text-sm">
                专业支持与服务资源，解决育儿难题
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">培训馆</h3>
              <p className="text-gray-600 text-sm">
                系统化家庭教育课程，提升育儿能力
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">社区</h3>
              <p className="text-gray-600 text-sm">
                家长交流互助平台，分享育儿经验
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-teal-600 rounded-lg text-white p-12 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">平台数据</h2>
            <p className="text-teal-100">用数据见证我们的成长与影响力</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,250+</div>
              <div className="text-teal-100">注册用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,600+</div>
              <div className="text-teal-100">总浏览量</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">120+</div>
              <div className="text-teal-100">专业文章</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">80+</div>
              <div className="text-teal-100">视频资源</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">专业团队</h2>
            <p className="text-xl text-gray-600">汇聚儿童发展、心理学、教育学等领域专家</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">儿童发展专家</h3>
              <p className="text-gray-600 text-sm mb-3">
                具有丰富临床经验的儿童发展专家团队
              </p>
              <div className="text-teal-600 text-sm">10+ 年经验</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">心理学专家</h3>
              <p className="text-gray-600 text-sm mb-3">
                专业的儿童心理学和家庭治疗专家
              </p>
              <div className="text-teal-600 text-sm">15+ 年经验</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">教育学专家</h3>
              <p className="text-gray-600 text-sm mb-3">
                资深的早期教育和家庭教育专家
              </p>
              <div className="text-teal-600 text-sm">12+ 年经验</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-xl text-gray-600">我们期待与您携手，共同守护孩子的成长</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">邮箱联系</h3>
              <p className="text-gray-600">support@zhihutongxing.com</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">客服热线</h3>
              <p className="text-gray-600">400-123-4567</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">公司地址</h3>
              <p className="text-gray-600">北京市朝阳区智护大厦</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              工作时间：周一至周五 9:00-18:00 | 周六 9:00-17:00
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
