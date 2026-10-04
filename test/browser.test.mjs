// The browser build (the `browser` condition) in real browsers: same mdast and hast as upstream remark-breaks.
import assert from 'node:assert/strict'
import {test} from 'node:test'
import {toHast} from 'mdast-util-to-hast'
import {browsers, inBrowser} from './browser.mjs'
import {corpus} from './corpus.mjs'
import * as mdastRows from './rows-mdast.mjs'
import * as hastRows from './rows-hast.mjs'
import {upstream} from './differential.test.mjs'
const artifact = new URL(process.env.LIL2_BROWSER_ARTIFACT ?? '../dist/browser/remark-breaks.js', import.meta.url)
const cases = corpus()

for (const name of browsers) {
  test(`browser build in ${name}: mdast and hast equal upstream`, async () => {
    const out = await inBrowser(name, artifact, (lib, markdowns) => ({
      propNames: lib.propNames, keywordNames: lib.keywordNames,
      trees: markdowns.map(m => [lib.fromMarkdown(m), lib.markdownToHast(m, false)])
    }), cases.map(c => c.markdown))
    const failures = []
    cases.forEach((c, i) => {
      try {
        assert.deepStrictEqual(mdastRows.fromColumns(out.trees[i][0]), mdastRows.fromObjects(upstream(c.markdown)))
        assert.deepStrictEqual(hastRows.fromColumns(out.trees[i][1], out.propNames, out.keywordNames), hastRows.fromObjects(toHast(upstream(c.markdown))))
      } catch (error) {
        failures.push({name: c.name, error: String(error.message).slice(0, 500)})
      }
    })
    if (failures.length) console.log(JSON.stringify({failures: failures.length, first: failures.slice(0, 3)}, null, 1))
    assert.equal(failures.length, 0)
  })
}
