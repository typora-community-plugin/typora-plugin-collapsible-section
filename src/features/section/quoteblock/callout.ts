import { app, Component, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import { SELECTORS, createCollapsibleButton, toggleCaretIcon, toggleSimpleCollapse, foldAll, cleanupCollapsible } from "../shared"
import { matchesGlob } from "src/utils"


export class CalloutToggler extends Component {

  constructor(private plugin: Plugin) {
    super()

    const { t } = plugin.i18n

    plugin.registerCommand({
      id: 'fold-all-callouts',
      title: t.foldAllCallouts,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.callout, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-callouts',
      title: t.unfoldAllCallouts,
      scope: 'editor',
      callback: () => foldAll(SELECTORS.callout, false),
    })

    plugin.register(
      plugin.settings.onChange('collapsableCallout', (_, isEnabled) => {
        isEnabled ? this.load() : this.unload()
      }))
  }

  load() {
    if (!this.plugin.settings.get('collapsableCallout')) return
    super.load()
  }

  onload() {
    this.register(
      app.features.markdownEditor.postProcessor.register(
        HtmlPostProcessor.from({
          selector: SELECTORS.callout,
          process: (el, { containerEl }) => {
            const filePath = app.workspace.activeFile
            if (!matchesGlob(filePath, this.plugin.settings.get('globCallout'))) return
            if (!this.plugin.isSectionPermitted(filePath, 'callout')) return
            this._makeCollapsible(el, containerEl)
          },
        })))
  }

  onunload() {
    cleanupCollapsible(SELECTORS.callout)
  }

  foldAll() {
    foldAll(SELECTORS.callout, true)
  }

  unfoldAll() {
    foldAll(SELECTORS.callout, false)
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
