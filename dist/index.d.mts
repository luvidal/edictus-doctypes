import { D as DocFrequency, a as Doctype, b as DoctypeField, c as DoctypesMap, d as DocRequirement } from './types-DiDgl8xP.mjs';
export { E as ExtractScope, F as FieldDef, H as HowToObtain, M as MultiPartConfig } from './types-DiDgl8xP.mjs';

/**
 * Document types helper library.
 *
 * Lifted from @jogi/docs/doctypes; the only change is the data source — it now
 * reads the bundled catalog (`./data`) instead of host-injected `configure()`.
 */

declare function getDoctypesMap(): DoctypesMap;
declare function getDoctypes(): Array<Doctype & {
    id: string;
}>;
declare function getDoctype(id: string): (Doctype & {
    id: string;
}) | null;
declare function getDoctypeIds(): string[];
declare function isDoctypeValid(id: string): boolean;
declare function isMultiInstanceDocType(id: string): boolean;
declare function getDoctypesLegacyFormat(): Array<{
    id: string;
    label: string;
    definition: string;
    instructions: string;
    fields: DoctypeField;
    category?: string;
    multiInstance?: boolean;
}>;
declare function getDoctypesByCategory(category: string): Array<Doctype & {
    id: string;
}>;
declare function getCategories(): string[];
declare function getInternalFieldKeys(doctypeId: string): string[];
declare function getDocumentDefaults(doctypeid: string): DocRequirement;
declare function isRecurring(doctypeid: string): boolean;
declare function applyDefaults(requirements: Record<string, {
    freq?: string;
    count?: number;
}>): Record<string, {
    freq: DocFrequency;
    count: number;
}>;

/**
 * Raw catalog (unexpanded) — the shape @jogi/classifier / @jogi/extract /
 * @jogi/cedula consume via their own `configure({ doctypes })`. The host wires
 * this in instead of reading `data/doctypes.json` directly.
 */
declare const doctypesCatalog: Record<string, unknown>;
/** Internal accessor used by the doctype helpers (was config injection in @jogi/docs). */
declare function getRawDoctypes(): Record<string, unknown>;

export { DocFrequency, DocRequirement, Doctype, DoctypeField, DoctypesMap, applyDefaults, doctypesCatalog, getCategories, getDoctype, getDoctypeIds, getDoctypes, getDoctypesByCategory, getDoctypesLegacyFormat, getDoctypesMap, getDocumentDefaults, getInternalFieldKeys, getRawDoctypes, isDoctypeValid, isMultiInstanceDocType, isRecurring };
