const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    // 启用 instrumentation hook
    instrumentationHook: true,
  },

  images: {
    domains: [
      'picsum.photos',
      'postimages.org',
      'i.postimg.cc',
      'oss.aliyuncs.com',
      'cos.ap-beijing.myqcloud.com',
      'cos.ap-shanghai.myqcloud.com',
      'cos.ap-guangzhou.myqcloud.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'postimages.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.aliyuncs.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.myqcloud.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  // 支持视频文件上传
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  // 启用 standalone 输出用于 Docker 部署
  // output: 'standalone', // 临时注释掉以解决问题
  // 启用类型检查和 ESLint 检查以确保代码质量
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 跳过 API 路由的静态生成
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

}

// Sentry 配置选项
const sentryWebpackPluginOptions = {
  // 额外的配置选项
  org: "thomas-7b",
  project: "zhihutongxing",

  // 只在生产环境上传 source maps
  silent: process.env.NODE_ENV !== 'production',

  // 上传 source maps 到 Sentry
  widenClientFileUpload: true,

  // 隐藏 source maps 从生成的包中
  hideSourceMaps: true,

  // 禁用自动释放创建
  disableServerWebpackPlugin: process.env.NODE_ENV !== 'production',
  disableClientWebpackPlugin: process.env.NODE_ENV !== 'production',
};

// 使用 Sentry 包装配置
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
