# 🛍️ JustShop Frontend - Multi-Tenant Storefront Platform

A modern, high-performance storefront built with **Nuxt 4**, featuring multi-tenancy, internationalization, and seamless Laravel backend integration.

**→ New to the project? Start here:** [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)

## 🚀 Tech Stack

- **Nuxt 4** - Vue 3 framework with App Router
- **TypeScript** - Full type safety
- **Pinia** - State management with persistence
- **i18n** - English/Arabic with RTL support
- **Nitro** - Server routes for API proxy
- **Apollo Client** - GraphQL for search
- **Laravel Backend** - Headless API integration

## ⚡ Quick Start

### Prerequisites

- **Node.js** `22.12.0` (see `.nvmrc`)
- **npm** package manager
- **Backend API** access for REST proxy
- **GraphQL** endpoint access for search

### Installation

```bash
# Use correct Node version
nvm use

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

**Important**: Update `.env` with your local backend and site URL before starting.

### Development

```bash
# Start development server
npm run dev

# → Opens at http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Preview production locally |
| `npm run generate` | Generate static output |
| `npm run postinstall` | Run `nuxt prepare` after install |
| `npm run lint` | Run linting (if configured) |
| `npm run type-check` | TypeScript validation |

---

## 🔐 Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NUXT_PUBLIC_API_BASE` | Backend API base URL | `http://localhost:8000` |
| `NUXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint | `http://localhost:8000/graphql` |
| `NUXT_PUBLIC_SITE_URL` | Site base URL for i18n | `http://localhost:3000` |

**See `.env.example` for complete list with safe placeholder values.**

---

## 🏗️ Architecture Highlights

### Server-First Design
- **SSR by default** for SEO and performance
- **Nitro server** routes for backend integration
- **API proxy pattern** for security and consistency

### State Management
- **Pinia stores** for global state
- **Persistence** for auth and cart
- **Type-safe** store access

### Data Fetching
- **REST API** via Nitro proxy (`useApi` composable)
- **GraphQL** via Apollo client (search)
- **Server-side** fetching where possible

### Internationalization
- **Locale routing** (/{locale}/...)
- **RTL support** for Arabic
- **Translation bundles** in `i18n/`

---

## 📖 Learning Resources

### For New Developers
1. Read [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)
2. Review [`docs/getting-started/overview.md`](./docs/getting-started/overview.md)
3. Check [`docs/development/coding-standards.md`](./docs/development/coding-standards.md)
4. Explore [`docs/architecture/overview.md`](./docs/architecture/overview.md)

### For AI Collaboration
1. Use [`docs/AI_PROMPT_TEMPLATE.md`](./docs/AI_PROMPT_TEMPLATE.md) for every task
2. Follow [`docs/AI_RULES_ENFORCEMENT_SYSTEM.md`](./docs/AI_RULES_ENFORCEMENT_SYSTEM.md)
3. Verify with [`docs/AI_COLLABORATION_CHECKLIST.md`](./docs/AI_COLLABORATION_CHECKLIST.md)

### Quick Reference
- **Common tasks**: [`docs/quick-reference/COMMON_TASKS_GUIDE.md`](./docs/quick-reference/COMMON_TASKS_GUIDE.md)
- **Quick links**: [`docs/quick-reference/DOCUMENTATION_QUICK_LINKS.md`](./docs/quick-reference/DOCUMENTATION_QUICK_LINKS.md)
- **Navigation**: [`docs/DOCUMENTATION_MAP.md`](./docs/DOCUMENTATION_MAP.md)

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check
```

**See [`docs/development/testing.md`](./docs/development/testing.md) for testing strategy.**

---

## 🚀 Deployment

**See [`docs/operations/deployment.md`](./docs/operations/deployment.md) for deployment guide.**

Key points:
- Build with `npm run build`
- Verify environment variables
- Run smoke tests
- Monitor logs after deployment

---

## 📁 Project Structure

```text
justshop-frontend/
├── app/                    # Nuxt application code
│   ├── components/        # Vue components
│   ├── composables/       # Vue composables
│   ├── pages/            # Route pages
│   ├── layouts/          # Page layouts
│   ├── plugins/          # App boot logic
│   └── stores/           # Pinia stores
│
├── server/                # Nitro server
│   ├── api/              # API route handlers
│   ├── middleware/       # Server middleware
│   └── utils/            # Server utilities
│
├── shared/               # Shared utilities
│   └── utils/           # Cross-layer utilities
│
├── types/                # TypeScript types
├── i18n/                 # Locale translations
├── docs/                 # Documentation
├── public/               # Static assets
└── tests/                # Test files
```

### Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt configuration, modules, i18n |
| `app/stores/auth.ts` | Authentication state (persisted) |
| `app/stores/cart.ts` | Shopping cart state (persisted) |
| `app/composables/useApi.ts` | Client-side API calls |
| `server/utils/api.ts` | Server-side backend proxy |
| `shared/utils/routes.ts` | Route constants and mappings |
| `app/plugins/*.ts` | Boot plugins (auth, cart, API, Apollo) |

---

---

## 📚 Documentation

**Complete documentation is in the [`docs/`](./docs/) directory.**

### Quick Links

| Document | Purpose |
|----------|---------|
| **[📖 Start Here](./docs/00-START-HERE.md)** | Your entry point - read this first! |
| **[📋 Documentation Index](./docs/index.md)** | Complete documentation hub |
| **[🗺️ Documentation Map](./docs/DOCUMENTATION_MAP.md)** | Visual navigation guide |
| **[⚡ Common Tasks](./docs/quick-reference/COMMON_TASKS_GUIDE.md)** | Everyday development tasks |
| **[🔗 Quick Links](./docs/quick-reference/DOCUMENTATION_QUICK_LINKS.md)** | Fast access to docs |
| **[🤖 AI Template](./docs/AI_PROMPT_TEMPLATE.md)** | AI collaboration template |
| **[🏗️ Architecture](./docs/architecture/)** | System architecture docs |
| **[💻 Development](./docs/development/)** | Coding standards |
| **[🔧 Operations](./docs/operations/)** | Deployment & monitoring |

---

## 🎯 Core Features

### Multi-Tenancy
- **Multiple storefronts** on single platform
- **Isolated data** per tenant
- **Custom domains** and subdomain routing
- **Theme customization** per store

### Internationalization
- **English and Arabic** with RTL support
- **Locale-first routing**
- **Dynamic content translation**
- **SEO-optimized** per locale

### Performance
- **Server-side rendering (SSR)**
- **Static generation** where applicable
- **Optimized asset loading**
- **Smart caching** strategies

### E-Commerce
- Product catalog and search
- Shopping cart with persistence
- Order management
- User authentication
- Theme system integration

---

## 🤝 Contributing

**See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution guidelines.**

### Development Workflow
1. Follow coding standards
2. Write tests for new features
3. Update documentation
4. Keep changes in same commit as code
5. No secrets in `.env.example`

### Key Rules
- Documentation updates in same change set as code changes
- Do not bypass `server/api` layer for backend flows
- Do not add real secrets to repository

---

## 📝 Changelog

**See [`CHANGELOG.md`](./CHANGELOG.md) for version history.**

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf .nuxt node_modules
npm install
```

**Type errors:**
```bash
# Regenerate Nuxt types
npx nuxi prepare
npm run type-check
```

**See [`docs/development/troubleshooting.md`](./docs/development/troubleshooting.md) for more solutions.**

---

## 📞 Support

- **Documentation**: [`docs/`](./docs/)
- **Issues**: Check troubleshooting guides
- **Questions**: Review architecture docs
- **AI Help**: Use [`docs/AI_PROMPT_TEMPLATE.md`](./docs/AI_PROMPT_TEMPLATE.md)

---

## 📄 License

[Your License Here]

---

**Last Updated**: June 7, 2026  
**Status**: Active Development  
**Version**: Nuxt 4

**→ Start here: [`docs/00-START-HERE.md`](./docs/00-START-HERE.md)**
