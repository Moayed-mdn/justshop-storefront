export const formatDate = (
  dateStr: string,
  locale?: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
) => {
  return new Date(dateStr).toLocaleDateString(locale ?? undefined, options)
}
