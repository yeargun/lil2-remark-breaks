// The breaks corpus: line endings of every kind in every text context, plus the CommonMark corpus.
import {corpus as commonmark} from './commonmark-corpus.mjs'

const edges = ['a\nb', 'a\r\nb', 'a\rb', 'a\n\nb', 'a  \nb', 'a\\\nb', '*a\nb*', '[a\nb](c)', '# a', 'a\nb\nc\nd', '> a\n> b', '- a\n  b\n- c\n  d',
  '`a\nb`', '<b>a\nb</b>', 'a\n<b>\nc', '![a\nb](c)', '[a\nb]\n\n[a b]: d', 'a\n\n\nb\r\n\r\nc', '\ta\n\tb', 'a\n    b', '**a**\n**b**', 'line one\nline two  \nline three\\\nfour']

export function corpus() {
  return [...edges.map((markdown, i) => ({name: `edge ${i + 1}`, markdown})), ...commonmark()]
}
