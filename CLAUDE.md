# @edictus/doctypes

The Chilean document-type **catalog** — the shared vocabulary for the Jogi document-reading engine. Owns the source-of-truth YAML, the compiler, the drift gate, and the bundled JSON. Zero runtime deps. Extracted from [jogi](../jogi) so the document-reading SaaS owns its own vocabulary.

## Operating memory

- Read this file before editing; it is the canonical module contract.
- Parent Jogi context lives in `../jogi`; Jogi **consumes** this catalog and no longer holds `data/doctypes.{yaml,json}`. Do not modify `../jogi` unless the PM explicitly asks.
- Sibling satellites `../jogi@classifier`, `../jogi@extract`, `../jogi@cedula` are injected the raw catalog at host startup; keep their conventions in mind.
- Keep code simple and minimal; add LOC only when necessary.

## Contract

1. **Source of truth is `catalog/doctypes.yaml`** — the hand-edited per-doctype catalog (`definition` + `classifier` block + `derived` rules). Never hand-edit the generated JSON.
2. **`catalog/build-doctypes.ts` is the compiler** — YAML→JSON: validates required fields + the `classifier` shape, auto-mirrors reciprocal `tieBreaker` entries, and rejects a `tieBreaker.vs` that doesn't resolve to a real id. Run `npm run build:doctypes` after editing the YAML.
3. **`catalog/doctypes.json` is generated** and bundled into `dist/` (inlined by tsup). The package **self-loads** it — there is **no `configure({ doctypes })`**; every helper reads the bundled catalog on import.
4. **Byte-stable serialization** — the bundled catalog must stringify byte-identically to what consumers hash. The upload slice-cache content hash depends on it; divergence breaks cache parity across the engine satellites. Do not reorder/reshape the JSON emitter casually.
5. **Two entry points**: `@edictus/doctypes` (doctype queries, types, raw `doctypesCatalog`) and `@edictus/doctypes/multipart` (multi-part file utilities). Both are zero-runtime-dep and browser-safe.
6. **No host coupling** — no `@/` imports, no Prisma/S3/Next, no Sentry. Pure data + helpers only.

## Public surface

- Helpers/types: `getDoctypesMap`, `getDoctype`, `getDoctypesLegacyFormat`, `getDocumentDefaults`, `applyDefaults`, `isRecurring`, `DoctypesMap`, …
- `doctypesCatalog` — the raw/unexpanded catalog (classifier blocks intact), exported for the host to inject into `@edictus/{classifier,extract,cedula}`.
- `@edictus/doctypes/multipart` — multi-part file utilities (e.g. `getMultiPartConfig`).

## Commands

```bash
npm run build:doctypes   # regenerate catalog/doctypes.json from the YAML
npm run check:doctypes   # drift gate — fail if JSON ≠ YAML (CI)
npm run build            # bundle dist/ (tsup, cjs+esm+dts); commit dist/
npm test                 # vitest
```

## Validation

`npx tsc --noEmit` for fast type checking; `npm run check:doctypes` for catalog drift; `npm run build` to verify bundling; `npm test` before committing.

## Consumer integration

Consumed by Jogi via GitHub SHA pin (never `#main`, never `file:`):

```json
"@edictus/doctypes": "github:luvidal/edictus-doctypes#<40-char-sha>"
```

Jogi wiring: `lib/domain/doctypes.ts` re-exports the package + `/multipart`; `lib/server/docsinit.ts` injects `doctypesCatalog` into the engine satellites. The future `@edictus/docreader` engine uses the helpers directly.
