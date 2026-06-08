# 🚀 START HERE - JustShop Frontend Documentation

**Welcome to the JustShop storefront documentation!**  
**Last Updated**: June 7, 2026

---

## 🎯 What is This Project?

**JustShop Frontend** is a Nuxt 4 storefront with:
- **Nuxt 4** (Vue 3, TypeScript)
- **SSR/Hydration** (Server-side rendering)
- **Pinia** (Auth + cart state)
- **I18n** (English/Arabic with RTL)
- **Theme System** (Dynamic merchant themes)
- **Laravel Backend** (Proxied via server/api/)

---

## 📚 Quick Navigation

### 🔥 MUST READ (Start Here)

1. **[AI Prompt Template](./AI_PROMPT_TEMPLATE.md)** ⭐⭐⭐  
   Copy-paste template for every AI interaction

2. **[AI Rules Enforcement System](./AI_RULES_ENFORCEMENT_SYSTEM.md)** ⭐⭐⭐  
   How to make AI follow Nuxt/Vue rules

3. **[AI Documentation Rules](./AI_DOCUMENTATION_RULES.md)** ⭐⭐  
   Prevent documentation chaos

4. **[AI Collaboration Checklist](./AI_COLLABORATION_CHECKLIST.md)** ⭐⭐  
   Systematic verification checklist

### 📖 Core Documentation

5. **[Documentation Index](./index.md)** ⭐⭐⭐  
   Complete documentation map

6. **[Getting Started](./getting-started/)** ⭐⭐  
   - [Overview](./getting-started/overview.md)
   - [Prerequisites](./getting-started/prerequisites.md)
   - [Installation](./getting-started/installation.md)
   - [Running Locally](./getting-started/running-locally.md)
   - [Project Structure](./getting-started/project-structure.md)

7. **[Development](./development/)** ⭐⭐⭐  
   - [Coding Standards](./development/coding-standards.md) - ESSENTIAL
   - [Components](./development/components.md)
   - [Composables](./development/composables.md)
   - [Pages, Layouts, Middleware](./development/pages-layouts-middleware.md)
   - [Server Routes](./development/server-routes.md)
   - [Testing](./development/testing.md)

8. **[Architecture](./architecture/)** ⭐⭐  
   - [Overview](./architecture/overview.md)
   - [Rendering Strategy](./architecture/rendering-strategy.md)
   - [Routing](./architecture/routing-and-navigation.md)
   - [Data Fetching](./architecture/data-fetching.md)
   - [State Management](./architecture/state-management.md)
   - [Auth & Security](./architecture/auth-and-security.md)

---

## 🔥 The 13 Critical Storefront Rules

These rules are MANDATORY for all development:

1. ✅ **SSR-safe code** → Guard window, localStorage, document
2. ❌ **NO direct backend calls** → Use server/api/ proxy
3. ✅ **Reuse shared/utils/routes.ts** → NO hardcoded paths
4. ✅ **useXxx composables** → Single responsibility
5. ✅ **Plugin order** → 01.auth before 02.cart
6. ✅ **Client-only code** → .client.ts or ClientOnly
7. ✅ **Thin components** → Logic in composables/stores
8. ✅ **Pinia stores** → auth/cart patterns only
9. ✅ **I18n** → Use i18n/locales/ for all text
10. ✅ **Middleware** → auth.ts, guest.ts patterns
11. ✅ **Auto-imports** → Don't import Vue/Nuxt basics
12. ✅ **Type safety** → Use types/, avoid any
13. ✅ **Update docs** → Same changeset as code

**Learn More**: [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)

---

## 🤖 Working with AI Assistants

### Always Use This Template:

```
I need to [DESCRIBE TASK].

🔥 MANDATORY RULES:
1. SSR-safe → Guard browser APIs
2. NO direct backend → Use server/api/
3. Reuse routes.ts → NO hardcoded paths
4. useXxx composables
5. Plugin order correct
6. Client-only → .client.ts or ClientOnly
7. Thin components
8. I18n for text
9. Type safety
10. Update docs

🚫 DOCUMENTATION:
- NO files outside docs/
- ASK before creating docs

TASK: [Your details]

Confirm approach, then implement.
```

**Full Template**: [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)

---

## 🏗️ Project Structure

```
justshop-frontend/
├── docs/                   ← YOU ARE HERE
│   ├── 00-START-HERE.md   ← This file ⭐
│   ├── index.md           ← Documentation index
│   │
│   ├── AI_PROMPT_TEMPLATE.md              ⭐⭐⭐
│   ├── AI_RULES_ENFORCEMENT_SYSTEM.md     ⭐⭐⭐
│   ├── AI_DOCUMENTATION_RULES.md          ⭐⭐
│   ├── AI_COLLABORATION_CHECKLIST.md      ⭐
│   │
│   ├── getting-started/   ← Setup guides
│   ├── development/       ← Coding standards ⭐⭐⭐
│   ├── architecture/      ← System design ⭐⭐
│   ├── configuration/     ← Config docs
│   ├── operations/        ← Deployment & ops
│   ├── testing/           ← Test docs
│   ├── theme-system/      ← Theme integration
│   ├── fixes/             ← Bug fixes
│   ├── sessions/          ← Session logs
│   ├── refactoring-plan/  ← Refactoring programs
│   ├── integration/       ← Integration docs
│   ├── debugging/         ← Debug guides
│   ├── planning/          ← Planning docs
│   ├── reports/           ← Status reports
│   ├── reference/         ← ADRs & decisions
│   └── templates/         ← Doc templates
│
├── app/
│   ├── components/        ← Vue components
│   ├── composables/       ← useXxx functions
│   ├── stores/            ← Pinia (auth, cart)
│   ├── pages/             ← Routes
│   ├── layouts/           ← Page layouts
│   ├── middleware/        ← Route middleware
│   ├── plugins/           ← App boot logic
│   └── utils/             ← Utilities
│
├── server/
│   ├── api/               ← Backend proxy routes
│   └── utils/             ← Server utilities
│
├── shared/
│   └── utils/
│       └── routes.ts      ← Route constants ⭐
│
├── i18n/locales/          ← Translations (en, ar)
├── types/                 ← TypeScript types
└── tests/                 ← E2E tests
```

---

## 📊 Documentation Categories

| Category | Purpose | Files |
|----------|---------|-------|
| **development/** | Coding rules | 10+ ⭐⭐⭐ |
| **architecture/** | System design | 20+ ⭐⭐ |
| **testing/** | Test docs | 10+ |
| **getting-started/** | Setup | 5 ⭐⭐ |
| **operations/** | Deploy/ops | 11 |
| **configuration/** | Config | 7 |
| **theme-system/** | Theme docs | 3 |
| **refactoring-plan/** | Plans | 20+ |
| **fixes/** | Bug fixes | 5 |
| **sessions/** | Sessions | 9 |
| **Other categories** | Various | Many |

---

## 🎓 Learning Path

### For New Developers (First Week)

**Day 1: Project Understanding**
```
1. Read this file completely
2. Read getting-started/overview.md
3. Run the project locally
4. Explore codebase structure
```

**Day 2: Coding Standards**
```
1. Read development/coding-standards.md (ESSENTIAL!)
2. Read development/components.md
3. Read development/composables.md
4. Understand SSR safety rules
```

**Day 3: AI Collaboration**
```
1. Read AI_PROMPT_TEMPLATE.md
2. Read AI_RULES_ENFORCEMENT_SYSTEM.md
3. Read AI_DOCUMENTATION_RULES.md
4. Read AI_COLLABORATION_CHECKLIST.md
```

**Day 4: Architecture**
```
1. Read architecture/overview.md
2. Read architecture/rendering-strategy.md
3. Read architecture/data-fetching.md
4. Read architecture/state-management.md
```

**Day 5: First Task**
```
1. Use AI_PROMPT_TEMPLATE.md
2. Implement a small feature
3. Follow the checklist
4. Get code review
```

---

## ✅ Quality Checklist

Before committing code:

### SSR Safety
- [ ] No unguarded window, localStorage, document
- [ ] Client-only code properly isolated
- [ ] Hydration-safe

### Architecture
- [ ] Backend calls via server/api/
- [ ] Paths from shared/utils/routes.ts
- [ ] Composables named useXxx
- [ ] Components thin
- [ ] Logic in composables

### Standards
- [ ] Text uses i18n
- [ ] Types defined (no any)
- [ ] No unnecessary imports
- [ ] Follows patterns

### Testing
- [ ] npm run dev works
- [ ] npm run build succeeds
- [ ] No console errors
- [ ] Tested in browser

---

## 🚀 Quick Start Command

```bash
# 1. Install
nvm use
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your backend URL

# 3. Start development
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Start reading docs
# Begin with this file and AI_PROMPT_TEMPLATE.md
```

---

## 📖 Recommended Reading Order

**Week 1: Foundations**
1. This file (00-START-HERE.md)
2. AI_PROMPT_TEMPLATE.md
3. development/coding-standards.md
4. getting-started/overview.md
5. getting-started/running-locally.md

**Week 2: Deep Dive**
6. architecture/overview.md
7. architecture/rendering-strategy.md
8. architecture/data-fetching.md
9. development/components.md
10. development/composables.md

**Week 3: Mastery**
11. All architecture/ docs
12. All development/ docs
13. Feature-specific docs as needed

---

## 🎯 Common Tasks

### Task 1: Add New Component
```
1. Read development/components.md
2. Check existing components
3. Use AI_PROMPT_TEMPLATE.md
4. Ensure SSR-safe
5. Add i18n strings
6. Test in browser
```

### Task 2: Fix SSR Issue
```
1. Read architecture/rendering-strategy.md
2. Identify hydration mismatch
3. Use AI_PROMPT_TEMPLATE.md
4. Guard browser APIs
5. Test SSR rendering
6. Document in docs/fixes/
```

### Task 3: Add New Route
```
1. Read architecture/routing-and-navigation.md
2. Add to shared/utils/routes.ts
3. Create page in app/pages/
4. Add middleware if needed
5. Add i18n for page
6. Test navigation
```

---

## 🎉 Summary

You now have access to:

- ✅ **Comprehensive AI governance** (4 guides)
- ✅ **Complete coding standards** (10+ docs)
- ✅ **Architecture documentation** (20+ docs)
- ✅ **Ready-to-use templates**
- ✅ **Systematic checklists**
- ✅ **Professional organization**

**Most Important**: The [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) will transform your workflow. Use it for EVERY AI interaction.

---

## 🎯 Next Steps

1. ✅ Read this file (done!)
2. 📖 Read [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md)
3. 📖 Read [development/coding-standards.md](./development/coding-standards.md)
4. 🔖 Bookmark key documents
5. 🤖 Try the template with AI
6. ✅ Use [AI_COLLABORATION_CHECKLIST.md](./AI_COLLABORATION_CHECKLIST.md)

---

**Welcome aboard! Let's build an amazing storefront! 🚀**

---

**Created**: June 7, 2026  
**Purpose**: Entry point for all storefront documentation  
**Status**: Your starting point for everything  
**Next**: Read [AI_PROMPT_TEMPLATE.md](./AI_PROMPT_TEMPLATE.md) ⭐
