import { styleTerminalText, truncateTerminalText, type AnsiStyle } from '@lp-labs/ansi-terminal';
const style: AnsiStyle = 'underline';
const value: string = styleTerminalText('safe', style, false) + truncateTerminalText('long', 2);
// @ts-expect-error only documented safe styles are supported.
styleTerminalText('x', 'blink');
void value;
