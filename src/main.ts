import './style.scss'
import { I18n, Plugin, PluginSettings } from '@typora-community-plugin/core'
import { SectionToggler } from './features/section'
import { CodeblockToggler } from './features/codeblock'
import { CollapsibleSettingTab } from './setting-tab'
import { TableToggler } from './features/table'


interface Settings {
  collapsableCodeblockMode: 'none' | 'fold' | 'limit_height',
  codeblockMaxHeight: string,
  autoFoldCodeblock: boolean,
  lineCountLimit: number,
}

const DEFAULT_SETTINGS: Settings = {
  collapsableCodeblockMode: 'none',
  codeblockMaxHeight: '30vh',
  autoFoldCodeblock: false,
  lineCountLimit: 10,
}

export default class CollapsibleSectionPlugin extends Plugin<Settings> {

  i18n = new I18n({
    resources: {
      'en': {
        foldAll: 'Fold all',
        unfoldAll: 'Unfold all',
        foldAllHeadings: 'Fold all headings',
        unfoldAllHeadings: 'Unfold all headings',
        foldAllTables: 'Fold all tables',
        unfoldAllTables: 'Unfold all tables',
        foldAllCodeblocks: 'Fold all codeblocks',
        unfoldAllCodeblocks: 'Unfold all codeblocks',

        collapsibleCodeblockMode: {
          name: 'Collapsible code block mode',
          desc: '- none: disable collapsible code block\n - fold: code blocks will be folded in one line\n - limit_height: code blocks will be limited to a certain height',
        },
        codeblockMaxHeight: {
          name: 'Code block max height',
          desc: 'Only works when mode `limit_height` is enabled',
        },
        autoFoldCodeblock: {
          name: 'Fold code block automatically',
          desc: 'Fold code block which line count is more than the limit. Only works when mode `fold` or `limit_height` is enabled.',
        },
        lineCountLimit: {
          name: 'Line count limit for auto fold',
          desc: 'The minimum line count of code block which can be folded automatically.',
        },
        codeblockFoldBtn: 'Fold/Unfold code block',

        tableFoldBtn: 'Toggle table',
      },
      'zh-cn': {
        foldAll: '折叠所有',
        unfoldAll: '展开所有',
        foldAllHeadings: '折叠所有标题',
        unfoldAllHeadings: '展开所有标题',
        foldAllTables: '折叠所有表格',
        unfoldAllTables: '展开所有表格',
        foldAllCodeblocks: '折叠所有代码块',
        unfoldAllCodeblocks: '展开所有代码块',

        collapsibleCodeblockMode: {
          name: '代码块折叠模式',
          desc: '- none: 禁用代码块折叠\n - fold: 折叠代码块到 1 行\n - limit_height: 限制代码块最大高度',
        },
        codeblockMaxHeight: {
          name: '代码块最大高度',
          desc: '仅在 `limit_height` 模式下生效',
        },
        autoFoldCodeblock: {
          name: '自动折叠代码块',
          desc: '当代码块行数超过限制时折叠代码块。仅在 `fold` 或 `limit_height` 模式下生效',
        },
        lineCountLimit: {
          name: '自动折叠行数限制',
          desc: '代码块行数大于或等于该限制时自动折叠',
        },
        codeblockFoldBtn: '折叠/展开代码块',

        tableFoldBtn: '折叠/展开表格',
      },
    }
  })

  onload() {
    const { t } = this.i18n

    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)


    this.registerSettingTab(new CollapsibleSettingTab(this))


    const sectionToggler = new SectionToggler(this)
    const codeblockToggler = new CodeblockToggler(this.app, this)
    const tableToggler = new TableToggler(this)

    this.addChild(sectionToggler)
    this.addChild(codeblockToggler)
    this.addChild(tableToggler)

    this.registerCommand({
      id: 'fold-all',
      title: t.foldAll,
      scope: 'editor',
      callback: () => {
        sectionToggler.foldAll('', true)
        codeblockToggler.foldAll()
        tableToggler.foldAll()
      },
    })

    this.registerCommand({
      id: 'unfold-all',
      title: t.unfoldAll,
      scope: 'editor',
      callback: () => {
        sectionToggler.foldAll('', false)
        codeblockToggler.unfoldAll()
        tableToggler.unfoldAll()
      },
    })
  }
}
