type HeadingState = { level: number, isFolded: boolean }


function _headingState(el: HTMLElement): HeadingState {
  return {
    level: +el.tagName[1],
    isFolded: el.classList.contains('typ-folded')
  }
}


/**
 * Heading hierarchy-aware toggle: fold/unfold the clicked heading
 * and hide/show all following siblings up to the next same-or-higher-level heading.
 */
export function toggleHeadingCollapse(e: JQuery.Event) {
  const heading = (e.currentTarget as HTMLElement).parentElement!
  heading.classList.toggle('typ-folded')

  const states = [_headingState(heading)]
  const brothers = $(`[cid=${heading.getAttribute('cid')}] ~ *`)

  for (let i = 0; i < brothers.length; i++) {
    const el = brothers[i] as HTMLElement

    if (/^H[1-6]$/.test(el.tagName)) {
      const current = _headingState(el)
      if (current.level <= states[0].level) {
        // Unfold last empty line
        const prev = brothers[i - 1] as HTMLElement
        if (prev.textContent === '') {
          prev.classList.remove('typ-hidden')
        }
        return
      }

      while (current.level <= states.at(-1)!.level)
        states.pop()

      el.classList.toggle('typ-hidden', states.some(s => s.isFolded))

      states.push(current)

      continue
    }
    el.classList.toggle('typ-hidden', states.some(s => s.isFolded))
  }
}
