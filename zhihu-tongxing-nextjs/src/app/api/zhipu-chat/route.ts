import { NextRequest, NextResponse } from 'next/server'

// 智谱清言API配置
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || ''

// 模拟智谱清言API响应（当没有API密钥时使用）
const mockResponses = [
  "作为专业的育儿顾问，我理解您的担心。每个孩子的发展节奏都不同，建议您可以通过以下方式来支持孩子：1. 创造安全的表达环境；2. 耐心倾听孩子的想法；3. 给予积极的鼓励和支持。如果您需要更详细的指导，建议进行专业的亲子关系评估。",
  "这是一个很好的问题！在处理孩子的行为问题时，建议采用正面管教的方法：1. 设定清晰的界限和规则；2. 保持一致性；3. 用自然后果代替惩罚；4. 关注孩子行为背后的需求。您可以尝试我们平台的行为管理训练课程来获得更多实用技巧。",
  "孩子的学习问题确实需要家长的关注和支持。建议您：1. 了解孩子的学习风格；2. 创造良好的学习环境；3. 建立规律的学习习惯；4. 与老师保持良好沟通。同时，我们的学习支持评估可以帮助您更好地了解如何支持孩子的学习。",
  "情绪管理对孩子的成长非常重要。您可以：1. 教孩子识别和表达情绪；2. 示范健康的情绪处理方式；3. 提供情绪调节的工具和技巧；4. 在孩子情绪激动时保持冷静。建议您参考我们的情感支持相关知识文章。",
  "建立良好的亲子关系需要时间和努力。建议：1. 增加高质量的亲子时光；2. 积极倾听孩子的想法；3. 尊重孩子的个性；4. 表达无条件的爱。您可以通过我们的亲子关系评估来了解当前的关系状况并获得个性化建议。"
]

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 如果没有配置API密钥，使用模拟响应
    if (!ZHIPU_API_KEY) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      
      return NextResponse.json({
        message: randomResponse,
        timestamp: new Date().toISOString(),
        source: 'mock'
      })
    }

    // 构建对话历史
    const messages = [
      {
        role: 'system',
        content: `你是智护童行平台的专业育儿顾问，专门为家长提供科学、专业的育儿指导和建议。你的回答应该：

1. 基于科学的育儿理论和实践
2. 考虑儿童发展的不同阶段特点
3. 提供具体可行的建议和方法
4. 保持温暖、理解和支持的语调
5. 在适当时候推荐平台的相关评估工具、知识文章或培训课程
6. 如果涉及严重问题，建议寻求专业帮助

请用中文回答，语言要亲切易懂，适合家长阅读。`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // 调用智谱清言API
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`智谱API请求失败: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('智谱API返回格式错误')
    }

    const aiMessage = data.choices[0].message.content

    return NextResponse.json({
      message: aiMessage,
      timestamp: new Date().toISOString(),
      source: 'zhipu',
      usage: data.usage
    })

  } catch (error) {
    console.error('智谱清言API错误:', error)
    
    // 如果API调用失败，返回友好的错误信息和备用建议
    return NextResponse.json({
      message: "抱歉，AI咨询服务暂时不可用。您可以：\n\n1. 浏览我们的知识科普馆获取专业育儿知识\n2. 进行相关的评估测试了解孩子发展状况\n3. 查看我们的培训课程获得系统性指导\n4. 稍后再试或联系我们的人工客服\n\n感谢您的理解！",
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: true
    }, { status: 200 }) // 返回200状态码，让前端正常显示错误信息
  }
}

// 处理GET请求，返回API状态信息
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: '智护童行AI咨询服务',
    features: [
      '专业育儿指导',
      '个性化建议',
      '科学理论支持',
      '实用方法推荐'
    ],
    hasApiKey: !!ZHIPU_API_KEY
  })
}
