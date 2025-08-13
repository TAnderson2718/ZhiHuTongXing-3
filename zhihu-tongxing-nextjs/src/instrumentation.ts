export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 服务端 Sentry 配置
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.SENTRY_DSN || '',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      
      beforeSend(event, _hint) {
        if (process.env.NODE_ENV === 'development') {
          if (event.exception?.values?.[0]?.value?.includes('ECONNREFUSED')) {
            return null
          }
        }
        
        event.tags = {
          ...event.tags,
          component: 'server',
        }
        
        return event
      },
      
      integrations: [
        // 添加 HTTP 集成
        (await import('@sentry/nextjs')).httpIntegration(),
      ],
      
      initialScope: {
        tags: {
          component: 'server',
        },
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge Runtime Sentry 配置
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.SENTRY_DSN || '',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      
      initialScope: {
        tags: {
          component: 'edge',
        },
      },
    })
  }
}
