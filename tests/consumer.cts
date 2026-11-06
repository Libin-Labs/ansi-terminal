import { sanitizeTerminalText, visibleCodePointLength } from '@lp-labs/ansi-terminal';
const text: string = sanitizeTerminalText('text');
const length: number = visibleCodePointLength(text);
// @ts-expect-error input is text.
visibleCodePointLength(3);
void length;
