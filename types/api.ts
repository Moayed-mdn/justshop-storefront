export type ApiSuccess<T> = {
  status: true
  message: string
  data: T
}

export type ApiError = {
  status: false
  message: string
  error_code: string
  errors: Record<string, string[]> | null
}

export type PaginationMeta = {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
}

export type ApiPaginated<T, M = {}> = {
  success: boolean
  message: string
  data: T[]
  meta: {
    pagination: PaginationMeta
  } & M
}
