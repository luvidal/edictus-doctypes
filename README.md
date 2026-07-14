# @edictus/doctypes

The Chilean document-type **catalog** — the shared vocabulary for the Jogi
document-reading engine. It answers: *what document types exist, how is each
recognized, what fields does each yield, and how does each behave in the
pipeline?*

This package **owns the catalog system** (source-of-truth; Jogi consumes it):

- `catalog/doctypes.yaml` — the hand-edited **source of truth**.
- `catalog/build-doctypes.ts` — YAML→JSON **compiler**: validates required
  fields + the `classifier` block, auto-mirrors reciprocal `tieBreaker`
  entries, and rejects a `tieBreaker.vs` that doesn't resolve to a real id.
- `catalog/doctypes.json` — **generated** artifact, bundled into `dist/`.
  Never hand-edit; run `npm run build:doctypes` after editing the YAML. The
  `check:doctypes` drift gate (CI) fails on drift.

## Consumed by

- `@edictus/classifier` / `@edictus/extract` / `@edictus/cedula` — injected the **raw
  catalog** (`doctypesCatalog`) via their `configure({ doctypes })`.
- The Jogi host + the future `@edictus/docreader` engine — use the **helpers**
  (`getDoctypesMap`, `getDoctype`, …) and `multipart` utilities.

## Usage

```ts
import { getDoctypesMap, getDoctype, doctypesCatalog } from '@edictus/doctypes'
import { getMultiPartConfig } from '@edictus/doctypes/multipart'
```

Unlike the old monolithic `docs` package, there is **no `configure({ doctypes })`**
— the catalog is bundled, so helpers work on import.

## Scripts

| script | what |
|---|---|
| `npm run build:doctypes` | regenerate `catalog/doctypes.json` from the YAML |
| `npm run check:doctypes` | drift gate — fail if JSON ≠ YAML |
| `npm run build` | bundle `dist/` (tsup, cjs+esm+dts); commit `dist/` |
| `npm test` | vitest |
