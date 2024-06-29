import './style.scss'
import { I18n, Plugin, PluginSettings } from '@typora-community-plugin/core'
import { editor } from 'typora'
import { SectionToggler } from './features/section'
import { CodeblockToggler } from './features/codeblock'
import { CollapsibleSettingTab } from './setting-tab'
import { TableToggler } from './features/table'


interface Settings {
  collapsableCodeblockMode: 'none' | 'fold' | 'limit_height',
  codeblockMaxHeight: string,
}

const DEFAULT_SETTINGS: Settings = {
  collapsableCodeblockMode: 'none',
  codeblockMaxHeight: '30vh',
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

        collapsibleCodeblockMode: {
          name: 'Collapsible code block mode',
          desc: '- none: no code block will be collapsible\n - fold: code blocks will be folded in one line\n - limit_height: code blocks will be limited to a maximum height',
        },
        codeblockMaxHeight: {
          name: 'Code block max height',
          desc: 'Only works when mode `limit_height` is enabled',
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

        collapsibleCodeblockMode: {
          name: '使用可折叠代码块',
          desc: '- none: 不会折叠任何代码块\n - fold: 折叠所有代码块\n - limit_height: 代码块限制最大高度',
        },
        codeblockMaxHeight: {
          name: '代码块最大高度',
          desc: '仅在 `limit_height` 模式下生效',
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
