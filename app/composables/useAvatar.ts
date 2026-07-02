export const useAvatar = () => {
  const { resolveMediaUrl } = useMediaUrl()

  const getAvatarUrl = (avatar: string | null | undefined): string | null => {
    if (!avatar) return null

    return resolveMediaUrl(avatar) || null
  }

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
