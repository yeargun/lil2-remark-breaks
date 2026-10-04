# lil2-remark-breaks

[remark-breaks](https://github.com/remarkjs/remark-breaks) 4.0.0 rewritten in typed [LilScript](https://lilscript.eddocu.com):
every line ending in text becomes a hard break (`<br>`), on the flat **lil2** pipeline, with the same trees as
upstream.

The transform walks the mdast arena's text nodes and splits them at `\r\n`, `\n` and `\r` into text and `break`
nodes (int kinds, no position, as upstream's find-and-replace leaves them). Inside the family it is compiled into
[lil2-react-markdown](https://github.com/yeargun/lil2-react-markdown)'s `full` flavor.

```js
import {fromMarkdown, markdownToHast} from '@itslil/lil2-remark-breaks'

markdownToHast('one\ntwo', false) // hast columns: p > ["one", br, "\n", "two"]
```

## Behaviour

`test/differential.test.mjs` compares the mdast and the hast with upstream's (`newlineToBreak(fromMarkdown(md))`)
as rows of indexed arrays on line-ending edge cases and the CommonMark corpus; `test/browser.test.mjs` runs the
browser build in Chromium and Firefox. All are equal.

## License

MIT; see NOTICE.md.
