import type { CmsSection } from '../runtime/router/types'

export type RuntimeSectionData = Record<string, unknown>

export interface RuntimeSectionComponentProps {
  section: CmsSection
  data: RuntimeSectionData
}
