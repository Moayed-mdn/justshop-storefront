export interface StorefrontError {
  code: string
  message: string
  action?: string
}

export const normalizeError = (error: any): StorefrontError => {
  const data = error?.response?._data || error?.data
  
  return {
    code: data?.code || 'UNKNOWN_ERROR',
    message: data?.message || error.message || 'An unexpected error occurred',
    action: data?.action,
  }
}
