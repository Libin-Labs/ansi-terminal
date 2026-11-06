# @lp-labs/ansi-terminal

Small terminal-text utilities with sanitization before styling and an intentionally limited Unicode
model. Visible-length and truncation APIs count Unicode code points, not terminal columns; no
`wcwidth`-style claim is made.

## Install

```bash
npm install @lp-labs/ansi-terminal
```

```js
import { styleTerminalText, truncateTerminalText } from '@lp-labs/ansi-terminal';

const label = styleTerminalText(truncateTerminalText('Upload complete 😀', 12), 'green');
if (!label.startsWith('\u001b[32m')) throw new Error('Expected green styling');
```

## API

- `stripAnsi(text)` removes recognized CSI and OSC escape sequences.
- `sanitizeTerminalText(text)` additionally removes C0/C1 control characters.
- `visibleCodePointLength(text)` counts code points after stripping recognized ANSI sequences.
- `truncateTerminalText(text, limit, suffix?)` sanitizes and truncates to a code-point limit. A suffix
  is itself sanitized and shortened to fit.
- `styleTerminalText(text, style, enabled?)` sanitizes input and adds a supported style only when
  enabled. `AnsiStyle` is `'bold' | 'dim' | 'italic' | 'underline' | 'red' | 'green' | 'yellow' |
'blue'`.

Styling is disabled only by passing `false`; plain output is still sanitized. The package owns and
balances the style's closing sequence. Never concatenate untrusted terminal control sequences after
the sanitized output.

## Errors and scope

Invalid truncation limits throw `RangeError`; unsupported styles throw `TypeError`. Length counts
Unicode code points and does not model combining marks, emoji width, tabs, grapheme clusters, or
terminal-specific rendering. ANSI stripping recognizes common CSI/OSC forms, not every terminal
protocol. To customize colors, map application states to the fixed safe style set or keep styling
disabled.

## Performance

Each operation scans the input linearly; truncation materializes code points. APIs do not impose an
input-length ceiling, so callers processing untrusted very large text should bound it before use.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
