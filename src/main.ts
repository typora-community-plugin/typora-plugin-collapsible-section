import * as _ from "lodash"
import { HtmlPostProcessor, I18n, Plugin } from '@typora-community-plugin/core'
import { editor } from "typora"


type HeadingState = { level: number, isFolded: boolean }

export default class extends Plugin {

  i18n = new I18n({
    resources: {
      'en': {
        foldAllHeadings: 'Fold all headings',
        unfoldAllHeadings: 'Unfold all headings',
      },
      'zh-cn': {
        foldAllHeadings: '折叠所有标题',
        unfoldAllHeadings: '展开所有标题',
      },
    }
  })

  onload() {
    this.registerMarkdownPostProcessor(
      HtmlPostProcessor.from({
        selector: '.md-heading:not(:empty), .md-list-item>:first-child:not(:last-child)',
        process: makeCollapsible,
      }))

    this.registerCommand({
      id: 'fold-all-headings',
      title: this.i18n.t.foldAllHeadings,
      scope: 'editor',
      callback: () => {
        editor.writingArea.querySelectorAll(':not(.typ-folded) .typ-collapsible-btn')
          .forEach((btn: HTMLElement) => btn.click())
      }
    })

    this.registerCommand({
      id: 'unfold-all-headings',
      title: this.i18n.t.unfoldAllHeadings,
      scope: 'editor',
      callback: () => {
        editor.writingArea.querySelectorAll('.typ-folded .typ-collapsible-btn')
          .forEach((btn: HTMLElement) => btn.click())
      }
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

function headingState(el: HTMLElement): HeadingState {
  return {
    level: +el.tagName[1],
    isFolded: el.classList.contains('typ-folded')
  }
}

function fold(el: HTMLElement, states: HeadingState[]) {
  el.classList.toggle('typ-hidden', states.some(s => s.isFolded))
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
