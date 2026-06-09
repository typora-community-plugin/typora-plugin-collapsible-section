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
      setting.addTitle('Features')
      setting.addDescription(t.featuresDesc)
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH1)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH1')
        el.onclick = () => {
          plugin.settings.set('collapsableH1', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH1')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH1', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH2)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH2')
        el.onclick = () => {
          plugin.settings.set('collapsableH2', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH2')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH2', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH3)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH3')
        el.onclick = () => {
          plugin.settings.set('collapsableH3', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH3')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH3', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH4)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH4')
        el.onclick = () => {
          plugin.settings.set('collapsableH4', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH4')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH4', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH5)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH5')
        el.onclick = () => {
          plugin.settings.set('collapsableH5', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH5')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH5', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableH6)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableH6')
        el.onclick = () => {
          plugin.settings.set('collapsableH6', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globH6')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globH6', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableList)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableList')
        el.onclick = () => {
          plugin.settings.set('collapsableList', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globList')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globList', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsablePlainQuoteblock)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsablePlainQuoteblock')
        el.onclick = () => {
          plugin.settings.set('collapsablePlainQuoteblock', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globPlainQuoteblock')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globPlainQuoteblock', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableCallout)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableCallout')
        el.onclick = () => {
          plugin.settings.set('collapsableCallout', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globCallout')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globCallout', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableCodeblock.name)
      setting.addDescription(t.collapsableCodeblock.desc)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableCodeblock')
        el.onclick = () => {
          plugin.settings.set('collapsableCodeblock', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globCodeblock')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globCodeblock', el.value)
        }
      })
    })

    this.addSetting(setting => {
      setting.addName(t.collapsableTable.name)
      setting.addDescription(t.collapsableTable.desc)
      setting.addCheckbox(el => {
        el.checked = plugin.settings.get('collapsableTable')
        el.onclick = () => {
          plugin.settings.set('collapsableTable', el.checked)
        }
      })
      setting.addInput('text', el => {
        el.value = plugin.settings.get('globTable')
        el.placeholder = 'glob'
        el.oninput = () => {
          plugin.settings.set('globTable', el.value)
        }
      })
    })

    this.addSettingTitle('Codeblock')

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

    this.addSettingTitle('Codeblock mode: fold')

    this.addSetting(setting => {
      setting.addName(t.foldedCodeblockStyle.name)

      setting.addDescription(el => {
        $(el).append(
          t.foldedCodeblockStyle.desc
            .split('\n')
            .join('<br/>')
        )
      })

      setting.addSelect(el => {
        const opts = ['lang', 'first_line']

        const selected = plugin.settings.get('foldedCodeblockStyle')
        const select = (opt: string) => opt === selected ? 'selected' : ''

        const options = opts.map(name => `<option ${select(name)}>${name}</option>`)

        $(el)
          .append(...options)
          .on('change', e => {
            plugin.settings.set(
              'foldedCodeblockStyle', $(e.target).val() as any
            )
          })
      })
    })

    this.addSettingTitle('Codeblock mode: limit_height')
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
  }

}
