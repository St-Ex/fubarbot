import Config, { reset as configReset } from '../Config'
import { reset } from '../Stores'
import Help from './Help'

const RESET_CONFIG = '!reset config'
const RESET_GAME = '!reset game'

class Admin extends Help {

  helps () {
    let h = super.helps()
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
    let option = this.message.content.split(' ')[1]
    if (Config[option] !== undefined) Config[option] = true
    return this.config()
  }

  /**
   * @return {{embed}}
   */
  disable () {
    let option = this.message.content.split(' ')[1]
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
      return ':white_check_mark: Game reset!'
    } else {
      return ':warning: Use ```' + RESET_CONFIG
        + '``` or ```' + RESET_GAME + '\n```'
    }
  }
}

export default Admin

