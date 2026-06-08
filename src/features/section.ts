import { Component, format, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import { editor } from "typora"


const SELECTOR_HEADING = '.md-heading:not(:empty)'
const SELECTOR_LIST = '.md-list-item>:first-child:not(:last-child)'
const SELECTOR_QUOTEBLOCK = '[mdtype="blockquote"]>p:first-child:not(:last-child)'
const SELECTOR_PLAIN_QUOTEBLOCK = 'blockquote[mdtype="blockquote"]>p:first-child:not(:last-child)'
const SELECTOR_CALLOUT = '.md-alert>p:first-child:not(:last-child)'

type HeadingState = { level: number, isFolded: boolean }

export class SectionToggler extends Component {

  constructor(private plugin: Plugin) {
    super()
  }

  onload() {
    const { plugin } = this
    const { t } = this.plugin.i18n

    plugin.registerMarkdownPostProcessor(
      HtmlPostProcessor.from({
        selector: [
          SELECTOR_HEADING,
          SELECTOR_LIST,
          SELECTOR_QUOTEBLOCK,
        ].join(','),
        process: (el, { containerEl }) => this._makeCollapsible(el, containerEl),
      }))

    plugin.registerCommand({
      id: 'fold-all-headings',
      title: t.foldAllHeadings,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_HEADING, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-headings',
      title: t.unfoldAllHeadings,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_HEADING, false),
    })

    Array(6).fill(0).map((_, i) => `h${i + 1}`).forEach((hn, i) => {
      const level = i + 1

      plugin.registerCommand({
        id: 'fold-all-heading-' + level,
        title: format(t.foldAllHeadingN, [level]),
        scope: 'editor',
        callback: () => this._foldAll(hn + SELECTOR_HEADING, true),
      })

      plugin.registerCommand({
        id: 'unfold-all-heading-' + level,
        title: format(t.unfoldAllHeadingN, [level]),
        scope: 'editor',
        callback: () => this._foldAll(hn + SELECTOR_HEADING, false),
      })
    })

    plugin.registerCommand({
      id: 'fold-all-quoteblocks',
      title: t.foldAllQuoteBlocks,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_QUOTEBLOCK, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-quoteblocks',
      title: t.unfoldAllQuoteBlocks,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_QUOTEBLOCK, false),
    })

    plugin.registerCommand({
      id: 'fold-all-plain-quoteblocks',
      title: t.foldAllPlainQuoteBlocks,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_PLAIN_QUOTEBLOCK, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-plain-quoteblocks',
      title: t.unfoldAllPlainQuoteBlocks,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_PLAIN_QUOTEBLOCK, false),
    })

    plugin.registerCommand({
      id: 'fold-all-callouts',
      title: t.foldAllCallouts,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_CALLOUT, true),
    })

    plugin.registerCommand({
      id: 'unfold-all-callouts',
      title: t.unfoldAllCallouts,
      scope: 'editor',
      callback: () => this._foldAll(SELECTOR_CALLOUT, false),
    })
  }

  onunload() {
    editor.writingArea.querySelectorAll('.typ-hidden')
      .forEach(el => el.classList.remove('typ-hidden'))

    editor.writingArea.querySelectorAll('.typ-folded')
      .forEach(el => el.classList.remove('typ-folded'))

    editor.writingArea.querySelectorAll('.typ-collapsible-btn')
      .forEach(el => el.remove())
  }

  foldAll = (selector?: string) => this._foldAll(selector, true)

  unfoldAll = (selector?: string) => this._foldAll(selector, false)

  private _makeCollapsible(el: HTMLElement, root: HTMLElement) {
    if (el.querySelector('.typ-collapsible-btn')) return

    const offset = 10 - this._clientOffset(el, root)
    const button = $(`<button class="typ-collapsible-btn" contenteditable="false" style="left: ${offset}px;"><span class="fa fa-caret-down"></span></button>`)
      .on('click', e => this._toggleIcon(e))
      .on('click', e => this._toggleCollapse(e))
      .prependTo(el)
      .get(0)

    if (el.nextElementSibling?.classList.contains('typ-hidden')) {
      el.classList.add('typ-folded')
      this._toggleIcon({ currentTarget: button } as unknown as JQuery.Event)
    }
  }

  private _clientOffset(el: HTMLElement, root: HTMLElement) {
    let result = 0;
    let parent = el;
    while (parent && parent != root) {
      result += parent.offsetLeft;
      parent = parent.offsetParent as HTMLElement;
    }
    return result;
  }

  private _toggleIcon(e: JQuery.Event) {
    $(e.currentTarget).find('.fa')
      .toggleClass('fa-caret-down')
      .toggleClass('fa-caret-right')
  }

  private _toggleCollapse(e: JQuery.Event) {
    const heading = (e.currentTarget as HTMLElement).parentElement!
    heading.classList.toggle('typ-folded')

    const states = [this._headingState(heading)]
    const brothers = $(`[cid=${heading.getAttribute('cid')}] ~ *`)

    for (let i = 0; i < brothers.length; i++) {
      const el = brothers[i]

      if (/^H[1-6]$/.test(el.tagName)) {
        const current = this._headingState(el)
        if (current.level <= states[0].level) {
          // Unfold last empty line
          const prev = brothers[i - 1]
          if (prev.textContent === '') {
            prev.classList.remove('typ-hidden')
          }
          return
        }

        while (current.level <= states.at(-1)!.level)
          states.pop()

        this._fold(el, states)

        states.push(current)

        continue
      }
      this._fold(el, states)
    }
  }

  private _headingState(el: HTMLElement): HeadingState {
    return {
      level: +el.tagName[1],
      isFolded: el.classList.contains('typ-folded')
    }
  }

  private _fold(el: HTMLElement, states: HeadingState[]) {
    el.classList.toggle('typ-hidden', states.some(s => s.isFolded))
  }

  private _foldAll(typeSelector = '', state: boolean) {
    let stateCls = '.typ-folded'

    if (state) {
      // fold unfolded list
      stateCls = `:not(${stateCls})`
    }

    editor.writingArea.querySelectorAll(`${typeSelector}${stateCls} .typ-collapsible-btn`)
      .forEach(btn => (btn as HTMLElement).click())
  }
}
