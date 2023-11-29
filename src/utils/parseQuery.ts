export function parseQueryDate(str: string | undefined): Date | undefined {
  if (!str) return undefined;

  const time = Date.parse(str);

  if (isNaN(time)) return undefined;

  return new Date(time);
}

export function parseQueryInt(str: string | undefined): number | undefined {
  if (!str) return undefined;

  const n = parseInt(str);

  if (isNaN(n)) return undefined;

  return n;
}
