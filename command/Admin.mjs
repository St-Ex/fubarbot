import bot from '../bot'
import Config, { reset as configReset } from '../Config'
import Character from '../model/Character'
import Stores, { reset } from '../Stores'
import Help from './Help'

const RESET_CONFIG = 'config'
const RESET_GAME = 'game'
const CLEAN_CONFIRMED = 'confirmed'

class Admin extends Help {

  helps () {
    let h = super.helps()
    h.push(['clean', 'Clean all Character without channel'])
    h.push(['config', 'Prints configuration'])
    h.push(['enable', 'Enables configuration', 'e'])
    h.push(['disable', 'Disables configuration', 'd'])
    h.push(['delete #channel', 'Deletes character (and character\'s channel)'])
    h.push(['reset', 'Resets full game'])
    return h
  }

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
    let cleaned = []
    Stores.Character.forEach(
      char => {
        let chan = bot.channels.find(val => val.name === char.channelName)
        if (!chan) {
          cleaned.push(char.name)
          if (!blank_run) {
            Stores.Character.delete(char.name)
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
   * Erases character
   * @return {string}
   */
  delete (channel) {
    if (!channel) {
      let id = this.message.content.match(/^<#([0-9]+)>$/)
      if (id) {
        channel = bot.channels.get(id[1])
      } else {
        let channelName = this.message.content.replace(/^#/, '')
        console.log(channelName)
        console.log(bot.channels)
        channel = bot.channels.find(
          channel => channel.name === channelName,
        )
      }

      if (!channel) {
        return ':bangbang: Cannot find channel ' + this.message.content
      }
    }
    let char = Stores.Character.get(Character.getName(channel.name))
    Stores.Character.delete(char.name)
    channel.delete(char.name + ' deleted')
    return char.name + ' deleted'
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

