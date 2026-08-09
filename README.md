# JustShop Storefront

A modern, multi-tenant e-commerce storefront built with **Nuxt 4**, designed to serve multiple stores from a shared application while dynamically adapting the storefront experience to the current tenant.

The storefront is part of the **JustShop multi-tenant commerce platform**.

## Related Repositories

* [JustShop Multi-Tenant Commerce Platform](https://github.com/Moayed-mdn/justshop-multitenant-commerce-platform)
* [JustShop API](https://github.com/Moayed-mdn/justshop-api)
* [JustShop Merchant Dashboard](https://github.com/Moayed-mdn/justshop-merchant-dashboard)
* [JustShop Platform Dashboard](https://github.com/Moayed-mdn/justshop-platform-dashboard)

## Overview

The storefront provides the customer-facing shopping experience for each tenant.

A single Nuxt application can serve different stores while resolving the current tenant dynamically from the request context.

The storefront is responsible for:

* Storefront rendering
* Product browsing
* Categories and brands
* Product search and filtering
* Product variants
* Shopping cart
* Checkout
* Customer-facing pages
* Localization
* Tenant-aware content
* Responsive UI
* Backend API communication

The application is designed so that the customer interacts with the storefront without needing to know which tenant or backend resources are serving the request.

## Multi-Tenant Architecture

The storefront is designed around runtime tenant resolution.

```text
Customer Request
       │
       ▼
Nuxt Storefront
       │
       ├── Resolve Tenant
       │
       ├── Load Tenant Configuration
       │
       ├── Load Tenant Content
       │
       └── Request Tenant Data
              │
              ▼
        JustShop API
              │
              ▼
        Tenant-scoped Data
```

The storefront and API are separate applications.

The Laravel API remains responsible for:

* Authentication
* Authorization
* Tenant isolation
* Business rules
* Data validation
* Persistence

The Nuxt application is responsible for the customer-facing presentation and interaction layer.

## Technology Stack

* Nuxt 4
* Vue 3
* TypeScript
* Pinia
* Tailwind CSS
* Nitro
* VueUse
* Nuxt Image
* Nuxt UI
* Vitest
* Playwright

## Main Features

### Storefront

* Dynamic tenant storefronts
* Responsive layouts
* Product listing
* Product details
* Categories
* Brands
* Product variants
* Product images
* Search
* Filtering
* Pagination

### Shopping

* Shopping cart
* Cart persistence
* Quantity management
* Variant selection
* Checkout integration

### Tenant Awareness

* Runtime tenant resolution
* Tenant-specific storefront configuration
* Tenant-specific content
* Tenant-scoped API requests
* Runtime storefront configuration

### Localization

* Arabic and English support
* RTL support
* Localized storefront content

### Performance

* Server-side rendering
* Nuxt data fetching
* Nitro server routes
* Runtime configuration
* Image optimization
* Client-side state management

## Project Architecture

```text
justshop-storefront/
│
├── app/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   └── stores/
│
├── server/
│   └── api/
│
├── public/
│
├── docs/
│
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

The exact directory structure may evolve as the application architecture develops.

## API Communication

The storefront communicates with the Laravel backend through the application's API layer.

```text
Browser
   │
   ▼
Nuxt Storefront
   │
   ▼
Nuxt/Nitro API Layer
   │
   ▼
JustShop API
   │
   ▼
Database
```

This architecture allows backend communication to be centralized and provides a clean boundary between the browser and the Laravel API.

## Local Development

### Prerequisites

* Node.js
* npm
* Running JustShop API

### Installation

```bash
git clone https://github.com/Moayed-mdn/justshop-storefront.git
cd justshop-storefront

npm install
```

Create the required environment file according to the project's `.env.example`.

### Development Server

```bash
npm run dev
```

The storefront can then be accessed through the configured local development URL.

## Available Scripts

Check `package.json` for the current source of truth.

Common commands include:

```bash
npm run dev
npm run build
npm run generate
npm run preview
npm run test
npm run test:watch
npm run test:e2e
```

## Testing

The project uses:

* Vitest for unit/component testing
* Playwright for end-to-end testing

Run unit tests:

```bash
npm run test
```

Run Playwright tests:

```bash
npm run test:e2e
```

## Security

The storefront does not treat frontend restrictions as an authorization boundary.

Tenant isolation and authorization are enforced by the backend API.

The frontend should never:

* Trust tenant identifiers supplied by the client
* Expose backend secrets
* Store sensitive credentials in client-side code
* Bypass backend authorization
* Assume that hiding a UI element provides security

## Environment Variables

Environment-specific configuration should be stored in local environment files and should not contain committed secrets.

Use:

```text
.env.example
```

as the reference for required configuration.

Never commit:

```text
.env
.env.local
```

or other files containing real credentials.

## Current Project Status

The storefront is an active part of the JustShop multi-tenant commerce platform.

The current branch represents the **Storefront V3** architecture that evolved from the original standalone JustShop storefront.

The original standalone implementation is preserved separately as a historical project.

## Related Architecture

```text
                    JustShop Platform
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   Platform Dashboard  Merchant Dashboard  Storefront
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                     JustShop API
                           │
                           ▼
                       Database
```

### Application Responsibilities

| Application                   | Responsibility                                                   |
| ----------------------------- | ---------------------------------------------------------------- |
| `justshop-api`                | Backend API, business logic, authentication and tenant isolation |
| `justshop-merchant-dashboard` | Merchant/store management                                        |
| `justshop-storefront`         | Customer-facing shopping experience                              |
| `justshop-platform-dashboard` | Platform-level administration                                    |

## Roadmap

Planned infrastructure improvements include:

* Docker-based development
* CI/CD with GitHub Actions
* Automated deployment pipelines
* Additional automated testing
* Further storefront performance optimization

These infrastructure components are intentionally kept separate from the current application architecture and will be introduced in a later phase.

## License

This project is currently maintained as a portfolio and educational project.
