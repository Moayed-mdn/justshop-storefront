/**
 * Hero Banner Types
 * Types for merchant hero banner management
 */

export type VisualType = 'image' | 'gradient' | 'video'
export type LinkTarget = '_self' | '_blank'
export type BannerStatus = 'all' | 'active' | 'inactive' | 'trashed'

export interface HeroBannerTranslation {
  locale: string
  title: string
  subtitle?: string | null
  cta_text?: string | null
}

export interface HeroBanner {
  id: number
  store_id: number
  cat_url: string
  position: number
  visual_type: VisualType
  image_path?: string | null
  image_url?: string | null
  gradient_from?: string | null
  gradient_to?: string | null
  video_url?: string | null
  link_url?: string | null
  link_text?: string | null
  link_target?: LinkTarget | null
  is_active: boolean
  starts_at?: string | null
  ends_at?: string | null
  translations: HeroBannerTranslation[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface HeroBannerFormData {
  cat_url: string
  position: number
  visual_type: VisualType
  image_path?: string
  gradient_from?: string
  gradient_to?: string
  video_url?: string
  link_url?: string
  link_text?: string
  link_target?: LinkTarget
  is_active: boolean
  starts_at?: string
  ends_at?: string
  translations: Array<{
    locale: string
    title: string
    subtitle?: string
    cta_text?: string
  }>
}

export interface HeroBannersFilters {
  status?: BannerStatus
  search?: string
}

export interface HeroBannersApiResponse {
  success: boolean
  message: string
  data: HeroBanner[]
}

export interface HeroBannerApiResponse {
  success: boolean
  message: string
  data: HeroBanner
}
