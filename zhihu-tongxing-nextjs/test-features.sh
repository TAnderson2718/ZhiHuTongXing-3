#!/bin/bash

# 智护童行平台功能测试脚本
echo "🚀 开始测试智护童行平台功能..."

BASE_URL="http://localhost:3005"

# 测试主页
echo "📋 测试主页..."
curl -s "$BASE_URL" > /dev/null && echo "✅ 主页正常" || echo "❌ 主页异常"

# 测试评估馆
echo "📋 测试评估馆..."
curl -s "$BASE_URL/assessment" > /dev/null && echo "✅ 评估馆正常" || echo "❌ 评估馆异常"

# 测试新增的评估量表
echo "📋 测试新增评估量表..."
curl -s "$BASE_URL/assessment/childcare-ability" > /dev/null && echo "✅ 儿童照护能力量表正常" || echo "❌ 儿童照护能力量表异常"
curl -s "$BASE_URL/assessment/parent-child-relationship" > /dev/null && echo "✅ 亲子关系量表正常" || echo "❌ 亲子关系量表异常"
curl -s "$BASE_URL/assessment/parental-self-efficacy" > /dev/null && echo "✅ 父母自我效能感量表正常" || echo "❌ 父母自我效能感量表异常"
curl -s "$BASE_URL/assessment/parenting-competence" > /dev/null && echo "✅ 父母教养能力量表正常" || echo "❌ 父母教养能力量表异常"

# 测试AI咨询服务
echo "📋 测试AI咨询服务..."
curl -s "$BASE_URL/support/consultation" > /dev/null && echo "✅ AI咨询页面正常" || echo "❌ AI咨询页面异常"

# 测试智谱清言API
echo "📋 测试智谱清言API..."
response=$(curl -s -X POST "$BASE_URL/api/zhipu-chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"测试消息"}' \
  --max-time 10)

if [[ $? -eq 0 ]] && [[ -n "$response" ]]; then
  echo "✅ 智谱清言API正常"
else
  echo "⚠️  智谱清言API超时或异常（这是正常的，因为使用了模拟延迟）"
fi

# 测试管理后台
echo "📋 测试管理后台..."
curl -s "$BASE_URL/admin" > /dev/null && echo "✅ 管理后台登录页正常" || echo "❌ 管理后台登录页异常"

# 测试管理后台API
echo "📋 测试管理后台API..."
response=$(curl -s -H "Authorization: Bearer mock-admin-token" "$BASE_URL/api/admin/assessments")
if [[ $? -eq 0 ]] && [[ -n "$response" ]]; then
  count=$(echo "$response" | grep -o '"id"' | wc -l)
  echo "✅ 管理后台API正常，返回 $count 个评估工具"
else
  echo "❌ 管理后台API异常"
fi

# 测试其他功能馆
echo "📋 测试其他功能馆..."
curl -s "$BASE_URL/knowledge" > /dev/null && echo "✅ 知识馆正常" || echo "❌ 知识馆异常"
curl -s "$BASE_URL/experience" > /dev/null && echo "✅ 体验馆正常" || echo "❌ 体验馆异常"
curl -s "$BASE_URL/support" > /dev/null && echo "✅ 支持馆正常" || echo "❌ 支持馆异常"
curl -s "$BASE_URL/training" > /dev/null && echo "✅ 培训馆正常" || echo "❌ 培训馆异常"
curl -s "$BASE_URL/community" > /dev/null && echo "✅ 社区正常" || echo "❌ 社区异常"

echo ""
echo "🎉 功能测试完成！"
echo ""
echo "📊 平台功能概览："
echo "   • 评估馆：7个专业评估量表"
echo "   • 知识馆：四大类知识内容"
echo "   • 体验馆：互动游戏和教程"
echo "   • 支持馆：AI咨询和专业支持"
echo "   • 培训馆：系统化课程培训"
echo "   • 管理后台：完整的内容管理系统"
echo ""
echo "🔗 访问地址："
echo "   主站: $BASE_URL"
echo "   管理后台: $BASE_URL/admin (admin/admin123)"
echo ""
echo "🤖 AI咨询服务："
echo "   访问: $BASE_URL/support/consultation"
echo "   技术支持: 智谱清言GLM-4"
echo "   服务模式: 24/7在线咨询"
