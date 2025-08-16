// 测试管理员登录和发布功能
const fetch = require('node-fetch');

async function testAdminLogin() {
  try {
    console.log('🔐 测试管理员登录...\n');
    
    const baseUrl = 'http://localhost:3000';
    
    // 1. 尝试管理员登录
    console.log('📡 尝试管理员登录...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@zhihutongxing.com',  // 管理员邮箱
        password: 'Admin@2025!Secure#'  // 从.env.example中的默认密码
      })
    });
    
    console.log(`登录状态码: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ 登录成功:', loginData);
      
      // 获取cookies
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 获取到cookies:', cookies);
      
      // 2. 使用cookies测试评估工具API
      console.log('\n📡 测试评估工具API...');
      const assessmentResponse = await fetch(`${baseUrl}/api/admin/assessments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        }
      });
      
      console.log(`评估工具API状态码: ${assessmentResponse.status}`);
      
      if (assessmentResponse.ok) {
        const assessmentData = await assessmentResponse.json();
        console.log('✅ 评估工具API成功:');
        console.log('数据结构:', Object.keys(assessmentData));
        
        if (assessmentData.assessments) {
          console.log(`\n📊 找到 ${assessmentData.assessments.length} 个评估工具:`);
          assessmentData.assessments.forEach((tool, index) => {
            console.log(`${index + 1}. ${tool.name}`);
            console.log(`   Status: ${tool.status || 'undefined'}`);
            console.log(`   isActive: ${tool.isActive || 'undefined'}`);
            console.log('   ---');
          });
          
          // 3. 测试状态切换功能
          if (assessmentData.assessments.length > 0) {
            const testTool = assessmentData.assessments[0];
            console.log(`\n🔄 测试状态切换功能 - 工具: ${testTool.name}`);
            console.log(`当前状态: ${testTool.status}`);
            
            const newStatus = testTool.status === 'draft' ? 'active' : 'draft';
            console.log(`尝试切换到: ${newStatus}`);
            
            const updateResponse = await fetch(`${baseUrl}/api/admin/assessments`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies || ''
              },
              body: JSON.stringify({
                id: testTool.id,
                status: newStatus
              })
            });
            
            console.log(`状态更新API状态码: ${updateResponse.status}`);
            
            if (updateResponse.ok) {
              const updateData = await updateResponse.json();
              console.log('✅ 状态更新成功:', updateData);
            } else {
              const updateError = await updateResponse.text();
              console.log('❌ 状态更新失败:', updateError);
            }
          }
        }
      } else {
        const assessmentError = await assessmentResponse.text();
        console.log('❌ 评估工具API失败:', assessmentError);
      }
      
    } else {
      const loginError = await loginResponse.text();
      console.log('❌ 登录失败:', loginError);
      
      // 尝试其他可能的密码
      console.log('\n🔄 尝试其他密码...');
      const altPasswords = ['admin', 'password', '123456', 'Admin123!'];

      for (const password of altPasswords) {
        console.log(`尝试密码: ${password}`);
        const altLoginResponse = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@zhihutongxing.com',
            password: password
          })
        });
        
        if (altLoginResponse.ok) {
          console.log(`✅ 密码 "${password}" 登录成功!`);
          break;
        } else {
          console.log(`❌ 密码 "${password}" 登录失败`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

testAdminLogin();
