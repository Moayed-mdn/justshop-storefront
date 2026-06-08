# ✅ AI Collaboration Checklist (Storefront)

**Use this checklist for EVERY AI interaction**  
**Date**: June 7, 2026

---

## 📋 Pre-Interaction Checklist

- [ ] I know the component/feature area
- [ ] I have docs/development/coding-standards.md in mind
- [ ] I have the AI prompt template ready
- [ ] I know if I want documentation or not

---

## 🤖 Prompt Checklist

**Include in EVERY prompt:**

### ✅ Storefront Rules Section
- [ ] Included: "SSR-safe code (guard browser APIs)"
- [ ] Included: "NO direct backend calls (use server/api/)"
- [ ] Included: "Reuse shared/utils/routes.ts"
- [ ] Included: "useXxx composable naming"
- [ ] Included: "Plugin order (01.auth before 02.cart)"
- [ ] Included: "Client-only code (.client.ts or ClientOnly)"
- [ ] Included: "Thin components"
- [ ] Included: "Pinia stores (auth/cart patterns)"
- [ ] Included: "I18n for text"
- [ ] Included: "Type safety"

### ✅ Documentation Rules Section
- [ ] Included: "NO files outside docs/"
- [ ] Included: "ASK before creating docs"

---

## 💻 Code Output Verification

**After AI provides code, check:**

### SSR Safety
- [ ] No unguarded window, localStorage, document
- [ ] Client-only code properly isolated
- [ ] Hydration-safe implementation

### Architecture
- [ ] Backend calls via server/api/ proxy
- [ ] Paths from shared/utils/routes.ts
- [ ] Composables named useXxx
- [ ] Components thin (logic in composables)
- [ ] Plugin order correct

### Standards
- [ ] Text uses i18n
- [ ] Types defined (no any)
- [ ] No unnecessary imports
- [ ] Follows existing patterns

### Files
- [ ] No .md files in wrong locations
- [ ] Documentation in correct category

---

## 🚫 Violation Response

**If you find ANY violation:**

```
❌ VIOLATION: [Describe violation]

RULE: [Reference the rule]

FIX REQUIRED: [What needs to change]

Do this now before continuing.
```

---

## ✅ Acceptance Checklist

**Only accept when:**

- [ ] All rules followed
- [ ] SSR-safe
- [ ] Proper architecture
- [ ] Standards compliant
- [ ] Docs in correct location (if any)

---

**Created**: June 7, 2026  
**Status**: Use for every AI interaction
