export interface StorefrontError {
  code: string
  message: string
  action?: string
  statusCode?: number
  details?: Record<string, unknown>
  requestContext?: Record<string, unknown>
}

export const normalizeError = (error: any): StorefrontError => {
  const data = error?.response?._data || error?.data
  const runtimeError = data?.error
  const runtimeContext = data?.requestContext
  
  return {
    code: runtimeError?.code || data?.code || 'UNKNOWN_ERROR',
    message: runtimeError?.message || data?.message || error.message || 'An unexpected error occurred',
    action: data?.action,
    statusCode: runtimeError?.httpStatus || error?.response?.status || error?.statusCode,
    details: runtimeError?.details,
    requestContext: runtimeContext,
  }
}
