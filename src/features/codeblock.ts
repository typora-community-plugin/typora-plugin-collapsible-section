import { App, CodeblockPostProcessor, Component } from "@typora-community-plugin/core"
import { editor } from "typora"
import type Plugin from "src/main"


export class CodeblockToggler extends Component {

  constructor(private app: App, private plugin: Plugin) {
    super()
  }

  onload() {
    const { settings } = this.plugin

    if (settings.get('collapsableCodeblockMode') !== 'none') {
      this.makeCollapsible()
    }

    this.plugin.register(
      settings.onChange('collapsableCodeblockMode', (_, mode) => {
        this.unload()

        if (mode !== 'none') {
          this.makeCollapsible()
        }
      }))
  }

  makeCollapsible() {
    const { settings, i18n } = this.plugin
    const toggler = this

    this.register(
      this.app.workspace.activeEditor.postProcessor.register(
        CodeblockPostProcessor.from({
          button: {
            text: '<span class="fa fa-caret-up"></span>',
            title: i18n.t.codeblockFoldBtn,
            onclick(event, { codeblock }) {
              toggler.toggleButtonIcon(codeblock)

              if (settings.get('collapsableCodeblockMode') === 'fold') {
                if (codeblock.classList.contains('typ-folded-code'))
                  toggler.unfold(codeblock)
                else
                  toggler.fold(codeblock)
              }
              else {
                if (codeblock.classList.contains('typ-limited-code'))
                  toggler.unlimitMaxHeight(codeblock)
                else
                  toggler.limitMaxHeight(codeblock)
              }
            },
          },
          process(el) {
            if (el.classList.contains('typ-collapsible-code')) return

            this.renderButton(el, this.button)

            if (settings.get('collapsableCodeblockMode') === 'fold')
              toggler.fold(el)
            else
              toggler.limitMaxHeight(el)

            el.classList.add('typ-collapsible-code')
          }
        })
      ))
  }

  onunload() {
    this.unfoldAll()
    this.unlimitMaxHeightAll()

    $('.typ-collapsible-code').toggleClass('typ-collapsible-code')
  }

  toggleButtonIcon(el: HTMLElement) {
    $(el)
      .find('[class*="fa-caret-"]')
      .toggleClass('fa-caret-up fa-caret-down')
  }

  fold(el: HTMLElement) {
    $(el)
      .addClass('typ-folded-code')
      .on('click', this.onClickToUnfold as any)
  }

  unfold(el: Element) {
    $(el)
      .removeClass('typ-folded-code')
      .off('click', this.onClickToUnfold as any)
  }

  onClickToUnfold = (event: MouseEvent) => {
    const el = (<HTMLElement>event.target)
    el.classList.remove('typ-folded-code')
    this.toggleButtonIcon(el)
  }

  unfoldAll() {
    editor.writingArea.querySelectorAll('.typ-folded-code')
      .forEach(el => this.unfold(el))
  }

  limitMaxHeight(el: HTMLElement) {
    (el.querySelector('.CodeMirror-scroll') as HTMLElement)
      .style.maxHeight = this.plugin.settings.get('codeblockMaxHeight')

    el.classList.add('typ-limited-code')
  }

  unlimitMaxHeight(el: Element) {
    (el.querySelector('.CodeMirror-scroll') as HTMLElement)
      .style.maxHeight = 'unset'

    el.classList.remove('typ-limited-code')
  }

  unlimitMaxHeightAll() {
    editor.writingArea.querySelectorAll('.typ-limited-code')
      .forEach(el => this.unlimitMaxHeight(el))
  }

}
