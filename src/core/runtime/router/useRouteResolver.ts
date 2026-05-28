import type { RuntimeResolvedRoute } from './types'
import { useStorefrontApi } from '../../api/client'

export const useRouteResolver = () => {
  const resolveRoute = async (path: string): Promise<RuntimeResolvedRoute> => {
    // 1. Clean path
    const cleanPath = path.replace(/\/$/, '') || '/'

    // 2. Call Storefront Resolver API
    // In Phase 2, we simulate this call or bridge to existing routes
    try {
      // const { data, error } = await useStorefrontApi<RuntimeResolvedRoute>(`/api/v1/storefront/resolve`, {
      //   query: { path: cleanPath }
      // })
      
      // if (data) return data

      // Mock Fallback for Phase 2 development
      return mockResolve(cleanPath)
    } catch (err) {
      return {
        status: 'not_found',
        type: 'page',
        resourceId: 0,
        slug: cleanPath,
        layout: 'default',
        cacheTtl: 0,
        metadata: {}
      }
    }
  }

  const mockResolve = (path: string): RuntimeResolvedRoute => {
    if (path === '/' || path === '') {
      return {
        status: 'matched',
        type: 'home',
        resourceId: 'home',
        slug: '/',
        layout: 'default',
        cacheTtl: 3600,
        metadata: {}
      }
    }

    if (path === '/products') {
      return {
        status: 'matched',
        type: 'collection',
        resourceId: 'all-products',
        slug: 'products',
        layout: 'default',
        cacheTtl: 3600,
        metadata: {}
      }
    }

    if (path.startsWith('/products/product/')) {
      const slug = path.replace('/products/product/', '')
      return {
        status: 'matched',
        type: 'product',
        resourceId: slug,
        slug,
        layout: 'default',
        cacheTtl: 3600,
        metadata: {}
      }
    }

    if (path.startsWith('/products/category/')) {
      const slug = path.replace('/products/category/', '')
      return {
        status: 'matched',
        type: 'category',
        resourceId: slug,
        slug,
        layout: 'default',
        cacheTtl: 3600,
        metadata: {}
      }
    }

    if (path.startsWith('/search')) {
      return {
        status: 'matched',
        type: 'search',
        resourceId: 'search',
        slug: '/search',
        layout: 'default',
        cacheTtl: 3600,
        metadata: {}
      }
    }

    if (path.startsWith('/cart')) {
      return {
        status: 'matched',
        type: 'cart',
        resourceId: 'cart',
        slug: '/cart',
        layout: 'default',
        cacheTtl: 0,
        metadata: {}
      }
    }

    return {
      status: 'not_found',
      type: 'page',
      resourceId: 0,
      slug: path,
      layout: 'default',
      cacheTtl: 0,
      metadata: {}
    }
  }

  return {
    resolveRoute
  }
}
