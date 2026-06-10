# Typora Plugin Collapsible Section

English | [简体中文](./README.zh-CN.md)

This a plugin based on [typora-community-plugin][core] for [Typora](https://typora.io).

Fold/unfold markdown section:

- [x] Heading
- [x] Nested list
- [x] Codeblock
- [x] Table
- [x] Quoteblock
  - [x] Callout

## Preview

| **Headings**                         | **List**                                     |
| :----------------------------------: | :------------------------------------------: |
| ![](./docs/assets/headings.gif)      | ![](./docs/assets/list.gif)                  |
| **Codeblock (mode=fold,style=lang)** | **Codeblock (mode=fold,style=first_line)**   |
| ![](./docs/assets/codeblock.gif)     | ![](./docs/assets/codeblock2.gif)            |
| **Codeblock (mode=limit_height)**    | **Table**                                    |
| ![](./docs/assets/codeblock3.gif)    | ![](./docs/assets/table.gif)                 |
| **Quoteblock**                       | **Callout**                                  |
| ![](./docs/assets/quoteblock.gif)    | ![](./docs/assets/callout.gif)               |


## Settings

- **Global toggle**: Enable or disable all collapsible section features with a single checkbox.
- **File scoping with Glob**: Restrict the plugin to specific files using glob expressions (e.g., `docs/**/*.md`). Supports wildcards (`*`, `**`, `?`), character classes (`[abc]`), and alternation (`{a,b}`). Leave empty to apply to all files.
- **Per-file control via FrontMatter**: Use `collapsableSections` and `uncollapsableSections` keys in YAML frontmatter to enable or disable specific section types ("h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "list" | "codeblock" | "table" | "plain_quote_block" | "callout") on a per-file basis. For example:
  ```yaml
  collapsableSections: [h1, h2, h3]
  ```
  Or:
  ```yaml
  uncollapsableSections:
  - h4
  - h5
  - h6
  ```

## Install

1. Install [typora-community-plugin][core]
2. Open "Settings -> Plugin Marketplace" search "Collapsible Section" then install it.



[core]: https://github.com/typora-community-plugin/typora-community-plugin
