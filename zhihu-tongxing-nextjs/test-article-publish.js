#!/usr/bin/env node

/**
 * 文章发布功能测试脚本
 * 测试文章创建、发布、更新和删除功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3002';

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
        'Cookie': cookies || 'session=test' // 模拟登录状态
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
          
          // 尝试解析JSON
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

async function testArticleCreation() {
  console.log('📝 测试文章创建功能...\n');

  try {
    // 测试数据
    const testArticle = {
      title: '测试文章标题 - ' + new Date().toLocaleString(),
      excerpt: '这是一篇测试文章的摘要',
      content: '<p>这是测试文章的内容。</p><p>包含了<strong>粗体</strong>和<em>斜体</em>文本。</p>',
      category: 'life',
      tags: '测试,文章,发布',
      image: 'https://picsum.photos/800/400',
      status: 'draft'
    };

    console.log('1. 测试创建草稿文章');
    const createResponse = await makeRequest('/api/admin/articles', 'POST', testArticle);
    
    if (createResponse.statusCode === 200 && createResponse.data.success) {
      console.log('✅ 草稿文章创建成功');
      console.log(`   文章ID: ${createResponse.data.data.id}`);
      console.log(`   标题: ${createResponse.data.data.title}`);
      console.log(`   状态: ${createResponse.data.data.status}`);
      
      const articleId = createResponse.data.data.id;
      
      // 测试发布文章
      console.log('\n2. 测试发布文章');
      const publishData = {
        ...testArticle,
        status: 'published'
      };
      
      const publishResponse = await makeRequest(`/api/admin/articles/${articleId}`, 'PUT', publishData);
      
      if (publishResponse.statusCode === 200 && publishResponse.data.success) {
        console.log('✅ 文章发布成功');
        console.log(`   发布时间: ${publishResponse.data.data.publishedAt}`);
      } else {
        console.log(`❌ 文章发布失败 (状态码: ${publishResponse.statusCode})`);
        console.log(`   错误信息: ${publishResponse.data.error || '未知错误'}`);
      }
      
      // 测试获取文章
      console.log('\n3. 测试获取文章详情');
      const getResponse = await makeRequest(`/api/admin/articles/${articleId}`);
      
      if (getResponse.statusCode === 200 && getResponse.data.success) {
        console.log('✅ 文章获取成功');
        console.log(`   浏览量: ${getResponse.data.data.views}`);
      } else {
        console.log(`❌ 文章获取失败 (状态码: ${getResponse.statusCode})`);
      }
      
      return articleId;
      
    } else {
      console.log(`❌ 文章创建失败 (状态码: ${createResponse.statusCode})`);
      console.log(`   错误信息: ${createResponse.data.error || '未知错误'}`);
      return null;
    }

  } catch (error) {
    console.log(`❌ 文章创建测试失败: ${error.message}`);
    return null;
  }
}

async function testArticleList() {
  console.log('\n📋 测试文章列表功能...\n');

  try {
    console.log('1. 测试获取文章列表');
    const listResponse = await makeRequest('/api/admin/articles');
    
    if (listResponse.statusCode === 200 && listResponse.data.success) {
      console.log('✅ 文章列表获取成功');
      console.log(`   文章总数: ${listResponse.data.data.length}`);
      
      if (listResponse.data.data.length > 0) {
        const firstArticle = listResponse.data.data[0];
        console.log(`   第一篇文章: ${firstArticle.title}`);
        console.log(`   状态: ${firstArticle.status}`);
        console.log(`   分类: ${firstArticle.category}`);
      }
    } else {
      console.log(`❌ 文章列表获取失败 (状态码: ${listResponse.statusCode})`);
      console.log(`   错误信息: ${listResponse.data.error || '未知错误'}`);
    }

  } catch (error) {
    console.log(`❌ 文章列表测试失败: ${error.message}`);
  }
}

async function testValidation() {
  console.log('\n🔍 测试数据验证功能...\n');

  try {
    // 测试缺少必填字段
    console.log('1. 测试缺少标题的情况');
    const invalidArticle = {
      content: '只有内容没有标题',
      category: 'life',
      status: 'draft'
    };

    const validationResponse = await makeRequest('/api/admin/articles', 'POST', invalidArticle);
    
    if (validationResponse.statusCode === 400) {
      console.log('✅ 数据验证正常工作');
      console.log(`   错误信息: ${validationResponse.data.error}`);
    } else {
      console.log(`❌ 数据验证异常 (状态码: ${validationResponse.statusCode})`);
    }

  } catch (error) {
    console.log(`❌ 数据验证测试失败: ${error.message}`);
  }
}

async function testAuthentication() {
  console.log('\n🔐 测试认证功能...\n');

  try {
    console.log('1. 测试未认证访问');
    const unauthResponse = await makeRequest('/api/admin/articles', 'POST', {
      title: '测试文章',
      content: '测试内容',
      category: 'life',
      status: 'draft'
    }, ''); // 不传递认证Cookie

    if (unauthResponse.statusCode === 401) {
      console.log('✅ 认证保护正常工作');
      console.log(`   错误信息: ${unauthResponse.data.error}`);
    } else {
      console.log(`❌ 认证保护异常 (状态码: ${unauthResponse.statusCode})`);
    }

  } catch (error) {
    console.log(`❌ 认证测试失败: ${error.message}`);
  }
}

async function testPageAccess() {
  console.log('\n🌐 测试页面访问...\n');

  try {
    console.log('1. 测试新建文章页面');
    const newPageResponse = await makeRequest('/admin/articles/new');
    
    if (newPageResponse.statusCode === 200) {
      console.log('✅ 新建文章页面可访问');
    } else {
      console.log(`❌ 新建文章页面不可访问 (状态码: ${newPageResponse.statusCode})`);
    }

    console.log('2. 测试文章管理页面');
    const listPageResponse = await makeRequest('/admin/articles');
    
    if (listPageResponse.statusCode === 200) {
      console.log('✅ 文章管理页面可访问');
    } else {
      console.log(`❌ 文章管理页面不可访问 (状态码: ${listPageResponse.statusCode})`);
    }

  } catch (error) {
    console.log(`❌ 页面访问测试失败: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 开始文章发布功能测试\n');
  console.log('='.repeat(50) + '\n');

  // 运行所有测试
  await testPageAccess();
  await testAuthentication();
  await testValidation();
  await testArticleList();
  const createdArticleId = await testArticleCreation();

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('✨ 测试完成！\n');
  
  console.log('📋 测试总结:');
  console.log('1. 页面访问测试 - 检查新建和管理页面是否可访问');
  console.log('2. 认证功能测试 - 验证API权限保护');
  console.log('3. 数据验证测试 - 检查必填字段验证');
  console.log('4. 文章列表测试 - 验证文章列表获取');
  console.log('5. 文章创建测试 - 完整的创建、发布、获取流程');
  
  console.log('\n💡 提示: 请在浏览器中访问以下页面进行手动测试:');
  console.log(`   - 新建文章: ${BASE_URL}/admin/articles/new`);
  console.log(`   - 文章管理: ${BASE_URL}/admin/articles`);
  
  if (createdArticleId) {
    console.log(`   - 编辑文章: ${BASE_URL}/admin/articles/edit/${createdArticleId}`);
  }
}

// 运行测试
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  makeRequest,
  testArticleCreation,
  testArticleList,
  testValidation,
  testAuthentication,
  testPageAccess,
  runAllTests
};
