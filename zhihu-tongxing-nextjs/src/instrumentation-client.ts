import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // 环境标识
  environment: process.env.NODE_ENV,

  // 发布版本
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // 错误过滤
  beforeSend(event, _hint) {
    // 过滤掉开发环境的某些错误
    if (process.env.NODE_ENV === 'development') {
      // 过滤掉 ChunkLoadError
      if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
        return null;
      }
    }

    // 过滤掉网络错误
    if (event.exception?.values?.[0]?.type === 'NetworkError') {
      return null;
    }

    return event;
  },

  // 用户上下文
  initialScope: {
    tags: {
      component: 'client',
    },
  },
});

// 导出路由导航监控钩子
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
