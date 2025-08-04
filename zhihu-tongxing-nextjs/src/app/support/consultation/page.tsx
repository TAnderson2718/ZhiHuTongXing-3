'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Send, Bot, User, Clock } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ConsultationPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '您好！我是智护童行的AI咨询助手，由智谱清言提供技术支持。我可以帮助您解答育儿相关的问题，提供专业的指导和建议。请告诉我您遇到的困难，我会尽力为您提供科学、实用的解决方案。',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // 调用智谱清言API
      const response = await fetch('/api/zhipu-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: conversationHistory
        })
      })

      const data = await response.json()

      if (response.ok) {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: data.message,
          timestamp: new Date(),
          source: data.source
        }

        setMessages(prev => [...prev, botResponse])

        // 更新对话历史
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: currentInput },
          { role: 'assistant', content: data.message }
        ])
      } else {
        throw new Error(data.error || '请求失败')
      }
    } catch (error) {
      console.error('AI咨询错误:', error)
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: '抱歉，AI咨询服务暂时不可用。您可以稍后再试，或者浏览我们的知识科普馆获取专业育儿知识。',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/support" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回支持中心
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">在线客服</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI咨询助手</h3>
                    <p className="text-sm text-gray-600">专业育儿指导 • 24/7在线</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.isError
                          ? 'bg-red-50 text-red-900 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                          {message.type === 'bot' && message.source && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              message.source === 'zhipu'
                                ? 'bg-green-100 text-green-600'
                                : message.source === 'mock'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {message.source === 'zhipu' ? '智谱清言' :
                               message.source === 'mock' ? '模拟回复' : '系统回复'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="输入您的问题..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">快速帮助</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setInputMessage('如何建立睡眠routine？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  如何建立睡眠routine？
                </button>
                <button
                  onClick={() => setInputMessage('孩子发脾气怎么办？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  孩子发脾气怎么办？
                </button>
                <button
                  onClick={() => setInputMessage('如何培养孩子独立性？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  如何培养孩子独立性？
                </button>
                <button
                  onClick={() => setInputMessage('安全教育要点有哪些？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  安全教育要点
                </button>
                <button
                  onClick={() => setInputMessage('如何改善亲子关系？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  如何改善亲子关系？
                </button>
                <button
                  onClick={() => setInputMessage('孩子学习困难怎么办？')}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  孩子学习困难怎么办？
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">需要更多帮助？</h3>
              <div className="space-y-3">
                <Link href="/support/appointment">
                  <Button variant="outline" className="w-full">
                    预约专家咨询
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    加入社区讨论
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-900">服务时间</span>
              </div>
              <p className="text-sm text-blue-700">
                AI助手：24/7全天候<br />
                人工客服：9:00-21:00
              </p>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-900">AI技术支持</span>
              </div>
              <p className="text-sm text-green-700">
                本服务由智谱清言提供AI技术支持，基于专业的育儿知识库为您提供科学、个性化的育儿指导。
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
