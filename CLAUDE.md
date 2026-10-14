# CLAUDE.md

## Git: one branch only

- Always commit and push directly to `main`. `main` is the branch Vercel deploys to the custom domain.
- Do not create feature branches or pull requests. If a session starts on another branch, bring `main` up to date with that work and push `main`.
- Before pushing, run `npx vitest run` and `npm run build`; push only when both pass.
