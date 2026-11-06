export type AnsiStyle =
  'bold' | 'dim' | 'italic' | 'underline' | 'red' | 'green' | 'yellow' | 'blue';
const CODES: Record<AnsiStyle, readonly [number, number]> = {
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
};
export function stripAnsi(input: string): string {
  return input.replace(/\u001b(?:\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001b\\))/g, '');
}
export function sanitizeTerminalText(input: string): string {
  return stripAnsi(input).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, '');
}
export function visibleCodePointLength(input: string): number {
  return Array.from(stripAnsi(input)).length;
}
export function truncateTerminalText(input: string, limit: number, suffix = '…'): string {
  if (!Number.isSafeInteger(limit) || limit < 0)
    throw new RangeError('Limit must be a nonnegative safe integer');
  const text = sanitizeTerminalText(input);
  const chars = Array.from(text);
  if (chars.length <= limit) return text;
  const tail = Array.from(sanitizeTerminalText(suffix));
  if (limit === 0) return '';
  if (tail.length >= limit) return tail.slice(0, limit).join('');
  return `${chars.slice(0, limit - tail.length).join('')}${tail.join('')}`;
}
export function styleTerminalText(input: string, style: AnsiStyle, enabled = true): string {
  const text = sanitizeTerminalText(input);
  if (!enabled) return text;
  if (!Object.hasOwn(CODES, style)) throw new TypeError(`Unsupported terminal style: ${style}`);
  const codes = CODES[style];
  return `\u001b[${codes[0]}m${text}\u001b[${codes[1]}m`;
}
