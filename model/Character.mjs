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
    this.resolvePoints = 0
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
    return this.retired
      ? ':skull_crossbones: ' :
      (this.resolvePoints + ' / ' + this.maxResolvePoints)
  }

  /**
   * @return {Discord.RichEmbed}
   */
  parse (full = false) {
    let embed = new Discord.RichEmbed()
      .setTitle(this.name + ', *The ' + this.concept + '* ')
      .addField('Resolve Points', this.rp,
        false)

    if (full) {
      embed.setDescription(this.description)
    }

    DESCRIPTORS.forEach(
      descriptor => embed.addField(
        descriptor,
        this[descriptor.toLowerCase()]
          .map((d, i) => (i + 1) + ' - ' + d)
          .join('\n') || 'None',
        true),
    )

    if (this.conditions.length || full) {
      embed.addField(
        'Conditions',
        this.conditions
          .map(
            (c, i) => (i + 1) + ' - ' + CONDITION_STATUS[c.status] + ' ' +
              c.label)
          .join('\n') || 'None', true)
    }

    if (this.drives.length || full) {
      embed.addField(
        'Drives',
        this.drives
          .map(
            (d, i) => (i + 1) + ' - ' + DRIVES_STATUS[d.status] + ' ' +
              d.label)
          .join('\n') || 'None', false)
    }

    if (this.thumbnail){
      embed.setThumbnail(this.thumbnail)
    }
    return embed
  }
}

export default Character