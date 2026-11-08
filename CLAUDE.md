# CLAUDE.md

Portfolio site for audreylohmann.ch. Plain HTML/CSS/JS, served and built with Vite.

## Review workflow (always follow)

Audrey reviews every change in VS Code before it goes anywhere else.

1. **Pull first.** Before starting any task, pull the current feature branch. Audrey may have pushed her own edits.
2. **Work only on the feature branch you were given.** Never commit or push to `main`: every push to `main` builds and deploys the live site (`.github/workflows/publish2.yml`).
3. **Small, clear commits.** One logical change per commit, with a message that says what changed and why, so each one reads well as a diff.
4. **Push, never merge.** Push to the feature branch and stop. Do not merge, rebase onto `main`, or force-push.
5. **No pull requests unless asked.**
6. **Respect Audrey's edits.** If she changed something you wrote, keep her version. Don't revert it or "fix" it back. Ask if it conflicts with the task.
7. **Report back briefly.** List the files changed, any decisions she might want to change, and anything you saw but left alone.

## Project notes

- Run locally: `npm install`, then `npm run dev`. Pages use root-relative paths (`/Styles/...`), so open them through the dev server, not as files.
- Pages: `index.html`, `about.html`, project pages in `Projekte/`.
- Styles: `Styles/styleUniversal.css` (shared), `Styles/styleProjects-new.css` (new project page layout).
- Scripts: `Scripts/`. Old experiments live in `UnusedScripts/`; don't wire them back in.
- Accent colours: `#ff00aa` (site hover) and `#e943c2` (project nav, from Figma).
- Designs live in the Figma file `portfolio-website`. Implement from the Figma components, not from screenshots.
