const STORAGE_PREFIX = '/storage/'

function normalizeBackendBaseUrl(value: string): string {
  return value
    .trim()
    .replace(/\/api\/v\d+.*$/, '')
    .replace(/\/api\/.*$/, '')
    .replace(/\/$/, '')
}

function buildStoragePath(value: string): string {
  const normalized = value
    .trim()
    .replace(/^\/+/, '')
    .replace(/^storage\/+/, '')

  return normalized ? `${STORAGE_PREFIX}${normalized}` : ''
}

function tryParseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

export const useMediaUrl = () => {
  const config = useRuntimeConfig()
  const requestUrl = useRequestURL()

  const backendBaseUrl = computed(() =>
    normalizeBackendBaseUrl(String(config.public.apiBase ?? config.apiBase ?? '')),
  )

  const frontendOrigin = computed(() => requestUrl.origin)

  const resolveMediaUrl = (value: string | null | undefined): string => {
    if (!value) {
      return ''
    }

    const trimmed = value.trim()
    if (!trimmed) {
      return ''
    }

    // If it's a full HTTPS URL (external), leave it as-is!
    if (trimmed.startsWith('https://')) {
      return trimmed
    }

    // If it's a full HTTP URL that's from our own backend or frontend, strip to just the path
    if (trimmed.startsWith('http://')) {
      const parsed = tryParseUrl(trimmed)
      if (parsed) {
        const isKnownAppOrigin = parsed.origin === backendBaseUrl.value || parsed.origin === frontendOrigin.value
        if (isKnownAppOrigin && parsed.pathname.startsWith(STORAGE_PREFIX)) {
          return `${parsed.pathname}${parsed.search}${parsed.hash}`
        }
      }
      // If it's a random HTTP URL, leave it as-is
      return trimmed
    }

    // Already starts with /storage/, leave it
    if (trimmed.startsWith(STORAGE_PREFIX)) {
      return trimmed
    }

    // Starts with storage/, add leading slash
    if (trimmed.startsWith('storage/')) {
      return `/${trimmed}`
    }

    // Already an absolute path, leave it
    if (trimmed.startsWith('/')) {
      return trimmed
    }

    // Otherwise, treat it as a relative storage path
    return buildStoragePath(trimmed)
  }

  return {
    resolveMediaUrl,
  }
}
