export type LocaleDict = Record<string, unknown>;

function resolve(dict: LocaleDict, key: string): unknown {
  const parts = key.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur !== null && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function getNested(dict: LocaleDict, key: string): string | undefined {
  const cur = resolve(dict, key);
  return typeof cur === 'string' ? cur : undefined;
}

export function getNestedArray(dict: LocaleDict, key: string): string[] | undefined {
  const cur = resolve(dict, key);
  return Array.isArray(cur) && cur.every((v) => typeof v === 'string')
    ? (cur as string[])
    : undefined;
}
