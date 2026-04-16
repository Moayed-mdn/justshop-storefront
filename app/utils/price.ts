export const formatPrice = (
  price: number,
  currency: string = 'USD',
  locale?: string,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat(locale ?? undefined, {
    style: 'currency',
    currency,
    ...options,
  }).format(price)
}
