import { SettingTab } from "@typora-community-plugin/core"
import type Plugin from "./main"


export class CollapsibleSettingTab extends SettingTab {

  get name() {
    return 'Collapsible Section'
  }

  constructor(private plugin: Plugin) {
    super()

    this.render()
  }

  render() {
    const { plugin } = this
    const { t } = this.plugin.i18n

    this.addSetting(setting => {
      setting.addName(t.collapsibleCodeblockMode.name)

      setting.addDescription(el => {
        $(el).append(
          t.collapsibleCodeblockMode.desc
            .split('\n')
            .join('<br/>')
        )
      })

      setting.addSelect(el => {
        const opts = ['none', 'fold', 'limit_height']

        const selected = plugin.settings.get('collapsableCodeblockMode')
        const select = (opt: string) => opt === selected ? 'selected' : ''

        const options = opts.map(name => `<option ${select(name)}>${name}</option>`)

        $(el)
          .append(...options)
          .on('change', e => {
            plugin.settings.set(
              'collapsableCodeblockMode', $(e.target).val() as any
            )
          })
      })
    })

    this.addSetting(setting => {
      setting.addName(t.codeblockMaxHeight.name)
      setting.addDescription(t.codeblockMaxHeight.desc)
      setting.addText(el => {
        $(el)
          .val(plugin.settings.get('codeblockMaxHeight'))
          .on('change', e => {
            plugin.settings.set(
              'codeblockMaxHeight', $(e.target).val() as string
            )
          })
      })
    })

    this.addSetting(setting => {
      setting.addName(t.autoFoldCodeblock.name)
      setting.addDescription(t.autoFoldCodeblock.desc)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('autoFoldCodeblock')
        el.onclick = () => {
          plugin.settings.set('autoFoldCodeblock', el.checked)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.lineCountLimit.name)
      setting.addDescription(t.lineCountLimit.desc)
      setting.addInput('number', el => {
        el.value = plugin.settings.get('lineCountLimit') + ''
        el.onclick = () => {
          let count = +el.value
          if (isNaN(count)) {
            count = 10
            el.value = '10'
          }
          plugin.settings.set('lineCountLimit', count)
        }
      })
    })
  }

}
