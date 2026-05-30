import type { Tenant } from './types'

const normalizeHostname = (hostname: string): string => {
  return hostname
    .trim()
    .toLowerCase()
    .split(',')[0]!
    .trim()
    .split(':')[0]!
}

const formatTenantName = (slug: string): string => {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Storefront'
}

const knownDevTenants: Record<string, Pick<Tenant, 'id' | 'name' | 'slug'>> = {
  'demo.justshop.test': {
    id: 1,
    name: 'Merchant Store',
    slug: 'merchant-store',
  },
}

export const resolveTenant = async (hostname: string): Promise<Tenant | null> => {
  const normalizedHost = normalizeHostname(hostname)

  if (!normalizedHost) {
    return null
  }

  const knownTenant = knownDevTenants[normalizedHost]

  if (knownTenant) {
    return {
      ...knownTenant,
      domain: normalizedHost,
      status: 'active',
      settings: {
        theme: 'default',
        currency: 'USD',
      },
    }
  }

  if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
    return {
      id: 'localhost',
      name: 'Default Store',
      slug: 'default',
      domain: normalizedHost,
      status: 'active',
      settings: {
        theme: 'default',
        currency: 'USD',
      },
    }
  }

  const hostParts = normalizedHost.split('.')
  const slug = hostParts[0] || 'storefront'

  // Runtime APIs remain the authority for actual tenant validity. The frontend
  // stores a host-derived shell here so SSR, request headers, and cache keys
  // stay stable before Laravel returns the canonical tenant identity.
  return {
    id: slug,
    name: formatTenantName(slug),
    slug,
    domain: normalizedHost,
    status: 'active',
    settings: {
      theme: 'default',
      currency: 'USD',
    },
  }
}
