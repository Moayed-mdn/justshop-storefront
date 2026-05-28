export default defineNuxtPlugin((nuxtApp) => {
  const context = useStorefrontContext()

  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context.storefrontContext) {
      context.value = event.context.storefrontContext
    }
  }

  // Provide the context globally
  return {
    provide: {
      storefrontContext: context
    }
  }
})
