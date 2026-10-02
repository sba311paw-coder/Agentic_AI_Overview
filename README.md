# Agentic AI Overview — Interactive Course Dashboard

A self-contained, single-file interactive HTML dashboard covering a
16-week AI → Agentic AI learning program: week-by-week objectives,
resource library, flashcards, quizzes, project/dependency tracking, and
more. No build step, no dependencies — everything (styles, content,
interactivity) lives inside one `.html` file.

## Files in this repo

- **`AI-Agentic-AI-Master-Academy-Dashboard-HumanInTheLoopAI.html`** —
  the current dashboard (v2.0). Start here.
- **`AI-Agentic-AI-Master-Academy-Dashboard-HumanInTheLoopAI.pdf`** — a
  static PDF snapshot of the current dashboard's Home tab, for quick
  viewing without opening a browser.
- **`AI-Agentic-AI-Master-Academy-Dashboard_1.html`** and
  **`AI-Agentic-AI-Master-Academy.pdf`** — the original v1.0 dashboard
  and its PDF snapshot, kept for reference/history.

## Why doesn't it look interactive on GitHub?

GitHub's file viewer never renders `.html` files directly — it always
shows the raw source code instead, as a security default (so a
malicious HTML/JS file can't execute just because someone viewed it on
github.com). That's expected here, not a problem with this repo.

To actually see the interactive dashboard, use one of the two options
below.

## Option 1: Download and open locally (works right away)

1. Click `AI-Agentic-AI-Master-Academy-Dashboard-HumanInTheLoopAI.html`
   above, then the **⋯** menu next to "Blame" → **Download raw file**
   — or clone the whole repo:
   ```bash
   git clone git@github.com:sba311paw-coder/Agentic_AI_Overview.git
   ```
2. Double-click the downloaded `.html` file (or drag it into any
   browser window). It opens and works fully offline — no internet
   connection or server needed.

## Option 2: View it live, no download needed (GitHub Pages)

If GitHub Pages is enabled for this repo, the dashboard is viewable
directly at:

**https://sba311paw-coder.github.io/Agentic_AI_Overview/AI-Agentic-AI-Master-Academy-Dashboard-HumanInTheLoopAI.html**

To enable it (one-time setup, repo owner only):

1. Go to the repo's **Settings** → **Pages** (left sidebar)
2. Under "Build and deployment" → Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)** → **Save**
4. Wait about a minute for it to build, then the link above goes live

## Just want a quick look, no setup?

Open `AI-Agentic-AI-Master-Academy-Dashboard-HumanInTheLoopAI.pdf`
directly in GitHub's built-in PDF preview — it's a static snapshot, so
it won't have the flashcards/quizzes/interactivity, but it's the
fastest way to see the content with zero setup.


## New Version 2 companion — 2026-10-02

[Open version 2](https://sba311paw-coder.github.io/Agentic_AI_Overview/AI-Agentic-AI-Master-Academy-Dashboard-v2.html#projects). The original dashboard, its URL and PDF/v1 artifacts are preserved.

Version 2 adds a light default, softer dark option, SVG navigation and learning diagrams, expanded goals/approaches, prerequisites, deliverables and acceptance checks for all 16 project ideas. Separate built/tested/rebuilt/explained evidence, safe links and debugging notes support independent learning. All 80 lessons are retained with targeted teaching corrections. Evaluation/security start early; multi-agent work is optional after C08; production requires human approval and operational evidence.

[Public project mapping and evidence guide](v2/project-guide.html) works without access to the private canonical repository. [AI Engineer Path](https://github.com/sba311paw-coder/ai-engineer-path) remains the canonical curriculum owner; authorized GitHub access is required.

Version 2 uses its own `aiAcademy_v2` browser storage and does not alter original `aiAcademy_v1` progress. Export/import JSON is local and explicit; import validates and previews replacement, supports cancellation and preserves a local pre-import snapshot. There is no automatic synchronization, account, analytics or AI API. Personal checkmarks do not certify mastery.

The new HTML loads local files in `v2/`, including readable course data, lesson units and application scripts. Keep the HTML and that directory together when downloading; no build step or external runtime dependency is needed. Native SVG replaces the large diagram bundle; readable relationships and original diagram descriptions remain available.

Run `node tests/progress.test.cjs`. See [CHANGELOG.md](CHANGELOG.md) and [DESIGN.md](DESIGN.md). Browser checks cover desktop/mobile layout, local evidence save/reload, search/filter, themes and import preview/cancel/apply. Backup JSON generation is regression-tested; a completed browser download event was not verified in the in-app browser.
