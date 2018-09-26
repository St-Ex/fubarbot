import Discord from 'discord.js'
import Model from './Model'

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

  constructor (name) {
    super(name)
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
  }

  get rp () {
    if (this.retired) return ':skull_crossbones: '
    if (this.npc) return '*Non-Playing Character*'
    return this.resolvePoints + ' / ' + this.maxResolvePoints
  }

  get npc () {
    return this.maxResolvePoints === 0
  }

  /**
   * @return {Discord.RichEmbed}
   */
  parse (full = false) {
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
      if (this.drives.length || full) {
        embed.addField(
          'Drives',
          this.drives
            .map(
              (d, i) => (i + 1) + ' - ' + DRIVES_STATUS[d.status] + ' ' +
                d.label)
            .join('\n') || 'None', false)
      }
    }

    if (this.npc || full) {
      embed.setDescription(this.description)
    }



    if (this.conditions.length || full) {
      embed.addField(
        'Conditions',
        this.conditions
          .map(
            (c, i) => (i + 1) + ' - ' + CONDITION_STATUS[c.status] + ' ' +
              c.label)
          .join('\n') || 'None', true)
    }


    if (this.thumbnail) {
      embed.setThumbnail(this.thumbnail)
    }
    return embed
  }

  /**
   * @param channelName string
   * @return {*}
   */
  static getName (channelName) {
    return channelName
      .replace('c-', '')
      .split('-')
      .map(t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
      .join(' ')
  }

  /**
   *
   * @return {string}
   */
  get channelName () {
    return 'c-' + this.name.toLowerCase().split(' ').join('-')
  }
}

export default Character