import './style.scss'
import { Notice, app, path, Plugin, PluginSettings } from '@typora-community-plugin/core'
import { Settings, DEFAULT_SETTINGS } from './settings'
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


let _metadataWarningShown = false

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

  /**
   * Check if a foldable section type is permitted for a file via frontmatter.
   * @param filePath       - The path to check against the metadata cache.
   * @param sectionType    - A single section type.
   * @returns true when no frontmatter config exists at all (opt-in: all types are permitted).
   */
  isSectionPermitted(filePath: string, sectionType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'list' | 'codeblock' | 'table' | 'plain_quote_block' | 'callout'): boolean {
    if (!filePath) return true

    const relativePath = path.isAbsolute(filePath) ? path.relative(app.vault.path, filePath) : filePath
    const entry = app.metadata?.cache[relativePath]
    if (!entry || typeof entry !== 'object') {
      if (!_metadataWarningShown && !app.internalPlugins.enabledPlugins['internal.metadata']) {
        _metadataWarningShown = true
        Notice.warning('[Collapsible Section]<br>' + this.i18n.t.metadataWarningDesc, 0)
        return true
      }
      return true
    }

    const fm = entry?.metadata?.frontmatter
    if (!fm) return true

    const uncollapsable = fm.uncollapsableSections
    if (Array.isArray(uncollapsable)) {
      return !uncollapsable.includes(sectionType)
    }

    if (!Array.isArray(fm.collapsableSections)) return true
    return fm.collapsableSections.includes(sectionType)
  }
}
