// composables/useAvatar.ts
export const useAvatar = () => {
    const config = useRuntimeConfig()
  
    /**
     * Returns a proper avatar URL.
     * - Google avatars: already a full URL → return as-is
     * - Uploaded avatars: relative path → prefix with backend storage URL
     * - No avatar: return null (template handles fallback)
     */
    const getAvatarUrl = (avatar: string | null | undefined): string | null => {
      if (!avatar) return null
  
      // Already a full URL (Google avatar)
      if (avatar.startsWith('http')) return avatar
  
      // Local upload — build the full URL
      // NUXT_PUBLIC_API_BASE = 'http://localhost:8000/api/v1/users'
      // We need: 'http://localhost:8000/storage/avatars/xxx.jpg'
      const baseUrl = (config.public.apiBase as string).replace(/\/api\/.*$/, '')
      return `${baseUrl}/storage/${avatar}`
    }
  
    /**
     * Returns initials from a name for the fallback avatar.
     */
    const getInitials = (name: string | null | undefined): string => {
      if (!name) return '?'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  
    return {
      getAvatarUrl,
      getInitials,
    }
  }