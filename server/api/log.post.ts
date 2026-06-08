import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { level, message, stack } = body

  console.log(`[API LOG] Received ${level}: ${message}`)

  const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n${stack ? stack + '\n' : ''}\n`
  
  const logDir = path.resolve('./logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  const logPath = path.resolve('./logs/client.log')
  
  try {
    fs.appendFileSync(logPath, logEntry)
    console.log(`[API LOG] Successfully wrote to ${logPath}`)
    return { status: 'ok' }
  } catch (err: any) {
    console.error('[API LOG] Failed to write to client log file:', err.message)
    return { status: 'error', message: err.message }
  }
})
