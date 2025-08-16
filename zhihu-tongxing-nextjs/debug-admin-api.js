// 测试管理后台API端点
const fetch = require('node-fetch');

async function testAdminAPI() {
  try {
    console.log('🔍 测试管理后台API端点...\n');
    
    const baseUrl = 'http://localhost:3000';
    
    // 测试评估工具列表API
    console.log('📡 测试 /api/admin/assessments...');
    
    const response = await fetch(`${baseUrl}/api/admin/assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 注意：实际使用时需要包含认证cookie
      }
    });
    
    console.log(`状态码: ${response.status}`);
    console.log(`状态文本: ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API响应成功:');
      console.log('数据结构:', Object.keys(data));
      
      if (data.assessments) {
        console.log(`\n📊 找到 ${data.assessments.length} 个评估工具:`);
        data.assessments.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   ID: ${tool.id}`);
          console.log(`   Status: ${tool.status}`);
          console.log(`   Type: ${tool.type}`);
          console.log('   ---');
        });
      }
      
      if (data.pagination) {
        console.log('\n📄 分页信息:', data.pagination);
      }
    } else {
      const errorData = await response.text();
      console.log('\n❌ API请求失败:');
      console.log('错误响应:', errorData);
    }
    
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🚀 开始调试管理后台API...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ 服务器未运行，请先启动开发服务器:');
    console.log('   npm run dev');
    return;
  }
  
  console.log('✅ 服务器正在运行\n');
  await testAdminAPI();
}

main();
