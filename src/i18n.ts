import { I18n } from '@typora-community-plugin/core'

export const i18nResources = {
  'en': {
    foldAll: 'Fold all',
    unfoldAll: 'Unfold all',
    foldAllHeadings: 'Fold all headings',
    unfoldAllHeadings: 'Unfold all headings',
    foldAllHeadingN: 'Fold all H{0}',
    unfoldAllHeadingN: 'Unfold all H{0}',
    foldAllTables: 'Fold all tables',
    unfoldAllTables: 'Unfold all tables',
    foldAllQuoteBlocks: 'Fold all quoteblocks & callouts',
    unfoldAllQuoteBlocks: 'Unfold all quoteblocks & callouts',
    foldAllPlainQuoteBlocks: 'Fold all quoteblocks',
    unfoldAllPlainQuoteBlocks: 'Unfold all quoteblocks',
    foldAllCallouts: 'Fold all callouts',
    unfoldAllCallouts: 'Unfold all callouts',
    foldAllCodeblocks: 'Fold all codeblocks',
    unfoldAllCodeblocks: 'Unfold all codeblocks',

    featuresDesc: '1. Toggle checkbox to enable or disable all collapsible section features globally;\n2. Glob expressions (e.g., `docs/**/*.md`) to limit which files enable this feature. Supported syntax: `*` (any chars except `/`), `**` (any path), `?` (one char), `[abc]` (char class), `{a,b}` (alternation). Leave empty for all files;\n3. Allow per-file control via frontmatter properties `collapsableSections` and `uncollapsableSections`. Supported values: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "list" | "codeblock" | "table" | "plain_quote_block" | "callout".',
    collapsableH1: 'Enable H1 folding',
    collapsableH2: 'Enable H2 folding',
    collapsableH3: 'Enable H3 folding',
    collapsableH4: 'Enable H4 folding',
    collapsableH5: 'Enable H5 folding',
    collapsableH6: 'Enable H6 folding',
    collapsableList: 'Enable list folding',
    collapsablePlainQuoteblock: 'Enable plain quoteblock folding',
    collapsableCallout: 'Enable callout folding',
    collapsableCodeblock: {
      name: 'Enable code block folding',
      desc: 'Support configuring the fold mode.',
    },
    collapsableTable: {
      name: 'Enable table folding',
      desc: 'Allow tables to be folded/unfolded via the toggle button in the table edit toolbar.',
    },
    collapsibleCodeblockMode: {
      name: 'Collapsible code block mode',
      desc: '- none: disable collapsible code block\n - fold: code blocks will be folded in one line\n - limit_height: code blocks will be limited to a certain height',
    },
    autoFoldCodeblock: {
      name: 'Fold code block automatically',
      desc: 'Fold code block which line count is more than the limit. Only works when mode `fold` or `limit_height` is enabled.',
    },
    lineCountLimit: {
      name: 'Line count limit for auto fold',
      desc: 'The minimum line count of code block which can be folded automatically.',
    },
    foldedCodeblockStyle: {
      name: 'Folded codeblock style',
      desc: 'Only works when mode `fold` is enabled',
    },
    codeblockMaxHeight: {
      name: 'Code block max height',
      desc: 'Only works when mode `limit_height` is enabled',
    },
    codeblockFoldBtn: 'Fold/Unfold code block',

    tableFoldBtn: 'Toggle table',

    metadataWarningDesc: "'metadata' internal plugin is disabled. Frontmatter-based `collapsableSections`/`uncollapsableSections` rules will no longer take effect.",
  },
  'zh-cn': {
    foldAll: '折叠所有',
    unfoldAll: '展开所有',
    foldAllHeadings: '折叠所有标题',
    unfoldAllHeadings: '展开所有标题',
    foldAllHeadingN: '折叠所有 H{0} 标题',
    unfoldAllHeadingN: '展开所有 H{0} 标题',
    foldAllTables: '折叠所有表格',
    unfoldAllTables: '展开所有表格',
    foldAllQuoteBlocks: '折叠所有引用块和标注块',
    unfoldAllQuoteBlocks: '展开所有引用块和标注块',
    foldAllPlainQuoteBlocks: '折叠所有引用块',
    unfoldAllPlainQuoteBlocks: '展开所有引用块',
    foldAllCallouts: '折叠所有标注块',
    unfoldAllCallouts: '展开所有标注块',
    foldAllCodeblocks: '折叠所有代码块',
    unfoldAllCodeblocks: '展开所有代码块',

    featuresDesc: '1. 切换复选框以全局启用或禁用所有可折叠区域功能；\n2. Glob 表达式（例如 `docs/**/*.md`）限制启用此功能的文件。支持语法：`*`（匹配 `/` 外的任意字符）、`**`（匹配任意路径）、`?`（单个字符）、`[abc]`（字符集）、`{a,b}`（多选一）。留空表示所有文件；\n3. 允许通过 FrontMatter 属性 `collapsableSections` 和 `uncollapsableSections` 进行逐文件控制。支持的值："h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "list" | "codeblock" | "table" | "plain_quote_block" | "callout"。',
    collapsableH1: '启用 H1 标题折叠',
    collapsableH2: '启用 H2 标题折叠',
    collapsableH3: '启用 H3 标题折叠',
    collapsableH4: '启用 H4 标题折叠',
    collapsableH5: '启用 H5 标题折叠',
    collapsableH6: '启用 H6 标题折叠',
    collapsableList: '启用列表折叠',
    collapsablePlainQuoteblock: '启用纯引用块折叠',
    collapsableCallout: '启用标注块折叠',
    collapsableCodeblock: {
      name: '启用代码块折叠',
      desc: '支持配置折叠模式',
    },
    collapsableTable: {
      name: '启表格折叠',
      desc: '允许通过表编辑工具栏中的切换按钮折叠/展开表格。',
    },
    collapsibleCodeblockMode: {
      name: '代码块折叠模式',
      desc: '- none: 禁用代码块折叠\n - fold: 折叠代码块到 1 行\n - limit_height: 限制代码块最大高度',
    },
    autoFoldCodeblock: {
      name: '自动折叠代码块',
      desc: '当代码块行数超过限制时折叠代码块。仅在 `fold` 或 `limit_height` 模式下生效',
    },
    lineCountLimit: {
      name: '自动折叠行数限制',
      desc: '代码块行数大于或等于该限制时自动折叠',
    },
    foldedCodeblockStyle: {
      name: '折叠代码块样式',
      desc: '仅在 `fold` 模式下生效',
    },
    codeblockMaxHeight: {
      name: '代码块最大高度',
      desc: '仅在 `limit_height` 模式下生效',
    },
    codeblockFoldBtn: '折叠/展开代码块',

    tableFoldBtn: '折叠/展开表格',

    metadataWarningDesc: '内部插件`元数据`已禁用。基于 FrontMatter 的 `collapsableSections`/`  uncollapsableSections` 规则将不再生效。',
  },
}

export function createI18n() {
  return new I18n({ resources: i18nResources })
}
