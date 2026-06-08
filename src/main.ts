import './style.scss'
import { Plugin, PluginSettings } from '@typora-community-plugin/core'
import { createI18n } from './i18n'
import { CollapsibleSettingTab } from './setting-tab'
import {
  HeadingLevelToggler,
  ListToggler,
  QuoteblockToggler,
  PlainQuoteblockToggler,
  CalloutToggler,
} from './features/section'
import { CodeblockToggler } from './features/codeblock'
import { TableToggler } from './features/table'


interface Settings {
  collapsableH1: boolean,
  collapsableH2: boolean,
  collapsableH3: boolean,
  collapsableH4: boolean,
  collapsableH5: boolean,
  collapsableH6: boolean,
  collapsableList: boolean,
  collapsablePlainQuoteblock: boolean,
  collapsableCallout: boolean,
  collapsableCodeblock: boolean,
  collapsableTable: boolean,
  collapsableCodeblockMode: 'none' | 'fold' | 'limit_height',
  autoFoldCodeblock: boolean,
  lineCountLimit: number,
  foldedCodeblockStyle: 'lang' | 'first_line',
  codeblockMaxHeight: string,
}

const DEFAULT_SETTINGS: Settings = {
  collapsableH1: true,
  collapsableH2: true,
  collapsableH3: true,
  collapsableH4: true,
  collapsableH5: true,
  collapsableH6: true,
  collapsableList: true,
  collapsablePlainQuoteblock: true,
  collapsableCallout: true,
  collapsableCodeblock: true,
  collapsableTable: true,
  collapsableCodeblockMode: 'none',
  autoFoldCodeblock: false,
  lineCountLimit: 10,
  foldedCodeblockStyle: 'lang',
  codeblockMaxHeight: '30vh',
}

export default class CollapsibleSectionPlugin extends Plugin<Settings> {

  i18n = createI18n()

  onload() {
    const { t } = this.i18n

    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)


    this.registerSettingTab(new CollapsibleSettingTab(this))


    const headingLevelTogglers = [1, 2, 3, 4, 5, 6].map(level => {
      const toggler = new HeadingLevelToggler(this, level)
      this.addChild(toggler)
      return toggler
    })

    const listToggler = new ListToggler(this)
    const quoteblockToggler = new QuoteblockToggler(this)
    const plainQuoteblockToggler = new PlainQuoteblockToggler(this)
    const calloutToggler = new CalloutToggler(this)

    this.addChild(listToggler)
    this.addChild(quoteblockToggler)
    this.addChild(plainQuoteblockToggler)
    this.addChild(calloutToggler)

    const codeblockToggler = new CodeblockToggler(this.app, this)
    const tableToggler = new TableToggler(this)

    this.addChild(codeblockToggler)
    this.addChild(tableToggler)

    // --- Global fold/unfold commands ---

    this.registerCommand({
      id: 'fold-all',
      title: t.foldAll,
      scope: 'editor',
      callback: () => {
        headingLevelTogglers.forEach(t => t.foldAll())
        listToggler.foldAll()
        quoteblockToggler.foldAll()
        plainQuoteblockToggler.foldAll()
        calloutToggler.foldAll()
        codeblockToggler.foldAll()
        tableToggler.foldAll()
      },
    })

    this.registerCommand({
      id: 'unfold-all',
      title: t.unfoldAll,
      scope: 'editor',
      callback: () => {
        headingLevelTogglers.forEach(t => t.unfoldAll())
        listToggler.unfoldAll()
        quoteblockToggler.unfoldAll()
        plainQuoteblockToggler.unfoldAll()
        calloutToggler.unfoldAll()
        codeblockToggler.unfoldAll()
        tableToggler.unfoldAll()
      },
    })

    this.registerCommand({
      id: 'fold-all-headings',
      title: t.foldAllHeadings,
      scope: 'editor',
      callback: () => headingLevelTogglers.forEach(t => t.foldAll()),
    })

    this.registerCommand({
      id: 'unfold-all-headings',
      title: t.unfoldAllHeadings,
      scope: 'editor',
      callback: () => headingLevelTogglers.forEach(t => t.unfoldAll()),
    })
  }
}
