/**
 * Hero Banner API Client
 * API functions for hero banner CRUD operations
 */

import type {
  HeroBanner,
  HeroBannerFormData,
  HeroBannersFilters,
  HeroBannersApiResponse,
  HeroBannerApiResponse,
} from '~/types/heroBanner'

const API_BASE = '/api/v1/merchant'

/**
 * Get all hero banners for a store
 */
export async function getHeroBanners(
  storeId: number,
  filters?: HeroBannersFilters
): Promise<HeroBanner[]> {
  const params = new URLSearchParams()
  
  if (filters?.status) {
    params.append('status', filters.status)
  }
  
  if (filters?.search) {
    params.append('search', filters.search)
  }

  const query = params.toString() ? `?${params.toString()}` : ''
  
  const response = await $fetch<HeroBannersApiResponse>(
    `${API_BASE}/stores/${storeId}/hero-banners${query}`
  )
  
  return response.data
}

/**
 * Get a single hero banner
 */
export async function getHeroBanner(
  storeId: number,
  bannerId: number
): Promise<HeroBanner> {
  const response = await $fetch<HeroBannerApiResponse>(
    `${API_BASE}/stores/${storeId}/hero-banners/${bannerId}`
  )
  
  return response.data
}

/**
 * Create a new hero banner
 */
export async function createHeroBanner(
  storeId: number,
  data: HeroBannerFormData
): Promise<HeroBanner> {
  const response = await $fetch<HeroBannerApiResponse>(
    `${API_BASE}/stores/${storeId}/hero-banners`,
    {
      method: 'POST',
      body: data,
    }
  )
  
  return response.data
}

/**
 * Update an existing hero banner
 */
export async function updateHeroBanner(
  storeId: number,
  bannerId: number,
  data: HeroBannerFormData
): Promise<HeroBanner> {
  const response = await $fetch<HeroBannerApiResponse>(
    `${API_BASE}/stores/${storeId}/hero-banners/${bannerId}`,
    {
      method: 'PATCH',
      body: data,
    }
  )
  
  return response.data
}

/**
 * Delete a hero banner (soft delete)
 */
export async function deleteHeroBanner(
  storeId: number,
  bannerId: number
): Promise<void> {
  await $fetch(
    `${API_BASE}/stores/${storeId}/hero-banners/${bannerId}`,
    {
      method: 'DELETE',
    }
  )
}

/**
 * Restore a deleted hero banner
 */
export async function restoreHeroBanner(
  storeId: number,
  bannerId: number
): Promise<void> {
  await $fetch(
    `${API_BASE}/stores/${storeId}/hero-banners/${bannerId}/restore`,
    {
      method: 'PATCH',
    }
  )
}

/**
 * Upload a hero banner image
 */
export async function uploadHeroBannerImage(
  storeId: number,
  file: File
): Promise<{ success: boolean; data: { path: string; url: string; full_url: string } }> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await $fetch<{ success: boolean; data: { path: string; url: string; full_url: string } }>(
    `${API_BASE}/stores/${storeId}/hero-banners/upload-image`,
    {
      method: 'POST',
      body: formData,
    }
  )

  return response
}

/**
 * Delete a hero banner image
 */
export async function deleteHeroBannerImage(
  storeId: number,
  path: string
): Promise<void> {
  await $fetch(
    `${API_BASE}/stores/${storeId}/hero-banners/delete-image`,
    {
      method: 'DELETE',
      body: { path },
    }
  )
}
