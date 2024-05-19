import { Component, HtmlPostProcessor } from "@typora-community-plugin/core"
import type Plugin from "src/main"
import { editor } from "typora"


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
          // handle: heading
          '.md-heading:not(:empty)',
          // handle: list
          '.md-list-item>:first-child:not(:last-child)'
        ].join(','),
        process: makeCollapsible,
      }))

    plugin.registerCommand({
      id: 'fold-all',
      title: t.foldAll,
      scope: 'editor',
      callback: () => foldAll('', true),
    })

    plugin.registerCommand({
      id: 'unfold-all',
      title: t.unfoldAll,
      scope: 'editor',
      callback: () => foldAll('', false),
    })

    plugin.registerCommand({
      id: 'fold-all-headings',
      title: t.foldAllHeadings,
      scope: 'editor',
      callback: () => foldAll('.md-heading', true),
    })

    plugin.registerCommand({
      id: 'unfold-all-headings',
      title: t.unfoldAllHeadings,
      scope: 'editor',
      callback: () => foldAll('.md-heading', false),
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
}

function makeCollapsible(el: HTMLElement) {
  if (el.querySelector('.typ-collapsible-btn')) return

  const button = $(`<button class="typ-collapsible-btn" contenteditable="false" style="left: ${10 - clientOffset(el)}px;"><span class="fa fa-caret-down"></span></button>`)
    .on('click', toggleIcon)
    .on('click', toggleCollapse)
    .prependTo(el)
    .get(0)

  if (el.nextElementSibling?.classList.contains('typ-hidden')) {
    el.classList.add('typ-folded')
    toggleIcon.apply(button)
  }
}

function clientOffset(el: HTMLElement) {
  let result = 0;
  let parent = el;
  while (parent != editor.writingArea) {
    result += parent.offsetLeft;
    parent = parent.offsetParent as HTMLElement;
  }
  return result;
}

function toggleIcon() {
  $(this).find('.fa')
    .toggleClass('fa-caret-down')
    .toggleClass('fa-caret-right')
}

function toggleCollapse() {
  const heading = this.parentElement
  heading.classList.toggle('typ-folded')

  const states = [headingState(heading)]
  const brothers = $(`[cid=${heading.getAttribute('cid')}] ~ *`)

  for (let i = 0; i < brothers.length; i++) {
    const el = brothers[i]

    if (/^H[1-6]$/.test(el.tagName)) {
      const current = headingState(el)
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

      fold(el, states)

      states.push(current)

      continue
    }
    fold(el, states)
  }
}

type HeadingState = { level: number, isFolded: boolean }

function headingState(el: HTMLElement): HeadingState {
  return {
    level: +el.tagName[1],
    isFolded: el.classList.contains('typ-folded')
  }
}

function fold(el: HTMLElement, states: HeadingState[]) {
  el.classList.toggle('typ-hidden', states.some(s => s.isFolded))
}

function foldAll(typeSelector: string, state: boolean) {
  let stateCls = '.typ-folded'

  if (state) {
    // fold unfolded list
    stateCls = `:not(${stateCls})`
  }

  editor.writingArea.querySelectorAll(`${typeSelector}${stateCls} .typ-collapsible-btn`)
    .forEach((btn: HTMLElement) => btn.click())
}
