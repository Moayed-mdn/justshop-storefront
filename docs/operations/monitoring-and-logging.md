# Monitoring And Logging

## Purpose

This document describes the current monitoring and logging reality for the JustShop frontend.

Code surfaces this file aligns with:

- `server/middleware/log.ts`
- `nuxt.config.ts`
- `app/**`
- `server/**`

## Current Logging Reality

Visible logging today is limited and mostly console-based.

Current examples include:

- `server/middleware/log.ts` logging request URLs
- `console.error(...)` calls in search, product detail, verification, Google auth, and share flows
- `console.warn(...)` in guest-cart merge behavior

## Current Observability Signals

- browser console output
- server console output
- request URL logging from server middleware
- user-reported broken flows

## Current Gaps

- No dashboard configuration is visible in the repo.
- No alerting rules are visible in the repo.
- No structured log pipeline is encoded in repository config.
- No tracing or metrics instrumentation is visible.

## Operational Use Today

When diagnosing runtime issues today:

1. reproduce the affected browser flow
2. inspect browser console output
3. inspect server logs for request flow and runtime errors
4. confirm env and backend endpoint availability
5. isolate whether the problem is in UI state, Nitro proxying, backend responses, or GraphQL search

## `nuxt-ssr-api-logger` Note

The active module list includes `nuxt-ssr-api-logger`, so SSR API logging integration exists at module level. This repository does not currently provide deeper operational configuration for it in docs or dedicated config files, so treat it as present but lightly documented.

## Evidence To Capture During Incidents

- affected route and locale
- user auth state or guest state
- browser console errors
- relevant server log lines
- backend or GraphQL reachability symptoms

## Change Rules

- Update this document if structured logging, alerting, dashboards, or tracing are added.
- Keep this document honest about current gaps instead of implying a monitoring stack that is not visible in code.
