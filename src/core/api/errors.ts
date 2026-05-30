export interface StorefrontError {
  code: string
  message: string
  error_code?: string
  errors?: Record<string, string[]>
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
    error_code: data?.error_code || data?.code || runtimeError?.code,
    message: runtimeError?.message || data?.message || error.message || 'An unexpected error occurred',
    errors: data?.errors || undefined,
    action: data?.action,
    statusCode: runtimeError?.httpStatus || error?.response?.status || error?.statusCode,
    details: runtimeError?.details,
    requestContext: runtimeContext,
  }
}
