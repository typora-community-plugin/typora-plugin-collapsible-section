import { app, Component, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import {
  SELECTORS, createCollapsibleButton, toggleCaretIcon, toggleSimpleCollapse, foldAll, cleanupCollapsible,
} from "./shared"
import { matchesGlob } from "src/utils"


export class ListToggler extends Component {

  constructor(private plugin: Plugin) {
    super()

    plugin.register(
      plugin.settings.onChange('collapsableList', (_, isEnabled) => {
        isEnabled ? this.load() : this.unload()
      }))
  }

  load() {
    if (!this.plugin.settings.get('collapsableList')) return
    super.load()
  }

  onload() {
    this.register(
      app.features.markdownEditor.postProcessor.register(
        HtmlPostProcessor.from({
          selector: SELECTORS.list,
          process: (el, { containerEl }) => {
            const filePath = app.workspace.activeFile
            if (!matchesGlob(filePath, this.plugin.settings.get('globList'))) return
            if (!this.plugin.isSectionPermitted(filePath, 'list')) return
            this._makeCollapsible(el, containerEl)
          },
        })))
  }

  onunload() {
    cleanupCollapsible(SELECTORS.list)
  }

  foldAll() {
    foldAll(SELECTORS.list, true)
  }

  unfoldAll() {
    foldAll(SELECTORS.list, false)
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
