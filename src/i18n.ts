import { I18n } from '@typora-community-plugin/core'
import * as en from './locales/lang.en.json'

export function createI18n() {
  return new I18n<typeof en>({
    localePath: './locales'
  })
}
