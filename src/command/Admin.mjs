import Bot from 'src/Bot'
import Config, { reset as configReset } from 'src/Config'
import Stores, { reset } from 'src/store/Stores'
import Help from 'src/command/Help'
import Log from 'src/Log'

const RESET_CONFIG = 'config'
const RESET_GAME = 'game'

class Admin extends Help {

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
  d () { return this.disable()}

  // noinspection JSUnusedGlobalSymbols
  /**
   * Erases character
   * @return {string}
   */
  delete () {
    let id = this.message.content.match(/^<#([0-9]+)>$/)
    let channel = Bot.channels.get(id[1])
    if (!channel) {
      let channelName = this.message.content.replace(/^#/, '')
      channel = Bot.channels.find(
        channel => channel.name === channelName,
      )
    }
    if (channel) {
      Stores.Characters.delete(channel.id)
      channel.delete().catch(Log.err)
      return 'Done'
    }
    return ':bangbang: Cannot find channel ' + this.message.content
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
   * @return {{embed}}
   */
  e () { return this.enable()}

  /**
   * @return {{embed}}
   */
  enable () {
    let option = this.message.content
    if (Config[option] !== undefined) Config[option] = true
    return this.config()
  }

  helps () {
    let h = super.helps()
    h.push(['config', 'Prints configuration'])
    h.push(['enable', 'Enables configuration', 'e'])
    h.push(['disable', 'Disables configuration', 'd'])
    h.push(['delete #channel', 'Deletes character (and character\'s channel)'])
    h.push(['reset', 'Resets full game'])
    return h
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

