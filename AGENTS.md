# AGENTS.md - Yishe Tool

## Commands

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run typecheck    # TypeScript 类型检查 (vue-tsc --noEmit)
```

## Architecture

Pure frontend Vue 3 + TypeScript design tool. AI keys fetched from backend API, decrypted client-side, used directly in browser.

Agent layer at `src/ai/` — currently `simple.ts` (imperative loop) is production. `graph.ts` + `nodes/` is the LangGraph implementation (not yet wired in).

Operations at `src/operations/` — canvas manipulation tools registered and exposed to AI as function definitions.

## Guidelines

- Progressive refactoring: each change must be independently usable, never break existing flow
- No hardcoded secrets
- Run `npm run typecheck` after code changes
