import { Component } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import { SELECTORS, foldAll, cleanupCollapsible } from "../shared"


export class QuoteblockToggler extends Component {

  constructor(private plugin: Plugin) {
    super()

    const { t } = this.plugin.i18n

    plugin.registerCommand({
      id: 'fold-all-quoteblocks',
      title: t.foldAllQuoteBlocks,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.quoteblock, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-quoteblocks',
      title: t.unfoldAllQuoteBlocks,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.quoteblock, false),
    })
  }

  onunload() {
    cleanupCollapsible(SELECTORS.quoteblock)
  }

  foldAll() {
    foldAll(SELECTORS.quoteblock, true)
  }

  unfoldAll() {
    foldAll(SELECTORS.quoteblock, false)
  }
}
