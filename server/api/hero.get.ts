
// server/api/hero.get.ts
export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  return await api('homepage/hero')
  
})