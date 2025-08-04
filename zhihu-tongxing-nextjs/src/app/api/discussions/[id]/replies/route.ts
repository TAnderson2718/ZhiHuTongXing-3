import { NextRequest, NextResponse } from 'next/server'
import { validateAndSanitizeComment, ValidationRules, containsMaliciousScript } from '@/lib/validation'
import { getSession } from '@/lib/auth'


// Mock replies data - in a real app, this would be stored in a database
const mockReplies: { [discussionId: string]: any[] } = {
  '1': [
    {
      id: 1,
      author: '育儿专家李老师',
      avatar: '👨‍🏫',
      content: '培养阅读习惯确实需要耐心和方法。建议从孩子感兴趣的主题入手，比如他喜欢恐龙就选恐龙相关的绘本。另外，家长要以身作则，让孩子看到你也在阅读。',
      likes: 45,
      createdAt: '1小时前',
      isExpert: true,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      author: '温柔妈妈',
      avatar: '👩',
      content: '我家孩子之前也是这样，后来我发现他喜欢听故事，就先从音频故事开始，然后慢慢过渡到看图听故事，最后才是自己阅读。过程比较慢，但很有效。',
      likes: 32,
      createdAt: '30分钟前',
      isExpert: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      author: '超级奶爸',
      avatar: '👨',
      content: '建议设立阅读角，让孩子有专门的阅读空间。还可以和孩子一起制作简单的小书，让他参与创作过程，这样会更有兴趣。',
      likes: 28,
      createdAt: '15分钟前',
      isExpert: false,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: 4,
      author: '心理咨询师王老师',
      avatar: '👩‍⚕️',
      content: '二胎家庭的手足关系确实需要特别关注。建议给大宝单独的关注时间，让他感受到父母的爱没有因为二宝的到来而减少。',
      likes: 67,
      createdAt: '2小时前',
      isExpert: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  '3': [
    {
      id: 5,
      author: '营养师张老师',
      avatar: '👨‍⚕️',
      content: '孩子挑食是很常见的问题。建议尝试把蔬菜做成有趣的形状，或者让孩子参与烹饪过程，增加他们对食物的兴趣。',
      likes: 89,
      createdAt: '1小时前',
      isExpert: true,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    }
  ]
}

// GET - 获取讨论的回复列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id
    const replies = mockReplies[discussionId] || []

    // 按时间戳排序（最新的在前）
    const sortedReplies = replies.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      success: true,
      data: sortedReplies,
      count: sortedReplies.length
    })
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json(
      { success: false, error: '获取回复失败' },
      { status: 500 }
    )
  }
}

// POST - 创建新回复
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('POST request received for discussion:', params.id)

    const discussionId = params.id
    const body = await request.json()

    console.log('Request body:', body)

    // 基本验证
    const content = body.content?.trim()
    const author = body.author?.trim() || '匿名用户'
    const avatar = body.avatar || '👤'

    if (!content || content.length === 0) {
      return NextResponse.json(
        { success: false, error: '回复内容不能为空' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: '回复内容不能超过1000个字符' },
        { status: 400 }
      )
    }

    // 基本XSS防护
    const sanitizedContent = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')

    const sanitizedAuthor = author
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')

    console.log('Sanitized content:', sanitizedContent)
    console.log('Sanitized author:', sanitizedAuthor)

    // 检测恶意脚本
    if (sanitizedContent.toLowerCase().includes('script') ||
        sanitizedAuthor.toLowerCase().includes('script')) {
      console.log('Malicious script detected')

      // 记录安全事件
      console.warn('Malicious script detected in user input', {
        content: content.substring(0, 100), // 只记录前100个字符
        author: author.substring(0, 50),
        type: 'security-violation'
      })

      return NextResponse.json(
        { success: false, error: '检测到不安全的内容，请重新输入' },
        { status: 400 }
      )
    }

    // 初始化讨论的回复数组（如果不存在）
    if (!mockReplies[discussionId]) {
      mockReplies[discussionId] = []
    }

    // 生成新回复ID
    const allReplies = Object.values(mockReplies).flat()
    const maxId = allReplies.length > 0 ? Math.max(...allReplies.map(r => r.id)) : 0
    const newId = maxId + 1

    // 创建新回复
    const newReply = {
      id: newId,
      author: sanitizedAuthor,
      avatar,
      content: sanitizedContent,
      likes: 0,
      createdAt: '刚刚',
      isExpert: false,
      timestamp: new Date().toISOString()
    }

    // 添加到回复列表
    mockReplies[discussionId].push(newReply)

    console.log('Reply created successfully:', newReply)

    // 记录成功的回复创建
    console.info('Reply created successfully', {
      discussionId,
      replyId: newReply.id,
      author: sanitizedAuthor,
      contentLength: sanitizedContent.length,
      component: 'discussion-replies-api'
    })

    return NextResponse.json({
      success: true,
      data: newReply,
      message: '回复发表成功'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating reply:', error)

    // 记录API错误
    console.error('API Error in discussion replies', {
      endpoint: `/api/discussions/${params.id}/replies`,
      method: 'POST',
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      discussionId: params.id,
      component: 'discussion-replies-api'
    })

    return NextResponse.json(
      { success: false, error: '发表回复失败，请稍后重试' },
      { status: 500 }
    )
  }
}
