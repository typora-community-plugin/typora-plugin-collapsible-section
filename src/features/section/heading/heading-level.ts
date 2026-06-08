import { app, Component, format, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import {
  createCollapsibleButton, toggleCaretIcon, foldAll, cleanupCollapsible,
} from "../shared"
import { toggleHeadingCollapse } from "./shared"


type HeadingSettingKey = `collapsableH${1 | 2 | 3 | 4 | 5 | 6}`


export class HeadingLevelToggler extends Component {

  readonly level: number
  readonly selector: string
  private readonly settingKey: HeadingSettingKey

  constructor(private plugin: Plugin, level: number) {
    super()

    this.level = level
    this.selector = `h${level}.md-heading:not(:empty)`
    this.settingKey = `collapsableH${level}` as HeadingSettingKey

    const { t } = plugin.i18n

    plugin.registerCommand({
      id: `fold-all-heading-${this.level}`,
      title: format(t.foldAllHeadingN, [this.level]),
      scope: 'editor',
      callback: () => foldAll(this.selector, true),
    })

    plugin.registerCommand({
      id: `unfold-all-heading-${this.level}`,
      title: format(t.unfoldAllHeadingN, [this.level]),
      scope: 'editor',
      callback: () => foldAll(this.selector, false),
    })

    plugin.register(
      plugin.settings.onChange(this.settingKey, (_, isEnabled) => {
        isEnabled ? this.load() : this.unload()
      }))
  }

  load() {
    if (!this.plugin.settings.get(this.settingKey)) return
    super.load()
  }

  onload() {
    this.register(
      app.features.markdownEditor.postProcessor.register(
        HtmlPostProcessor.from({
          selector: this.selector,
          process: (el, { containerEl }) => this._makeCollapsible(el, containerEl),
        })))
  }

  onunload() {
    cleanupCollapsible(this.selector)
  }

  foldAll = () => foldAll(this.selector, true)

  unfoldAll = () => foldAll(this.selector, false)

  _makeCollapsible(el: HTMLElement, root: HTMLElement) {
    const btn = createCollapsibleButton(el, root)
    if (!btn) return

    $(btn).on('click', (e) => {
      toggleCaretIcon(e)
      toggleHeadingCollapse(e)
    })

    if (el.nextElementSibling?.classList.contains('typ-hidden')) {
      el.classList.add('typ-folded')
      toggleCaretIcon({ currentTarget: btn } as unknown as JQuery.Event)
    }
  }
}
