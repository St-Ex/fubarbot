import Discord from 'discord.js'
import botRoll from 'src/roll'
import Help from 'src/command/Help'

class Roll extends Help {

  helps () {
    let h = super.helps()
    h.push(['roll', 'roll some dices', 'r'])
    return h
  }

  /**
   * @see Roll.roll
   * @return {{embed}}
   */
  r () { return this.roll()}

  /**
   * Role dices
   * @return {{embed: *}}
   */
  roll () {
    let result = botRoll(this.message.content)
    return new Discord.RichEmbed()
      .setTitle('@' + this.message.author.username + ' *' + result.text + '*')
      .setColor(result.color)
      .setDescription(result.dices.join(' '))
  }
}

export default Roll