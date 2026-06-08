# 🚫 AI Documentation Rules - Prevent Chaotic File Creation (Storefront)

**Purpose**: Prevent AI from creating documentation files in random locations  
**Date**: June 7, 2026

---

## 🔥 THE PROBLEM

AI often creates documentation files like:
- ❌ `justshop-frontend/task-summary.md`
- ❌ `justshop-frontend/NOTES.md`
- ❌ `app/components/README.md`
- ❌ `server/api/CHANGES.md`

**Result**: Chaos! 😱

---

## ✅ THE SOLUTION

**STRICT RULE**: AI MUST ONLY create documentation in designated folders.

---

## 📋 Documentation File Location Rules

### Rule 1: NO Documentation Files Outside docs/

**FORBIDDEN LOCATIONS:**
```
❌ justshop-frontend/*.md (except README, CHANGELOG, CONTRIBUTING)
❌ app/**/*.md
❌ server/**/*.md
❌ shared/**/*.md
❌ tests/**/*.md
```

**ONLY ALLOWED LOCATION:**
```
✅ justshop-frontend/docs/[category]/filename.md
```

### Rule 2: Documentation MUST Go in Correct Category

| Category | Use For |
|----------|---------|
| `docs/fixes/` | Bug fixes |
| `docs/sessions/` | Session logs |
| `docs/testing/` | Test results |
| `docs/architecture/` | System architecture |
| `docs/development/` | Development guides |
| `docs/operations/` | Deployment & ops |
| `docs/theme-system/` | Theme integration |
| `docs/refactoring-plan/` | Refactoring plans |
| `docs/integration/` | Integration docs |

### Rule 3: File Naming Convention

**REQUIRED FORMAT:**
```
[PURPOSE]_[DESCRIPTION].md

Examples:
✅ FIX_SSR_HYDRATION.md
✅ SESSION_17_COMPLETE.md
✅ TEST_RESULTS_2026_06_07.md

❌ notes.md (too generic)
❌ temp.md (temporary name)
```

---

## 🤖 How to Tell AI

**Copy-paste this into your prompt:**

```
📝 DOCUMENTATION RULES (MANDATORY):

1. NO documentation files outside justshop-frontend/docs/
2. IF you need to create documentation:
   - ASK ME which category first
   - Use UPPERCASE_WITH_UNDERSCORES.md naming
   - Place in proper docs/[category]/ folder
3. FORBIDDEN:
   - justshop-frontend/*.md (root level)
   - app/**/*.md, server/**/*.md (in code)

IF you need to document:
- ASK: "Should I create documentation? Where?"
- WAIT for approval
- CREATE in approved location only

DO NOT create documentation files without asking!
```

---

## ✅ Success Criteria

- [ ] AI asks before creating docs
- [ ] All docs in docs/[category]/
- [ ] Filenames are UPPERCASE
- [ ] No files in project root (except README, CHANGELOG, CONTRIBUTING)
- [ ] No files in code folders

---

**Created**: June 7, 2026  
**Status**: Active enforcement guide
