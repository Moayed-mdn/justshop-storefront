import { ref } from 'vue'

export function useHeroBanners(storeId: number) {
  const banners = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBanners(_filters?: Record<string, unknown>) {}
  async function fetchBanner(_id: number) {}
  async function createBanner(_data: Record<string, unknown>): Promise<boolean> { return false }
  async function updateBanner(_id: number, _data: Record<string, unknown>): Promise<boolean> { return false }
  async function deleteBanner(_id: number): Promise<boolean> { return false }
  async function restoreBanner(_id: number): Promise<boolean> { return false }

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
