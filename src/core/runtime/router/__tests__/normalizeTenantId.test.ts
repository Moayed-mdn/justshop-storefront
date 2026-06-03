import { describe, it, expect } from 'vitest'
import { normalizeTenantId } from '../useStorefrontPayload'

describe('normalizeTenantId', () => {
  it('strips store_ prefix from store_N format', () => {
    expect(normalizeTenantId('store_1')).toBe('1')
    expect(normalizeTenantId('store_42')).toBe('42')
    expect(normalizeTenantId('store_999')).toBe('999')
  })

  it('passes numeric values through unchanged', () => {
    expect(normalizeTenantId(1)).toBe(1)
    expect(normalizeTenantId(42)).toBe(42)
  })

  it('passes non-prefixed strings through unchanged', () => {
    expect(normalizeTenantId('merchant-store')).toBe('merchant-store')
    expect(normalizeTenantId('justshop-demo')).toBe('justshop-demo')
    expect(normalizeTenantId('abc')).toBe('abc')
    expect(normalizeTenantId('localhost')).toBe('localhost')
  })

  it('passes store_-like but non-numeric through unchanged', () => {
    expect(normalizeTenantId('store_abc')).toBe('store_abc')
    expect(normalizeTenantId('store_')).toBe('store_')
    expect(normalizeTenantId('_store_1')).toBe('_store_1')
  })

  it('returns undefined for null', () => {
    expect(normalizeTenantId(null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(normalizeTenantId(undefined)).toBeUndefined()
  })
})
