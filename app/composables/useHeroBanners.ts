/**
 * Hero Banner Composable
 * Provides reactive data and methods for hero banner management
 */

import type { Ref } from 'vue'
import type {
  HeroBanner,
  HeroBannerFormData,
  HeroBannersFilters,
} from '~/types/heroBanner'
import {
  getHeroBanners,
  getHeroBanner,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  restoreHeroBanner,
} from '~/app/utils/api/heroBanners'

export function useHeroBanners(storeId: number) {
  const banners = ref<HeroBanner[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all banners with optional filters
   */
  async function fetchBanners(filters?: HeroBannersFilters) {
    loading.value = true
    error.value = null

    try {
      banners.value = await getHeroBanners(storeId, filters)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hero banners'
      console.error('Error fetching hero banners:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single banner
   */
  async function fetchBanner(bannerId: number): Promise<HeroBanner | null> {
    loading.value = true
    error.value = null

    try {
      return await getHeroBanner(storeId, bannerId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hero banner'
      console.error('Error fetching hero banner:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new banner
   */
  async function createBanner(data: HeroBannerFormData): Promise<HeroBanner | null> {
    loading.value = true
    error.value = null

    try {
      const newBanner = await createHeroBanner(storeId, data)
      banners.value.push(newBanner)
      return newBanner
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to create hero banner'
      console.error('Error creating hero banner:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing banner
   */
  async function updateBanner(
    bannerId: number,
    data: HeroBannerFormData
  ): Promise<HeroBanner | null> {
    loading.value = true
    error.value = null

    try {
      const updatedBanner = await updateHeroBanner(storeId, bannerId, data)
      
      // Update in local array
      const index = banners.value.findIndex(b => b.id === bannerId)
      if (index !== -1) {
        banners.value[index] = updatedBanner
      }
      
      return updatedBanner
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to update hero banner'
      console.error('Error updating hero banner:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a banner (soft delete)
   */
  async function deleteBanner(bannerId: number): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await deleteHeroBanner(storeId, bannerId)
      
      // Mark as deleted in local array
      const banner = banners.value.find(b => b.id === bannerId)
      if (banner) {
        banner.deleted_at = new Date().toISOString()
      }
      
      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to delete hero banner'
      console.error('Error deleting hero banner:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Restore a deleted banner
   */
  async function restoreBanner(bannerId: number): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await restoreHeroBanner(storeId, bannerId)
      
      // Mark as restored in local array
      const banner = banners.value.find(b => b.id === bannerId)
      if (banner) {
        banner.deleted_at = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to restore hero banner'
      console.error('Error restoring hero banner:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    banners,
    loading,
    error,
    fetchBanners,
    fetchBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    restoreBanner,
  }
}
