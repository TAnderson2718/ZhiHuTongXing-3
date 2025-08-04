#!/usr/bin/env node

/**
 * 智护童行媒体支持系统测试脚本
 * 
 * 用法: node scripts/test-media-system.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 智护童行媒体支持系统测试开始...\n');

// 测试配置
const tests = {
  directories: [
    'public/uploads',
    'public/uploads/images', 
    'public/uploads/videos',
    'public/uploads/documents'
  ],
  components: [
    'src/components/ui/EnhancedRichTextEditor.tsx',
    'src/components/ui/FileUpload.tsx',
    'src/lib/video-platforms.ts',
    'src/lib/cloud-storage.ts',
    'src/app/api/upload/route.ts'
  ],
  pages: [
    'src/app/admin/articles/new/page.tsx',
    'src/app/admin/articles/edit/[id]/page.tsx'
  ],
  config: [
    'next.config.js',
    '.env.example'
  ]
};

let passedTests = 0;
let totalTests = 0;

// 测试函数
function testExists(filePath, description) {
  totalTests++;
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    passedTests++;
    return true;
  } else {
    console.log(`❌ ${description} - 文件不存在: ${filePath}`);
    return false;
  }
}

function testDirectoryWritable(dirPath, description) {
  totalTests++;
  const fullPath = path.join(process.cwd(), dirPath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    // 测试写入权限
    const testFile = path.join(fullPath, '.test-write');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    
    console.log(`✅ ${description}`);
    passedTests++;
    return true;
  } catch (error) {
    console.log(`❌ ${description} - 错误: ${error.message}`);
    return false;
  }
}

function testFileContent(filePath, searchText, description) {
  totalTests++;
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${description} - 文件不存在: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}`);
      passedTests++;
      return true;
    } else {
      console.log(`❌ ${description} - 未找到预期内容`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - 错误: ${error.message}`);
    return false;
  }
}

// 开始测试
console.log('📁 测试目录结构...');
tests.directories.forEach(dir => {
  testDirectoryWritable(dir, `上传目录可写: ${dir}`);
});

console.log('\n🧩 测试核心组件...');
tests.components.forEach(component => {
  testExists(component, `核心组件存在: ${path.basename(component)}`);
});

console.log('\n📄 测试页面集成...');
tests.pages.forEach(page => {
  testExists(page, `页面文件存在: ${path.basename(page)}`);
  testFileContent(page, 'EnhancedRichTextEditor', `页面集成增强编辑器: ${path.basename(page)}`);
});

console.log('\n⚙️ 测试配置文件...');
tests.config.forEach(config => {
  testExists(config, `配置文件存在: ${config}`);
});

// 测试特定配置内容
testFileContent('next.config.js', 'aliyuncs.com', 'Next.js 配置包含阿里云域名');
testFileContent('next.config.js', 'myqcloud.com', 'Next.js 配置包含腾讯云域名');
testFileContent('.env.example', 'UPLOAD_MAX_SIZE', '环境变量包含上传配置');
testFileContent('.env.example', 'CLOUD_STORAGE_PROVIDER', '环境变量包含云存储配置');

console.log('\n🔧 测试视频平台支持...');
const videoPlatformsPath = 'src/lib/video-platforms.ts';
if (fs.existsSync(videoPlatformsPath)) {
  testFileContent(videoPlatformsPath, 'bilibili.com', '支持 Bilibili 平台');
  testFileContent(videoPlatformsPath, 'v.qq.com', '支持腾讯视频平台');
  testFileContent(videoPlatformsPath, 'iqiyi.com', '支持爱奇艺平台');
  testFileContent(videoPlatformsPath, 'youku.com', '支持优酷平台');
  testFileContent(videoPlatformsPath, 'youtube.com', '支持 YouTube 平台');
}

console.log('\n📤 测试文件上传 API...');
const uploadApiPath = 'src/app/api/upload/route.ts';
if (fs.existsSync(uploadApiPath)) {
  testFileContent(uploadApiPath, 'verifyAdminAuth', 'API 包含管理员认证');
  testFileContent(uploadApiPath, 'performSecurityCheck', 'API 包含安全检查');
  testFileContent(uploadApiPath, 'generateSafeFilename', 'API 包含文件名安全处理');
}

console.log('\n☁️ 测试云存储集成...');
const cloudStoragePath = 'src/lib/cloud-storage.ts';
if (fs.existsSync(cloudStoragePath)) {
  testFileContent(cloudStoragePath, 'AliyunOSSService', '支持阿里云 OSS');
  testFileContent(cloudStoragePath, 'TencentCOSService', '支持腾讯云 COS');
  testFileContent(cloudStoragePath, 'LocalStorageService', '支持本地存储');
}

// 测试结果汇总
console.log('\n' + '='.repeat(50));
console.log(`📊 测试结果汇总:`);
console.log(`✅ 通过: ${passedTests}/${totalTests}`);
console.log(`❌ 失败: ${totalTests - passedTests}/${totalTests}`);
console.log(`📈 成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 所有测试通过！媒体支持系统已正确安装和配置。');
  console.log('\n📋 下一步操作:');
  console.log('1. 复制 .env.example 到 .env.local 并配置环境变量');
  console.log('2. 运行 npm run dev 启动开发服务器');
  console.log('3. 访问 /admin/articles/new 测试富文本编辑器');
  console.log('4. 测试文件上传和视频嵌入功能');
  process.exit(0);
} else {
  console.log('\n⚠️ 部分测试失败，请检查上述错误信息并修复相关问题。');
  console.log('\n📖 参考文档: MEDIA_SYSTEM_GUIDE.md');
  process.exit(1);
}
