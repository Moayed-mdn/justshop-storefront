import type {
  RuntimeNavigationResponse,
  RuntimePagePayload,
  RuntimeRouteMatch,
  RuntimeSectionDto,
  RuntimeThemeResponse,
} from '../contracts/types'

export type RuntimeResolvedRoute = RuntimeRouteMatch
export type CmsSection = RuntimeSectionDto
export type StorefrontPayload = RuntimePagePayload

export interface StorefrontRuntimeBundle {
  page: RuntimePagePayload
  navigation: RuntimeNavigationResponse['data']
  theme: RuntimeThemeResponse['data']
}
