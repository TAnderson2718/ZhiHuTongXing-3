// 测试生产服务器API
const fetch = require('node-fetch');

async function testProductionAPI() {
  try {
    console.log('🔍 测试生产服务器API...\n');
    
    const baseUrl = 'http://1.116.117.78:3000';
    
    // 测试评估工具列表API
    console.log('📡 测试生产服务器 /api/admin/assessments...');
    
    const response = await fetch(`${baseUrl}/api/admin/assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`状态码: ${response.status}`);
    console.log(`状态文本: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ 生产API响应成功:');
      console.log('数据结构:', Object.keys(data));
      
      if (data.assessments) {
        console.log(`\n📊 生产服务器找到 ${data.assessments.length} 个评估工具:`);
        data.assessments.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   ID: ${tool.id}`);
          console.log(`   Status: ${tool.status || 'undefined'}`);
          console.log(`   Type: ${tool.type}`);
          console.log(`   isActive: ${tool.isActive || 'undefined'}`);
          console.log('   ---');
        });
      }
      
      if (data.pagination) {
        console.log('\n📄 分页信息:', data.pagination);
      }
    } else {
      const errorData = await response.text();
      console.log('\n❌ 生产API请求失败:');
      console.log('错误响应:', errorData);
    }
    
    // 对比本地API
    console.log('\n🔄 对比本地API...');
    const localResponse = await fetch('http://localhost:3000/api/admin/assessments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`本地API状态码: ${localResponse.status}`);
    if (localResponse.status === 401) {
      console.log('本地API返回401 (未授权) - 这是正常的');
    }
    
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
  }
}

testProductionAPI();
