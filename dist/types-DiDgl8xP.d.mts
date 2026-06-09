interface HowToObtain {
    steps: string[];
    tips?: string[];
}
interface FieldDef {
    key: string;
    type: 'string' | 'date' | 'month' | 'time' | 'num' | 'bool' | 'list' | 'obj';
    internal?: boolean;
    ai?: string;
}
type DocFrequency = 'once' | 'monthly' | 'annual';
type ExtractScope = 'firstPage' | 'firstTwoPages' | 'selectedPages' | 'fullRange';
interface DoctypeField {
    [key: string]: string | number | boolean | object | any[] | null;
}
interface Doctype {
    label: string;
    shortLabel?: string;
    category?: string;
    freq: DocFrequency;
    count: number;
    maxAge?: number;
    graceDays?: number;
    hasFechaVencimiento: boolean;
    multiInstance?: boolean;
    pageAtomic?: boolean;
    extractScope?: ExtractScope;
    parts?: string[];
    contains?: string[];
    definition: string;
    dateHint?: string;
    instructions: string;
    fields: DoctypeField;
    fieldDefs: FieldDef[];
    internalFields: Set<string>;
    howToObtain?: HowToObtain;
}
type DoctypesMap = Record<string, Doctype>;
interface DocRequirement {
    freq: DocFrequency;
    count: number;
}
interface MultiPartConfig {
    enabled: boolean;
    parts: Array<{
        id: string;
        label: string;
    }>;
}

export type { DocFrequency as D, ExtractScope as E, FieldDef as F, HowToObtain as H, MultiPartConfig as M, Doctype as a, DoctypeField as b, DoctypesMap as c, DocRequirement as d };
