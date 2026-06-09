import { editor } from "typora"
import { app, Component, decorate } from "@typora-community-plugin/core"
import type CollapsibleSectionPlugin from "src/main"
import { matchesGlob } from "src/utils"


export class TableToggler extends Component {

  constructor(private plugin: CollapsibleSectionPlugin) {
    super()

    const { t } = plugin.i18n

    plugin.registerCommand({
      id: 'fold-all-table',
      title: t.foldAllTables,
      scope: 'editor',
      callback: () => this.foldAll(),
    })

    plugin.registerCommand({
      id: 'unfold-all-table',
      title: t.unfoldAllTables,
      scope: 'editor',
      callback: () => this.unfoldAll(),
    })

    this.plugin.register(
      this.plugin.settings.onChange('collapsableTable', (_, isEnabled) => {
        isEnabled ? this.load() : this.unload()
      }))
  }

  load() {
    if (!this.plugin.settings.get('collapsableTable')) return
    super.load()
  }

  onload() {
    const { t } = this.plugin.i18n

    this.register(
      decorate.afterCall(editor.tableEdit, 'showTableEdit', ([figure]) => {
        if (!figure || !figure.jquery) return

        const filePath = app.workspace.activeFile
        if (!matchesGlob(filePath, this.plugin.settings.get('globTable'))) return
        if (!this.plugin.isSectionPermitted(filePath, 'table')) return

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
