import { app, Component, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import { SELECTORS, createCollapsibleButton, toggleCaretIcon, toggleSimpleCollapse, foldAll, cleanupCollapsible } from "../shared"


export class PlainQuoteblockToggler extends Component {

  constructor(private plugin: Plugin) {
    super()

    const { t } = plugin.i18n

    plugin.registerCommand({
      id: 'fold-all-plain-quoteblocks',
      title: t.foldAllPlainQuoteBlocks,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.plainQuoteblock, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-plain-quoteblocks',
      title: t.unfoldAllPlainQuoteBlocks,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.plainQuoteblock, false),
    })

    plugin.register(
      plugin.settings.onChange('collapsablePlainQuoteblock', (_, isEnabled) => {
        isEnabled ? this.load() : this.unload()
      }))
  }

  load() {
    if (!this.plugin.settings.get('collapsablePlainQuoteblock')) return
    super.load()
  }

  onload() {
    this.register(
      app.features.markdownEditor.postProcessor.register(
        HtmlPostProcessor.from({
          selector: SELECTORS.plainQuoteblock,
          process: (el, { containerEl }) => this._makeCollapsible(el, containerEl),
        })))
  }

  onunload() {
    cleanupCollapsible(SELECTORS.plainQuoteblock)
  }

  foldAll() {
    foldAll(SELECTORS.plainQuoteblock, true)
  }

  unfoldAll() {
    foldAll(SELECTORS.plainQuoteblock, false)
  }

  private _makeCollapsible(el: HTMLElement, root: HTMLElement) {
    const btn = createCollapsibleButton(el, root)
    if (!btn) return

    $(btn).on('click', (e) => {
      toggleCaretIcon(e)
      toggleSimpleCollapse(e)
    })

    if (el.nextElementSibling?.classList.contains('typ-hidden')) {
      el.classList.add('typ-folded')
      toggleCaretIcon({ currentTarget: btn } as unknown as JQuery.Event)
    }
  }
}
