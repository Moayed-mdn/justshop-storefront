export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return

  const originalWarn = console.warn
  const originalError = console.error

  const sendLog = (level: string, args: any[]) => {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg)
        } catch (e) {
          return String(arg)
        }
      }
      return String(arg)
    }).join(' ')

    const stack = new Error().stack

    const logPayload = {
      level,
      message,
      stack
    }

    fetch('/api/log', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logPayload),
      keepalive: true
    }).then(res => {
      if (!res.ok) {
        originalError('[LOGGER PLUGIN ERROR] Server returned', res.status)
      }
    }).catch((err) => {
      originalError('[LOGGER PLUGIN FETCH ERROR]', err)
    })
  }

  console.log('Logger plugin initialized')
  sendLog('info', ['Logger plugin initialized'])

  console.warn = (...args: any[]) => {
    originalWarn(...args)
    sendLog('warn', args)
  }

  console.error = (...args: any[]) => {
    originalError(...args)
    sendLog('error', args)
  }

  // Hook into Vue's error handler to capture the ACTUAL errors that Vue swallows
  nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
    originalError('[VUE ERROR HANDLER]', err, info)
    sendLog('error', [
      `[VUE ERROR] ${info}`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      `Stack: ${err instanceof Error ? err.stack : 'N/A'}`
    ])
  }
})
