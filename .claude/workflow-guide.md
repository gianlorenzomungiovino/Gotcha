# Gotcha - Workflow Guide for Claude

This guide explains how to manage development workflow and session documentation.

---

## 📁 File Organization

### `.claude/` Directory (Claude's context files)
- **`CLAUDE.md`** - Project overview, git rules (auto-loaded)
- **`workflow-guide.md`** (this file) - Development workflow guidelines
- **`session-report.md`** - Session progress tracking (auto-loaded)

### Repository Files
- **`start/`** - React/Vite frontend + Express backend (single git repo)
  - `src/frontend/` - React components, pages, context
  - `src/backend/` - Express API routes, Socket.IO server, database models
  - `public/` - Static assets

---

## 🔄 Workflow Guidelines

### At Start of Session

1. **Context is auto-loaded** - CLAUDE.md, session-report.md, workflow-guide.md
2. **Continue work** based on user requests

### During Session

**CRITICAL: Testing Before Commits**

**⚠️ NEVER commit code that hasn't been tested!**

The correct workflow is:
1. **Implement** the changes
2. **Test together** with the user - verify it works as expected
3. **ONLY THEN commit** the tested code

**❌ WRONG:**
```
Implement feature → Commit immediately → Test → Discover bugs
```

**✅ CORRECT:**
```
Implement feature → Test with user → Commit tested code
```

---

## 🔚 End of Session Checklist

**MANDATORY steps at end of EVERY session:**

### Step 1: Update session-report.md
- Add new session section (compact, 50-80 lines max)
- Condense/delete old sessions (keep last 5-6 in detail)
- Keep total file under 200 lines

### Step 2: Commit Repo (if user requests)
```bash
cd start && git add . && git commit -m "..." && git push
```

**IMPORTANT:** Always wait for user's explicit permission before committing/pushing.

---

## 📝 Git Commit Management

### Conventional Commit Format

- `feat():` - New features
- `fix():` - Bug fixes
- `refactor():` - Code restructuring
- `docs():` - Documentation
- `style():` - Formatting
- `perf():` - Performance
- `test():` - Tests
- `chore():` - Maintenance

**IMPORTANT:**
- Do NOT include "Generated with Claude Code" footer
- Do NOT include "Co-Authored-By: Claude" lines

### Smart Commit Helper

Use `/commit` for complex sessions.

---

## 📊 session-report.md Guidelines

**Keep it compact** — target under 200 lines total.

**What to keep:**
- Current architecture (concise)
- Last 3 sessions in detail, older ones condensed to 1-2 lines
- Current state (bullet list)
- Next steps / TODO

**What to remove:**
- Detailed implementation steps (use git log instead)
- Long code examples
- Redundant explanations

---

## 🎯 Decision Tree

**User asks to commit:**
→ Verify tested → `/commit` or manual → update session-report.md → push if requested

**Session ends:**
→ Update session-report.md (compact) → commit if user requests

**User asks about history:**
→ session-report.md for high-level → git log for details

---

## 📌 Remember

1. **Test before commit** — never commit untested code
2. **Keep session-report.md compact** — under 200 lines
3. **User permission required** — NEVER auto-commit or auto-push
4. **Monorepo structure** — frontend + backend in same `start/` repo
5. **Conventional commits** — semantic, no AI attribution

---

**Last Updated:** 2026-03-10
