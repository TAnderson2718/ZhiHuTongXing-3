#!/usr/bin/env node

/**
 * 调试自动化脚本
 * 用于自动化错误监控、日志分析和问题诊断
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const CONFIG = {
  healthCheckUrl: process.env.HEALTH_CHECK_URL || 'http://localhost:3000/api/health',
  sentryTestUrl: process.env.SENTRY_TEST_URL || 'http://localhost:3000/api/sentry-test',
  logDir: path.join(__dirname, '../logs'),
  maxLogFiles: 10,
  checkInterval: 30000, // 30秒
}

// 创建日志目录
if (!fs.existsSync(CONFIG.logDir)) {
  fs.mkdirSync(CONFIG.logDir, { recursive: true })
}

// 日志函数
function log(level, message, data = null) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    data,
    pid: process.pid,
  }
  
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`)
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2))
  }
  
  // 写入日志文件
  const logFile = path.join(CONFIG.logDir, `debug-${new Date().toISOString().split('T')[0]}.log`)
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')
}

// 健康检查
async function performHealthCheck() {
  try {
    const response = await fetch(CONFIG.healthCheckUrl)
    const data = await response.json()
    
    if (response.ok) {
      log('info', 'Health check passed', data)
      return { success: true, data }
    } else {
      log('error', 'Health check failed', data)
      return { success: false, data }
    }
  } catch (error) {
    log('error', 'Health check error', { error: error.message })
    return { success: false, error: error.message }
  }
}

// Sentry 连接测试
async function testSentryConnection() {
  try {
    const response = await fetch(`${CONFIG.sentryTestUrl}?type=info`)
    const data = await response.json()
    
    if (response.ok) {
      log('info', 'Sentry connection test passed', data)
      return { success: true, data }
    } else {
      log('error', 'Sentry connection test failed', data)
      return { success: false, data }
    }
  } catch (error) {
    log('error', 'Sentry connection test error', { error: error.message })
    return { success: false, error: error.message }
  }
}

// 系统资源检查
function checkSystemResources() {
  try {
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    const uptime = process.uptime()
    
    const systemInfo = {
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: Math.round(uptime) + ' seconds',
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
    }
    
    log('info', 'System resources check', systemInfo)
    
    // 检查内存使用是否过高
    const heapUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    if (heapUsagePercent > 80) {
      log('warning', `High memory usage detected: ${heapUsagePercent.toFixed(2)}%`)
    }
    
    return systemInfo
  } catch (error) {
    log('error', 'System resources check error', { error: error.message })
    return null
  }
}

// 日志文件清理
function cleanupLogFiles() {
  try {
    const files = fs.readdirSync(CONFIG.logDir)
      .filter(file => file.startsWith('debug-') && file.endsWith('.log'))
      .map(file => ({
        name: file,
        path: path.join(CONFIG.logDir, file),
        mtime: fs.statSync(path.join(CONFIG.logDir, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime)
    
    if (files.length > CONFIG.maxLogFiles) {
      const filesToDelete = files.slice(CONFIG.maxLogFiles)
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path)
        log('info', `Deleted old log file: ${file.name}`)
      })
    }
  } catch (error) {
    log('error', 'Log cleanup error', { error: error.message })
  }
}

// 错误分析
function analyzeErrors() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const logFile = path.join(CONFIG.logDir, `debug-${today}.log`)
    
    if (!fs.existsSync(logFile)) {
      log('info', 'No log file found for today')
      return
    }
    
    const logContent = fs.readFileSync(logFile, 'utf8')
    const logLines = logContent.split('\n').filter(line => line.trim())
    
    const errors = []
    const warnings = []
    
    logLines.forEach(line => {
      try {
        const entry = JSON.parse(line)
        if (entry.level === 'error') {
          errors.push(entry)
        } else if (entry.level === 'warning') {
          warnings.push(entry)
        }
      } catch (e) {
        // 忽略解析错误
      }
    })
    
    log('info', 'Error analysis completed', {
      totalLogs: logLines.length,
      errors: errors.length,
      warnings: warnings.length,
    })
    
    if (errors.length > 0) {
      log('warning', `Found ${errors.length} errors in today's logs`)
    }
    
    return { errors, warnings }
  } catch (error) {
    log('error', 'Error analysis failed', { error: error.message })
    return null
  }
}

// 主要的监控循环
async function startMonitoring() {
  log('info', 'Starting debug automation monitoring')
  
  const runChecks = async () => {
    log('info', '--- Running automated checks ---')
    
    // 健康检查
    await performHealthCheck()
    
    // Sentry 连接测试
    await testSentryConnection()
    
    // 系统资源检查
    checkSystemResources()
    
    // 错误分析
    analyzeErrors()
    
    // 日志清理
    cleanupLogFiles()
    
    log('info', '--- Checks completed ---')
  }
  
  // 立即运行一次
  await runChecks()
  
  // 设置定期检查
  setInterval(runChecks, CONFIG.checkInterval)
  
  log('info', `Monitoring started. Checks will run every ${CONFIG.checkInterval / 1000} seconds`)
}

// 命令行接口
const command = process.argv[2]

switch (command) {
  case 'health':
    performHealthCheck().then(() => process.exit(0))
    break
    
  case 'sentry':
    testSentryConnection().then(() => process.exit(0))
    break
    
  case 'resources':
    checkSystemResources()
    process.exit(0)
    break
    
  case 'analyze':
    analyzeErrors()
    process.exit(0)
    break
    
  case 'cleanup':
    cleanupLogFiles()
    process.exit(0)
    break
    
  case 'monitor':
    startMonitoring()
    break
    
  default:
    console.log(`
Debug Automation Script

Usage: node debug-automation.js <command>

Commands:
  health     - Run health check
  sentry     - Test Sentry connection
  resources  - Check system resources
  analyze    - Analyze error logs
  cleanup    - Clean up old log files
  monitor    - Start continuous monitoring

Examples:
  node debug-automation.js health
  node debug-automation.js monitor
`)
    process.exit(1)
}
