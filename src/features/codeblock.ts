import { App, CodeblockPostProcessor, Component } from "@typora-community-plugin/core"
import { editor } from "typora"
import type Plugin from "src/main"


const CSS_VAR_MAX_HEIGHT = '--typ-codeblock-max-height'

export class CodeblockToggler extends Component {

  folder: Folder

  constructor(private app: App, private plugin: Plugin) {
    super()
  }

  onload() {
    const { plugin } = this
    const { settings } = plugin
    const { t } = plugin.i18n

    plugin.registerCommand({
      id: 'fold-all-codeblock',
      title: t.foldAllCodeblocks,
      scope: 'editor',
      callback: () => this.foldAll(),
    })

    plugin.registerCommand({
      id: 'unfold-all-codeblock',
      title: t.unfoldAllCodeblocks,
      scope: 'editor',
      callback: () => this.unfoldAll(),
    })

    const mode = settings.get('collapsableCodeblockMode')
    this._setup(mode)

    plugin.register(
      settings.onChange('collapsableCodeblockMode', (_, mode) => {
        this.unload()
        this._setup(mode)
      }))

    plugin.register(
      settings.onChange('codeblockMaxHeight', (_, height) => {
        this._setLimit(height)
      }))
  }

  _setup(mode: string) {
    if (mode === 'none') return

    this._makeCollapsible()

    if (mode === 'fold') {
      this.folder = new CodeHider(this)
    }
    else {
      this.folder = new Folder('typ-limited-code', 'typ-unlimited-code')
      this._setLimit(this.plugin.settings.get('codeblockMaxHeight'))
    }
  }

  _makeCollapsible() {
    const { i18n } = this.plugin
    const that = this

    this.register(
      this.app.workspace.activeEditor.postProcessor.register(
        CodeblockPostProcessor.from({
          button: {
            text: '<span class="fa fa-caret-up"></span>',
            title: i18n.t.codeblockFoldBtn,
            onclick(event, { codeblock }) {
              that._toggleButtonIcon(codeblock)

              if (that.folder.isFolded(codeblock))
                that.folder.unfold(codeblock)
              else
                that.folder.fold(codeblock)
            },
          },
          process(el) {
            if (el.classList.contains('typ-collapsible-code')) return

            this.renderButton(el, this.button)

            const code = editor.fences.getValue(el.getAttribute('cid')!)
            const hasCode = code.length
            if (!that.folder.isUnfolded(el) && hasCode) {
              that.folder.fold(el)
            }

            el.classList.add('typ-collapsible-code')
          }
        })
      ))
  }

  _setLimit(height: string) {
    document.body.style.setProperty(CSS_VAR_MAX_HEIGHT, height)
  }

  _toggleButtonIcon(el: HTMLElement) {
    $(el)
      .find('[class*="fa-caret-"]')
      .toggleClass('fa-caret-up fa-caret-down')
  }

  onunload() {
    document.body.style.removeProperty(CSS_VAR_MAX_HEIGHT)

    this.folder?.unfoldAll()

    $('.typ-collapsible-code').toggleClass('typ-collapsible-code')
  }

  foldAll() {
    this.folder?.foldAll()
  }

  unfoldAll() {
    this.folder?.unfoldAll()
  }
}

class Folder {

  constructor(private clsFolded: string, private clsUnfolded: string) { }

  foldAll(): void {
    editor.writingArea.querySelectorAll('pre')
      .forEach(el => this.fold(el))
  }

  unfoldAll(): void {
    editor.writingArea.querySelectorAll('pre')
      .forEach(el => this.unfold(el))
  }

  isFolded(el: HTMLElement): boolean {
    return el.classList.contains(this.clsFolded)
  }

  isUnfolded(el: HTMLElement): boolean {
    return el.classList.contains(this.clsUnfolded)
  }

  fold(el: HTMLElement): void {
    el.classList.add(this.clsFolded)
    el.classList.remove(this.clsUnfolded)
  }

  unfold(el: Element): void {
    el.classList.add(this.clsUnfolded)
    el.classList.remove(this.clsFolded)
  }
}

class CodeHider extends Folder {
  constructor(private toggler: CodeblockToggler) {
    super('typ-folded-code', 'typ-unfolded-code')
  }

  fold(el: HTMLElement): void {
    super.fold(el)

    // Click codeblock can unfold it.
    $(el).on('click', this._toggleButtonIcon as any)
  }

  _toggleButtonIcon = (event: MouseEvent) => {
    const el = event.target as HTMLElement
    this.toggler._toggleButtonIcon(el)
    super.unfold(el)
    $(el).off('click', this._toggleButtonIcon as any)
  }
}
