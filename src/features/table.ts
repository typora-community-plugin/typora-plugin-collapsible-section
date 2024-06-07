import { editor } from "typora"
import { Component, decorate } from "@typora-community-plugin/core"
import type CollapsibleSectionPlugin from "src/main"


export class TableToggler extends Component {

  constructor(private plugin: CollapsibleSectionPlugin) {
    super()
  }

  onload() {
    const { t } = this.plugin.i18n

    this.register(
      decorate.afterCall(editor.tableEdit, 'showTableEdit', ([figure]) => {
        const klass = figure.hasClass('typ-folded-table')
          ? 'fa-caret-down'
          : 'fa-caret-up'

        figure
          .find('.ty-table-edit')
          .append(
            `<span class="md-th-button right-th-button"><button type="button" class="btn btn-default typ-collapsable-table-btn" ty-hint="${t.tableFoldBtn}" aria-label="${t.tableFoldBtn}"><span class="fa ${klass}"></span></button></span>`
          )
      })
    )

    this.registerDomEvent(editor.writingArea, 'click', (event) => {
      const el = event.target as HTMLElement
      if (!el.closest('.typ-collapsable-table-btn')) return

      $(el)
        .find('[class*="fa-caret-"]')
        .toggleClass('fa-caret-up fa-caret-down')
        .end()
        .closest('figure')
        .toggleClass('typ-folded-table')
    })
  }

  foldAll() {
    $('.md-table-fig', editor.writingArea)
      .addClass('typ-folded-table')
  }

  unfoldAll() {
    $('.md-table-fig', editor.writingArea)
      .removeClass('typ-folded-table')
  }
}
