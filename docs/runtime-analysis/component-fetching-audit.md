# Component Fetching Audit

## Overview
Audit of storefront components that perform internal data fetching, which violates the platform's "Presentational-only" rule.

## Self-Fetching Components
| Component | Composable Used | Fetching Method | Migration Difficulty |
| :--- | :--- | :--- | :--- |
| `HeroSection` | `useHero` | `useAsyncData` | Low |
| `BestSellers` | `useBestSellers` | `useAsyncData` | Low |
| `ProductRelatedProducts` | `useProductDetail` | `onMounted` | Medium |
| `CategoryHeader` | `useProductByCategory` | `useAsyncData` | Low |
| `FilterSidebar` | `useProductFilters` | Internal State | High |

## Architectural Violations
- **Rule 3 Violation**: Sections fetch their own data instead of receiving normalized props from the orchestrator.
- **SSR Mismatch**: Components using `onMounted` for fetching (e.g., `ProductRelatedProducts`) cause layout shifts and are invisible to search engines.

## Migration Strategy
1. **Decouple**: Remove composable calls from these components.
2. **Prop-ify**: Add `props` to accept the data they currently fetch.
3. **Orchestrate**: Move the data fetching to the Storefront Runtime (Route Resolver/Payload Loader).
4. **Adapter**: Create temporary adapters if needed to bridge the old components with the new runtime.

## Risk Level: Medium
- Breaking existing functionality if props are not correctly mapped.
- Increased complexity in the page-level orchestrator.
