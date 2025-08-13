#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证所有生产环境必需的配置和依赖
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function success(message) {
  log('green', `✅ ${message}`)
}

function error(message) {
  log('red', `❌ ${message}`)
}

function warning(message) {
  log('yellow', `⚠️  ${message}`)
}

function info(message) {
  log('blue', `ℹ️  ${message}`)
}

// 检查项目
const checks = []

// 1. 检查环境变量
function checkEnvironmentVariables() {
  info('检查环境变量配置...')
  
  const requiredEnvVars = [
    'SENTRY_DSN',
    'NEXT_PUBLIC_SENTRY_DSN',
    'DATABASE_URL',
    'SESSION_SECRET',
    'NEXTAUTH_SECRET',
  ]
  
  const missingVars = []
  const weakVars = []
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName]
    if (!value) {
      missingVars.push(varName)
    } else if (varName.includes('SECRET') && value.length < 32) {
      weakVars.push(varName)
    }
  })
  
  if (missingVars.length === 0) {
    success('所有必需的环境变量都已设置')
  } else {
    error(`缺少环境变量: ${missingVars.join(', ')}`)
    return false
  }
  
  if (weakVars.length > 0) {
    warning(`以下密钥变量可能过于简单: ${weakVars.join(', ')}`)
  }
  
  return true
}

// 2. 检查Sentry配置
function checkSentryConfiguration() {
  info('检查Sentry配置...')
  
  const sentryFiles = [
    'sentry.client.config.ts',
    'sentry.server.config.ts',
    'sentry.edge.config.ts',
  ]
  
  let allFilesExist = true
  sentryFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      error(`Sentry配置文件缺失: ${file}`)
      allFilesExist = false
    }
  })
  
  if (allFilesExist) {
    success('Sentry配置文件完整')
  }
  
  // 检查Sentry依赖
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  if (packageJson.dependencies['@sentry/nextjs']) {
    success('Sentry依赖已安装')
  } else {
    error('Sentry依赖未安装')
    allFilesExist = false
  }
  
  return allFilesExist
}

// 3. 检查数据库配置
function checkDatabaseConfiguration() {
  info('检查数据库配置...')
  
  if (!fs.existsSync('prisma/schema.prisma')) {
    error('Prisma schema文件缺失')
    return false
  }
  
  try {
    execSync('npx prisma validate', { stdio: 'pipe' })
    success('Prisma schema验证通过')
  } catch (error) {
    error('Prisma schema验证失败')
    return false
  }
  
  return true
}

// 4. 检查构建配置
function checkBuildConfiguration() {
  info('检查构建配置...')
  
  const requiredFiles = [
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.ts',
  ]
  
  let allFilesExist = true
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      error(`配置文件缺失: ${file}`)
      allFilesExist = false
    }
  })
  
  if (allFilesExist) {
    success('构建配置文件完整')
  }
  
  return allFilesExist
}

// 5. 检查安全配置
function checkSecurityConfiguration() {
  info('检查安全配置...')
  
  let securityScore = 0
  
  // 检查中间件
  if (fs.existsSync('src/middleware.ts')) {
    success('中间件文件存在')
    securityScore++
  } else {
    warning('建议添加中间件以增强安全性')
  }
  
  // 检查环境变量安全性
  const sessionSecret = process.env.SESSION_SECRET
  if (sessionSecret && sessionSecret.length >= 32) {
    success('SESSION_SECRET强度足够')
    securityScore++
  } else {
    error('SESSION_SECRET过于简单或缺失')
  }
  
  return securityScore >= 1
}

// 6. 检查健康检查端点
function checkHealthEndpoints() {
  info('检查健康检查端点...')
  
  const healthEndpoint = 'src/app/api/health/route.ts'
  if (fs.existsSync(healthEndpoint)) {
    success('健康检查端点存在')
    return true
  } else {
    error('健康检查端点缺失')
    return false
  }
}

// 7. 检查Docker配置
function checkDockerConfiguration() {
  info('检查Docker配置...')
  
  const dockerFiles = ['Dockerfile', '.dockerignore']
  let allFilesExist = true
  
  dockerFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      error(`Docker文件缺失: ${file}`)
      allFilesExist = false
    }
  })
  
  if (allFilesExist) {
    success('Docker配置文件完整')
  }
  
  return allFilesExist
}

// 8. 运行类型检查
function runTypeCheck() {
  info('运行TypeScript类型检查...')
  
  try {
    execSync('npm run type-check', { stdio: 'pipe' })
    success('TypeScript类型检查通过')
    return true
  } catch (error) {
    error('TypeScript类型检查失败')
    console.log(error.stdout?.toString())
    return false
  }
}

// 9. 运行代码检查
function runLinting() {
  info('运行代码质量检查...')
  
  try {
    execSync('npm run lint', { stdio: 'pipe' })
    success('代码质量检查通过')
    return true
  } catch (error) {
    error('代码质量检查失败')
    console.log(error.stdout?.toString())
    return false
  }
}

// 主函数
async function main() {
  console.log('\n🚀 开始部署前检查...\n')
  
  const checkResults = [
    checkEnvironmentVariables(),
    checkSentryConfiguration(),
    checkDatabaseConfiguration(),
    checkBuildConfiguration(),
    checkSecurityConfiguration(),
    checkHealthEndpoints(),
    checkDockerConfiguration(),
    runTypeCheck(),
    runLinting(),
  ]
  
  const passedChecks = checkResults.filter(Boolean).length
  const totalChecks = checkResults.length
  
  console.log('\n📊 检查结果:')
  console.log(`通过: ${passedChecks}/${totalChecks}`)
  
  if (passedChecks === totalChecks) {
    success('\n🎉 所有检查通过！项目已准备好部署。')
    process.exit(0)
  } else {
    error(`\n💥 ${totalChecks - passedChecks} 项检查失败。请修复问题后重新运行检查。`)
    process.exit(1)
  }
}

// 运行检查
main().catch(error => {
  error('检查过程中发生错误:', error.message)
  process.exit(1)
})
