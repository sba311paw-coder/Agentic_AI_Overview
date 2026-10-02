# Dashboard changelog

## Version 2 — 2026-10-02

- Light default and softer dark palette, readable text, visible focus, responsive project details, SVG navigation and native HTML disclosure.
- All 16 project ideas now have goals, approaches, prerequisites, deliverables, acceptance checks and canonical C00/P01–P08/C09 references.
- Independent built/tested/rebuilt/explained evidence, HTTPS links, debugging notes, search and optional-extension filtering.
- Progress export, validated import preview/cancel/apply and recovery snapshot; separate aiAcademy_v2 storage leaves original aiAcademy_v1 records unchanged; old-format JSON backups can be imported explicitly. A one-time switch to light is followed by persistent theme choices.
- Corrected skill-unlock/count logic, repeated Home rendering and local-date calculation. Unsafe persisted note/log markup is escaped. Storage failures preserve raw data and show recovery guidance.
- Canonical alignment: multi-agent coordination optional after C08; evaluation/security start early; Redis, Docker and public deployment conditional; production approval, rollback/recovery and maintenance required.
- Corrected introductory AI taxonomy/causal-attention explanations, schema-only validation claim and mismatched resource publisher labels. Historical resource dates do not imply current verification.
- Original 80 lessons, source project numbering and original HTML/PDF artifacts retained. Older PDF snapshots are historical and were not regenerated for this HTML release.

## Validation

Node regression checks cover migration, theme persistence, corrupt/blocked storage, import validation, safe links and retained lessons. Browser checks cover desktop/mobile project disclosures, evidence save/reload, search/filter, light/dark, route rendering and backup import preview/cancel/apply. Export JSON generation is regression-tested; the in-app browser download event timed out, so completed browser download was not verified. Publication verification is recorded in the canonical companion document.

The new page is additive: AI-Agentic-AI-Master-Academy-Dashboard-v2.html with local v2/ assets. It replaces the large bundled diagram renderer with native SVG and readable relationship/source descriptions. Public mapping/evidence guidance fixes private-repository 404s while keeping canonical repository access private.
