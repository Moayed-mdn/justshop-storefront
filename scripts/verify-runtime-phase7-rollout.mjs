#!/usr/bin/env node

import { request } from 'node:http'

const frontendHostname = process.env.RUNTIME_VERIFY_HOSTNAME || '127.0.0.1'
const frontendPort = Number(process.env.RUNTIME_VERIFY_PORT || 3100)
const backendHostname = process.env.RUNTIME_VERIFY_API_HOSTNAME || '127.0.0.1'
const backendPort = Number(process.env.RUNTIME_VERIFY_API_PORT || 8001)

const allowlistedHost = process.env.RUNTIME_VERIFY_HOST || 'demo.justshop.test'
const blockedHost = process.env.RUNTIME_VERIFY_BLOCKED_HOST || 'blocked.justshop.test'
const cmsPath = process.env.RUNTIME_VERIFY_CMS_PATH || '/about-us'
const legacyPaths = (process.env.RUNTIME_VERIFY_LEGACY_PATHS || '/login,/cart,/checkout/cancel,/profile,/orders')
  .split(',')
  .map(path => path.trim())
  .filter(Boolean)

const runtimeMarkers = [
  'storefront-runtime',
  'section-renderer',
  'Runtime primary navigation',
  'Runtime footer navigation',
]

const requestText = ({ hostname, port, path, hostHeader, headers = {} }) => new Promise((resolve, reject) => {
  const req = request({
    hostname,
    port,
    path,
    method: 'GET',
    headers: {
      Host: hostHeader,
      ...headers,
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

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const verifyInternalMode = async () => {
  const allowlisted = await requestText({
    hostname: frontendHostname,
    port: frontendPort,
    path: cmsPath,
    hostHeader: allowlistedHost,
  })

  assert(allowlisted.status === 200, `Internal mode allowlisted host expected 200, received ${allowlisted.status}`)

  for (const marker of runtimeMarkers) {
    assert(
      allowlisted.body.includes(marker),
      `Internal mode allowlisted host missing runtime marker "${marker}"`,
    )
  }

  const blockedFrontend = await requestText({
    hostname: frontendHostname,
    port: frontendPort,
    path: cmsPath,
    hostHeader: blockedHost,
  })

  assert(blockedFrontend.status === 404, `Internal mode blocked host expected frontend 404, received ${blockedFrontend.status}`)

  const blockedApi = await requestText({
    hostname: backendHostname,
    port: backendPort,
    path: `/api/v1/storefront/runtime/resolve?path=${encodeURIComponent(cmsPath)}`,
    hostHeader: blockedHost,
    headers: {
      'X-Storefront-Version': '2026-05-28',
      'X-Storefront-Locale': 'en',
      'X-Request-Id': 'req_phase7_internal_mode',
      Accept: 'application/json',
    },
  })

  assert(blockedApi.status === 403, `Internal mode blocked host expected backend 403, received ${blockedApi.status}`)
  assert(
    blockedApi.body.includes('"code":"runtime.rollout_disabled"'),
    'Internal mode blocked host backend response missing runtime.rollout_disabled',
  )
}

const verifyKillSwitch = async () => {
  const api = await requestText({
    hostname: backendHostname,
    port: backendPort,
    path: `/api/v1/storefront/runtime/resolve?path=${encodeURIComponent(cmsPath)}`,
    hostHeader: allowlistedHost,
    headers: {
      'X-Storefront-Version': '2026-05-28',
      'X-Storefront-Locale': 'en',
      'X-Request-Id': 'req_phase7_kill_switch',
      Accept: 'application/json',
    },
  })

  assert(api.status === 403, `Kill switch expected backend 403, received ${api.status}`)
  assert(
    api.body.includes('"code":"runtime.rollout_disabled"'),
    'Kill switch backend response missing runtime.rollout_disabled',
  )

  const frontendCms = await requestText({
    hostname: frontendHostname,
    port: frontendPort,
    path: cmsPath,
    hostHeader: allowlistedHost,
  })

  assert(frontendCms.status === 404, `Kill switch expected catch-all 404, received ${frontendCms.status}`)

  for (const legacyPath of legacyPaths) {
    const legacy = await requestText({
      hostname: frontendHostname,
      port: frontendPort,
      path: legacyPath,
      hostHeader: allowlistedHost,
    })

    assert(
      legacy.status >= 200 && legacy.status < 400,
      `Kill switch expected legacy path ${legacyPath} to stay available, received ${legacy.status}`,
    )
  }
}

const mode = process.env.RUNTIME_PHASE7_MODE || 'internal'

if (mode === 'internal') {
  await verifyInternalMode()
  console.log(`Phase 7 internal-mode rollout verification passed for ${allowlistedHost} with blocked host ${blockedHost}.`)
} else if (mode === 'kill-switch') {
  await verifyKillSwitch()
  console.log(`Phase 7 kill-switch verification passed for ${allowlistedHost}.`)
} else {
  console.error(`Unsupported RUNTIME_PHASE7_MODE "${mode}". Use "internal" or "kill-switch".`)
  process.exit(1)
}
