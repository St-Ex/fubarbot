import bot from '../bot'
import Config, { reset as configReset } from '../Config'
import Stores, { reset } from '../Stores'
import Help from './Help'

const RESET_CONFIG = 'config'
const RESET_GAME = 'game'
const CLEAN_CONFIRMED = 'confirmed'

class Admin extends Help {

  helps () {
    let h = super.helps()
    h['clean'] = 'Clean all Character without channel'
    h['c(onfig)'] = 'Prints configuration'
    h['reset'] = 'Resets full game'
    h['e(nable)'] = 'Enables configuration'
    h['d(isable)'] = 'Disables configuration'
    return h
  }

  /**
   * @return {{embed}}
   */
  c () { return this.config()}

  /**
   * @return {{embed}}
   */
  d () { return this.disable()}

  /**
   * @return {{embed}}
   */
  e () { return this.enable()}

  clean () {
    let blank_run = this.message.content !== CLEAN_CONFIRMED
    let names = Stores.Character.list()
    let cleaned = []
    names.forEach(
      name => {
        let chan = bot.channels.find(
          val => val.name === 'c-' + name.toLowerCase().split(' ').join('-'),
        )
        if (!chan) {
          cleaned.push(name)
          if (!blank_run) {
            Stores.Character.delete(name)
          }
        }
      },
    )

    return (blank_run ? '*Blank Run to confirmed use* ```' + CLEAN_CONFIRMED +
      '```\n' : '')
      + (!cleaned.length ? 'Nothing to purge' : (':no_entry_sign:' +
        cleaned.join('\n')))
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {{embed: *}}
   */
  config () {
    return '```JSON\n' + JSON.stringify(Config, null, 2) + '```'
  }

  /**
   * @return {{embed}}
   */
  enable () {
    let option = this.message.content
    if (Config[option] !== undefined) Config[option] = true
    return this.config()
  }

  /**
   * @return {{embed}}
   */
  disable () {
    let option = this.message.content
    if (Config[option] !== undefined) Config[option] = false
    return this.config()
  }

  /**
   * Resets game of config
   * @return {*}
   */
  reset () {
    if (this.message.content === RESET_CONFIG) {
      configReset()
      return this.config()
    }
    else if (this.message.content === RESET_GAME) {
      reset()
      return ':recycle: Game reset!'
    } else {
      return ':warning: Use ```' + RESET_CONFIG
        + '``` or ```' + RESET_GAME + '\n```'
    }
  }
}

export default Admin

