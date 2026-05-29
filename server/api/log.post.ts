import fs from 'node:fs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { level, message, stack } = body

  console.log(`[API LOG] Received ${level}: ${message}`)

  const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${stack ? stack + '\n' : ''}\n`
  
  const logPath = '/home/leader/projects/laravel/tenant/justshop-frontend/logs/client.log'
  
  try {
    fs.appendFileSync(logPath, logEntry)
    console.log(`[API LOG] Successfully wrote to ${logPath}`)
    return { status: 'ok' }
  } catch (err: any) {
    console.error('[API LOG] Failed to write to client log file:', err.message)
    return { status: 'error', message: err.message }
  }
})
