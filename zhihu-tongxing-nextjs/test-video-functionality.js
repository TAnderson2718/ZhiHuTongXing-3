#!/usr/bin/env node

/**
 * 视频功能测试脚本
 * 测试视频管理系统和第三方视频平台集成功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3002';

// 测试用的视频URL
const TEST_VIDEO_URLS = [
  'https://www.bilibili.com/video/BV1xx411c7mu',
  'https://v.qq.com/x/cover/mzc00200mp8vo9b/u0041aa087j.html',
  'https://v.youku.com/v_show/id_XNDkzNjQxNjY4MA==.html',
  'https://www.iqiyi.com/v_19rr7aqk45.html',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
];

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'session=test' // 模拟登录状态
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

async function testVideoAPI() {
  console.log('🎬 测试视频管理API...\n');

  try {
    // 测试获取视频列表
    console.log('1. 测试获取视频列表');
    const listResponse = await makeRequest('/api/admin/videos');
    
    if (listResponse.statusCode === 200) {
      console.log('✅ 视频列表API正常');
      console.log(`   返回 ${listResponse.data.videos?.length || 0} 个视频`);
      
      // 检查视频URL是否可访问
      if (listResponse.data.videos && listResponse.data.videos.length > 0) {
        const firstVideo = listResponse.data.videos[0];
        console.log(`   第一个视频: ${firstVideo.title}`);
        console.log(`   视频URL: ${firstVideo.url}`);
        
        // 测试视频URL是否可访问
        try {
          const videoResponse = await makeRequest(firstVideo.url.replace(BASE_URL, ''));
          if (videoResponse.statusCode === 200) {
            console.log('✅ 视频文件可访问');
          } else {
            console.log(`❌ 视频文件不可访问 (状态码: ${videoResponse.statusCode})`);
          }
        } catch (error) {
          console.log(`❌ 视频文件访问失败: ${error.message}`);
        }
      }
    } else {
      console.log(`❌ 视频列表API失败 (状态码: ${listResponse.statusCode})`);
      console.log(`   错误信息: ${listResponse.data.error || '未知错误'}`);
    }

  } catch (error) {
    console.log(`❌ 视频API测试失败: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

async function testVideoParser() {
  console.log('🔗 测试第三方视频平台解析...\n');

  // 由于无法直接调用前端模块，我们测试页面是否可访问
  try {
    console.log('1. 测试视频解析测试页面');
    const testPageResponse = await makeRequest('/admin/test-video');
    
    if (testPageResponse.statusCode === 200) {
      console.log('✅ 视频解析测试页面可访问');
      
      // 检查页面是否包含预期内容
      if (testPageResponse.body.includes('第三方视频平台集成测试')) {
        console.log('✅ 测试页面内容正确');
      } else {
        console.log('❌ 测试页面内容异常');
      }
    } else {
      console.log(`❌ 视频解析测试页面不可访问 (状态码: ${testPageResponse.statusCode})`);
    }

    console.log('\n2. 测试支持的视频平台URL格式');
    TEST_VIDEO_URLS.forEach((url, index) => {
      const platform = getPlatformFromUrl(url);
      console.log(`   ${index + 1}. ${platform}: ${url}`);
    });

  } catch (error) {
    console.log(`❌ 视频解析测试失败: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

function getPlatformFromUrl(url) {
  if (url.includes('bilibili.com')) return 'Bilibili';
  if (url.includes('qq.com')) return '腾讯视频';
  if (url.includes('youku.com')) return '优酷';
  if (url.includes('iqiyi.com')) return '爱奇艺';
  if (url.includes('youtube.com')) return 'YouTube';
  return '未知平台';
}

async function testRichTextEditor() {
  console.log('📝 测试富文本编辑器...\n');

  try {
    console.log('1. 测试文章创建页面');
    const newArticleResponse = await makeRequest('/admin/articles/new');
    
    if (newArticleResponse.statusCode === 200) {
      console.log('✅ 文章创建页面可访问');
      
      // 检查页面是否包含富文本编辑器
      if (newArticleResponse.body.includes('EnhancedRichTextEditor') || 
          newArticleResponse.body.includes('插入视频')) {
        console.log('✅ 富文本编辑器已集成');
      } else {
        console.log('❓ 无法确认富文本编辑器状态（需要客户端渲染）');
      }
    } else {
      console.log(`❌ 文章创建页面不可访问 (状态码: ${newArticleResponse.statusCode})`);
    }

  } catch (error) {
    console.log(`❌ 富文本编辑器测试失败: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

async function runAllTests() {
  console.log('🚀 开始视频功能测试\n');
  console.log('='.repeat(50) + '\n');

  await testVideoAPI();
  await testVideoParser();
  await testRichTextEditor();

  console.log('✨ 测试完成！\n');
  console.log('📋 测试总结:');
  console.log('1. 视频管理API - 检查视频列表和文件访问');
  console.log('2. 第三方视频平台解析 - 检查测试页面和支持的平台');
  console.log('3. 富文本编辑器 - 检查视频插入功能集成');
  console.log('\n💡 提示: 请在浏览器中访问以下页面进行完整测试:');
  console.log(`   - 视频管理: ${BASE_URL}/admin/videos`);
  console.log(`   - 视频解析测试: ${BASE_URL}/admin/test-video`);
  console.log(`   - 文章编辑: ${BASE_URL}/admin/articles/new`);
}

// 运行测试
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  makeRequest,
  testVideoAPI,
  testVideoParser,
  testRichTextEditor,
  runAllTests
};
