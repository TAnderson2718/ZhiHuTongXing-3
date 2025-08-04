#!/usr/bin/env node

/**
 * 简单的文章发布功能测试
 */

const http = require('http');

const BASE_URL = 'http://localhost:3003';

function makeRequest(path, method = 'GET', data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          };
          
          try {
            result.data = JSON.parse(body);
          } catch (e) {
            result.data = body;
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testLogin() {
  console.log('🔐 测试管理员登录...');
  
  try {
    const loginData = {
      email: 'admin@zhihutongxing.com',
      password: 'Admin@2025!Secure#'
    };

    const response = await makeRequest('/api/auth/login', 'POST', loginData);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 管理员登录成功');
      
      // 提取Cookie
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader && setCookieHeader.length > 0) {
        const sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('session='));
        if (sessionCookie) {
          const cookieValue = sessionCookie.split(';')[0];
          console.log(`   获取到会话Cookie: ${cookieValue.substring(0, 20)}...`);
          return cookieValue;
        }
      }
      
      console.log('❌ 未找到会话Cookie');
      return null;
    } else {
      console.log(`❌ 登录失败 (状态码: ${response.statusCode})`);
      console.log(`   错误信息: ${response.data.error || '未知错误'}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ 登录测试失败: ${error.message}`);
    return null;
  }
}

async function testArticleCreation(sessionCookie) {
  console.log('\n📝 测试文章创建...');
  
  if (!sessionCookie) {
    console.log('❌ 没有有效的会话Cookie，跳过测试');
    return;
  }

  try {
    const testArticle = {
      title: '测试文章 - ' + new Date().toLocaleString(),
      excerpt: '这是一篇测试文章的摘要',
      content: '<p>这是测试文章的内容。</p><p>包含了<strong>粗体</strong>和<em>斜体</em>文本。</p>',
      category: 'life',
      tags: '测试,文章,发布',
      image: 'https://picsum.photos/800/400',
      status: 'published'
    };

    console.log('1. 发送文章创建请求...');
    const response = await makeRequest('/api/admin/articles', 'POST', testArticle, sessionCookie);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 文章创建成功！');
      console.log(`   文章ID: ${response.data.data.id}`);
      console.log(`   标题: ${response.data.data.title}`);
      console.log(`   状态: ${response.data.data.status}`);
      console.log(`   发布时间: ${response.data.data.publishedAt}`);
      
      return response.data.data.id;
    } else {
      console.log(`❌ 文章创建失败 (状态码: ${response.statusCode})`);
      console.log(`   错误信息: ${response.data.error || '未知错误'}`);
      console.log(`   响应体: ${JSON.stringify(response.data, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ 文章创建测试失败: ${error.message}`);
    return null;
  }
}

async function testArticleList(sessionCookie) {
  console.log('\n📋 测试文章列表获取...');
  
  if (!sessionCookie) {
    console.log('❌ 没有有效的会话Cookie，跳过测试');
    return;
  }

  try {
    const response = await makeRequest('/api/admin/articles', 'GET', null, sessionCookie);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 文章列表获取成功！');
      console.log(`   文章总数: ${response.data.data.length}`);
      
      if (response.data.data.length > 0) {
        const firstArticle = response.data.data[0];
        console.log(`   最新文章: ${firstArticle.title}`);
        console.log(`   状态: ${firstArticle.status}`);
      }
    } else {
      console.log(`❌ 文章列表获取失败 (状态码: ${response.statusCode})`);
      console.log(`   错误信息: ${response.data.error || '未知错误'}`);
    }
  } catch (error) {
    console.log(`❌ 文章列表测试失败: ${error.message}`);
  }
}

async function runTest() {
  console.log('🚀 开始文章发布功能测试\n');
  console.log('='.repeat(50));
  
  // 1. 先登录获取会话
  const sessionCookie = await testLogin();
  
  // 2. 测试文章列表
  await testArticleList(sessionCookie);
  
  // 3. 测试文章创建
  const articleId = await testArticleCreation(sessionCookie);
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ 测试完成！');
  
  if (articleId) {
    console.log('\n🎉 文章发布功能正常工作！');
    console.log(`💡 你可以在浏览器中访问 ${BASE_URL}/admin/articles 查看创建的文章`);
  } else {
    console.log('\n⚠️  文章发布功能存在问题，请检查上述错误信息');
  }
}

// 运行测试
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { runTest };
