import { editor } from "typora"


const SELECTORS = {
  heading: '.md-heading:not(:empty)',
  list: '.md-list-item>:first-child:not(:last-child)',
  quoteblock: '[mdtype="blockquote"]>p:first-child:not(:last-child)',
  plainQuoteblock: 'blockquote[mdtype="blockquote"]>p:first-child:not(:last-child)',
  callout: '.md-alert>p:first-child:not(:last-child)',
} as const

export { SELECTORS }


export function cleanupCollapsible(selector: string) {
  const wa = editor.writingArea

  wa.querySelectorAll(selector).forEach(el => {
    const btn = el.querySelector('.typ-collapsible-btn')
    if (!btn) return

    // Remove fold state
    el.classList.remove('typ-folded')

    // Reveal hidden siblings
    const cid = el.getAttribute('cid')
    if (cid) {
      $(`[cid=${cid}] ~ *`).removeClass('typ-hidden')
    }

    // Remove the button
    btn.remove()
  })
}


export function calcClientOffset(el: HTMLElement, root: HTMLElement): number {
  let result = 0
  let parent: HTMLElement | null = el
  while (parent && parent != root) {
    result += parent.offsetLeft
    parent = parent.offsetParent as HTMLElement
  }
  return result
}


export function toggleCaretIcon(e: JQuery.Event) {
  $(e.currentTarget).find('.fa')
    .toggleClass('fa-caret-down')
    .toggleClass('fa-caret-right')
}


export function createCollapsibleButton(el: HTMLElement, root: HTMLElement): HTMLElement | null {
  if (el.querySelector('.typ-collapsible-btn')) return null

  const offset = 10 - calcClientOffset(el, root)
  const $btn = $(`<button class="typ-collapsible-btn" contenteditable="false" style="left: ${offset}px;"><span class="fa fa-caret-down"></span></button>`)
    .prependTo(el)

  return $btn.get(0) ?? null
}


/**
 * Simple toggle: fold/unfold the element and all its following siblings.
 */
export function toggleSimpleCollapse(e: JQuery.Event) {
  const el = (e.currentTarget as HTMLElement).parentElement!
  const isFolded = el.classList.toggle('typ-folded')

  const brothers = $(`[cid=${el.getAttribute('cid')}] ~ *`)
  brothers.each((_, brother) => {
    ;(brother as HTMLElement).classList.toggle('typ-hidden', isFolded)
  })
}


export function foldAll(selector: string, state: boolean) {
  const stateCls = state ? ':not(.typ-folded)' : '.typ-folded'
  editor.writingArea.querySelectorAll(`${selector}${stateCls} .typ-collapsible-btn`)
    .forEach(btn => (btn as HTMLElement).click())
}
