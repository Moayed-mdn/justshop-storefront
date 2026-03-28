export function manufactureDateFromPreset(preset: string): string | null {
    if (preset === 'all') return null
  
    const d = new Date()
  
    if (preset === '30d') d.setDate(d.getDate() - 30)
    if (preset === '6m') d.setMonth(d.getMonth() - 6)
    if (preset === '1y') d.setFullYear(d.getFullYear() - 1)
  
    return d.toISOString().split('T')[0] ?? null
  }
  
  export function expiryDateFromPreset(preset: string): string | null {
    if (preset === 'all') return null
  
    const d = new Date()
  
    if (preset === '1m') d.setMonth(d.getMonth() + 1)
    if (preset === '3m') d.setMonth(d.getMonth() + 3)
    if (preset === '6m') d.setMonth(d.getMonth() + 6)
    if (preset === '12m') d.setMonth(d.getMonth() + 12)
  
    return d.toISOString().split('T')[0] ?? null
  }