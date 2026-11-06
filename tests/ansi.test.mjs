import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeTerminalText,
  stripAnsi,
  styleTerminalText,
  truncateTerminalText,
  visibleCodePointLength,
} from '../dist/esm/index.js';
test('strips CSI and OSC escape sequences', () => {
  assert.equal(stripAnsi('\x1b[31mred\x1b[0m'), 'red');
  assert.equal(stripAnsi('\x1b]0;title\x07x'), 'x');
});
test('sanitizes untrusted escape and control characters before styling', () => {
  assert.equal(styleTerminalText('x\x1b[2J\x07', 'red'), '\x1b[31mx\x1b[39m');
});
test('can disable styling while keeping sanitized text', () => {
  assert.equal(styleTerminalText('a\x1b[31m', 'bold', false), 'a');
});
test('counts Unicode code points without claiming terminal display columns', () => {
  assert.equal(visibleCodePointLength('a😀'), 2);
});
test('truncates to a code point budget with bounded suffix', () => {
  assert.equal(truncateTerminalText('a😀bc', 3), 'a😀…');
  assert.equal(truncateTerminalText('abc', 1, 'long'), 'l');
});
test('removes C0 and C1 control codes', () => {
  assert.equal(sanitizeTerminalText('a\u0000b\u009bc'), 'abc');
});
test('rejects invalid truncation limits and style names', () => {
  assert.throws(() => truncateTerminalText('x', -1), RangeError);
  assert.throws(() => styleTerminalText('x', 'blink'));
  assert.throws(() => styleTerminalText('x', '__proto__'));
});
