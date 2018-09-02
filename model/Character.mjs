import Discord from 'discord.js'
import Model from './Model'

class Character extends Model {

  /**
   * @return {Discord.RichEmbed}
   */
  parse () {
    return new Discord.RichEmbed()
      .setTitle(this.name)
  }
}
export default Character