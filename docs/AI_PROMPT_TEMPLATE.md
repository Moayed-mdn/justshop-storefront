# 🎯 AI Prompt Template - Copy & Paste (Storefront)

**Use this template for EVERY AI interaction**  
**Prevents architecture violations + documentation chaos**

---

## 📋 The Complete Template

```
I need to [DESCRIBE YOUR TASK].

🔥 MANDATORY STOREFRONT RULES (from docs/development/coding-standards.md):

1. SSR-safe code → Guard window, localStorage, document
2. NO direct backend calls → Use server/api/ proxy
3. Reuse shared/utils/routes.ts → NO hardcoded paths
4. Composables use useXxx naming → Single responsibility
5. Keep plugins ordered → 01.auth.client.ts before 02.cart.client.ts
6. Client-only code → Use .client.ts suffix or ClientOnly
7. Keep components thin → Logic in composables/stores
8. Pinia stores → auth and cart patterns only
9. I18n for all text → Use i18n/locales/
10. Route middleware → auth.ts, guest.ts patterns
11. Nuxt auto-imports → Don't import ref, computed, etc.
12. Type safety → Use types/ definitions
13. Update docs → Same changeset as code

🚫 DOCUMENTATION RULES:

1. NO files outside justshop-frontend/docs/
2. NO files in project root (except README, CHANGELOG, CONTRIBUTING)
3. NO files in code folders (app/, server/, shared/)
4. ONLY create in docs/[category]/ folders
5. ASK before creating ANY documentation
6. Use UPPERCASE_NAMING.md format

Available categories:
- docs/fixes/           → Bug fixes
- docs/sessions/        → Session logs
- docs/testing/         → Test results
- docs/architecture/    → System architecture
- docs/development/     → Development guides
- docs/operations/      → Deployment & ops
- docs/theme-system/    → Theme integration

DEFAULT: Don't create documentation unless explicitly asked.

📝 TASK DETAILS:
- Component/Feature: [YOUR FEATURE]
- Page/Route: [YOUR ROUTE IF APPLICABLE]
- Requirements:
  • [REQUIREMENT 1]
  • [REQUIREMENT 2]
  • [REQUIREMENT 3]

🔄 PROCESS:
1. FIRST: Confirm SSR safety and existing patterns
2. THEN: Show implementation plan
3. WAIT for my approval
4. THEN: Implement following standards
5. IF documentation needed: ASK where to put it

NO EXCEPTIONS. FOLLOW STRICTLY.

Begin now.
```

---

## 🚀 Quick Examples

### Example 1: New Component (No Docs)

```
I need to add a product wishlist button.

[PASTE FULL TEMPLATE ABOVE]

TASK DETAILS:
- Component: WishlistButton
- Page: Product detail page
- Requirements:
  • Toggle wishlist state
  • Update via server/api/ proxy
  • Show feedback toast

DOCUMENTATION: None needed, just code.

Begin now.
```

---

### Example 2: Bug Fix (With Docs)

```
I need to fix the SSR hydration mismatch in cart badge.

[PASTE FULL TEMPLATE ABOVE]

TASK DETAILS:
- Component: CartBadge
- Issue: Hydration mismatch due to localStorage
- Requirements:
  • Wrap with ClientOnly
  • Preserve layout stability
  • Fix SSR/client divergence

DOCUMENTATION: Yes, create in docs/fixes/FIX_CART_BADGE_HYDRATION.md

Begin now.
```

---

## 💡 Pro Tips

1. **Save this template** for quick access
2. **Always check** existing composables before creating new ones
3. **Always reference** shared/utils/routes.ts for paths
4. **Always guard** browser APIs for SSR
5. **Always verify** with checklist

---

## 📚 Related Documents

- **Full Rules**: [AI_RULES_ENFORCEMENT_SYSTEM.md](./AI_RULES_ENFORCEMENT_SYSTEM.md)
- **Documentation Rules**: [AI_DOCUMENTATION_RULES.md](./AI_DOCUMENTATION_RULES.md)
- **Agent Rules**: [development/AI_AGENT_RULES.md](./development/AI_AGENT_RULES.md)
- **Entry Point**: [00-START-HERE.md](./00-START-HERE.md)

---

**Created**: June 7, 2026  
**Purpose**: Ready-to-use AI prompt template for Nuxt storefront  
**Status**: Copy & paste into every AI interaction
