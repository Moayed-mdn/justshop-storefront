import type { CmsSection, RuntimeThemeResponse } from '../runtime/router/types'

export type RuntimeSectionData = Record<string, unknown>

export interface RuntimeSectionComponentProps {
  section: CmsSection
  data: RuntimeSectionData
  theme?: RuntimeThemeResponse['data'] | null
}
