import Discord from 'discord.js'
import Bot from 'src/Bot'
import Model from 'src/model/Model'

const DESCRIPTORS = ['Trademarks', 'Flaws', 'Relations']

const CONDITION_STATUS = {
  'minor': '*min*',
  'moderate': '*mod*',
  'major': '*maj*',
}

const DRIVES_STATUS = {
  'current': '*en cours*',
  'achieved': '***Done***',
  'failed': '***Failed***',
}

class Character extends Model {

  constructor (id) {
    super(id)
    this.rename()
    this.concept = 'New Character'
    this.retired = false
    this.maxResolvePoints = 0
    this.resolvePoi0nts = 0
    this.trademarks = []
    this.flaws = []
    this.relations = []
    // {status, label}
    this.drives = []
    // {status, label}
    this.conditions = []
    this.descripton = 'A newly created character'
    this.thumbnail = null
    this.outputId = null
  }

  get channel () {
    return Bot.channels.get(this.id)
  }

  get npc () {
    return this.maxResolvePoints === 0
  }

  get rp () {
    if (this.retired) return ':skull_crossbones: '
    if (this.npc) return '*Non-Playing Character*'
    return this.resolvePoints + ' / ' + this.maxResolvePoints
  }

  /**
   * @return {Discord.RichEmbed}
   */
  async output () {
    let embed = new Discord.RichEmbed()
      .setTitle(this.name + ', *' + this.concept + '* ')

    if (!this.npc) {
      embed.addField('Resolve Points', this.rp, false)
      DESCRIPTORS.forEach(
        descriptor => embed.addField(
          descriptor,
          this[descriptor.toLowerCase()]
            .map((d, i) => (i + 1) + ' - ' + d)
            .join('\n') || 'None',
          true),
      )
      embed.addField(
        'Drives',
        this.drives
          .map(
            (d, i) => (i + 1) + ' - ' + DRIVES_STATUS[d.status] + ' ' +
              d.label)
          .join('\n') || 'None', false)
    }

    embed.setDescription(this.description)

    embed.addField(
      'Conditions',
      this.conditions
        .map(
          (c, i) => (i + 1) + ' - ' + CONDITION_STATUS[c.status] + ' ' +
            c.label)
        .join('\n') || 'None', true)

    if (this.thumbnail) {
      embed.setThumbnail(this.thumbnail)
    }

    embed.setFooter(new Date())

    let message = null
    if (this.outputId) {
      message = await this.channel.fetchMessage(this.outputId)
    }
    if (!message) {
      message = await this.channel.send('Will be replace by description')
      this.outputId = message.id
    }

    await message.pin()
    return message.edit(embed)
  }

  /**
   * @return {*}
   */
  rename () {
    this.name = this.channel.name
      .replace('c-', '')
      .split('-')
      .map(t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
      .join(' ')
  }
}

export default Character