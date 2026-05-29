#!/usr/bin/env node

import { request } from 'node:http'

const host = process.env.RUNTIME_VERIFY_HOST || 'demo.justshop.test'
const port = Number(process.env.RUNTIME_VERIFY_PORT || 3100)
const hostname = process.env.RUNTIME_VERIFY_HOSTNAME || '127.0.0.1'

const routes = [
  '/',
  '/about-us',
  '/products/category/electronics',
  '/products/running-sneakers',
]

const requiredMarkers = [
  'storefront-runtime',
  'section-renderer',
  'Runtime primary navigation',
  'Runtime footer navigation',
]

const forbiddenMarkers = [
  'legacy-shell',
]

const fetchWithHost = (path) => new Promise((resolve, reject) => {
  const req = request({
    hostname,
    port,
    path,
    method: 'GET',
    headers: {
      Host: host,
    },
  }, (res) => {
    const chunks = []

    res.on('data', chunk => chunks.push(chunk))
    res.on('end', () => {
      resolve({
        status: res.statusCode || 500,
        body: Buffer.concat(chunks).toString('utf-8'),
      })
    })
  })

  req.on('error', reject)
  req.end()
})

const failures = []

for (const route of routes) {
  const { status, body: html } = await fetchWithHost(route)

  if (status !== 200) {
    failures.push(`${route}: expected HTTP 200, received ${status}`)
    continue
  }

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      failures.push(`${route}: missing runtime marker "${marker}"`)
    }
  }

  for (const marker of forbiddenMarkers) {
    if (html.includes(marker)) {
      failures.push(`${route}: found forbidden marker "${marker}"`)
    }
  }

  if (!html.includes('rel="canonical"') && !html.includes("rel: 'canonical'")) {
    failures.push(`${route}: missing canonical link`)
  }

  if (!html.includes('application/ld+json')) {
    failures.push(`${route}: missing JSON-LD script tag`)
  }
}

if (failures.length > 0) {
  console.error('Phase 6 runtime SSR verification failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Phase 6 runtime SSR verification passed for ${routes.length} routes on host ${host}.`)
