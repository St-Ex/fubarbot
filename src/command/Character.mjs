import Help from 'src/command/Help'
import Model from 'src/model/Character'
import Stores from 'src/store/Stores'

const CONDITIONS = 'conditions'
const DRIVES = 'drives'

class Character extends Help {

  /**
   * Current Character
   * @return {Model}
   */
  get current () {
    if (!this._current) {
      this._current = Stores.Characters.get(this.message.channel.id)
    }
    return this._current
  }

  _afterCommand(){
    this.current.output()
  }

  _remove (what) {
    let i = parseInt(this.message.content)
    if (i > 0 && i <= this.current[what].length) {
      this.current[what].splice(i - 1, 1)
      return 'Removed'
    } else {
      return 'Argument must be the index to delete'
    }
  }

  _toggle (what, value) {
    let i = parseInt(this.message.content)
    if (i > 0 && i <= this.current[what].length) {
      this.current[what][i - 1].status = value
      return 'Updated'
    } else {
      return 'Argument must be the index to delete'
    }
  }

  ac () {return this.addCondition() }

  ad () {return this.addDrive() }

  addCondition () {
    this.current.conditions.push({level: 'minor', label: this.message.content})
    return 'Condition added'
  }

  addDrive () {
    this.current.drives.push({status: 'current', label: this.message.content})
    return 'Drive added'
  }

  addFlaw () {
    this.current.flaws.push(this.message.content)
    return 'Flaw added'
  }

  addRelation () {
    this.current.relations.push(this.message.content)
    return 'Relation added'
  }

  addTrademark () {
    this.current.trademarks.push(this.message.content)
    return 'Trademark added'
  }

  af () { return this.addFlaw()}

  ar () { return this.addRelation()}

  at () { return this.addTrademark()}

  /**
   * Shows/Edits concept
   * @return {function()}
   */
  concept () {
    if (this.message.content.length) {
      this.current.concept = this.message.content
    }
    return this.current.concept
  }

  /**
   * Creates a character
   * @return {string}
   */
  create () {
    if (!this.current) {
      let character = new Model(this.message.channel.id)
      Stores.Characters.set(character.id, character)
    }
  }

  /**
   * Shows/Edits description
   * @return {function()}
   */
  description () {
    if (this.message.content.length) {
      this.current.description = this.message.content
    }
    return this.current.description
  }

  helps () {
    let h = super.helps()
    if (!this.current) {
      h.push(['create', 'Creates the character'])
    } else {
      h.push(['concept         (what)', 'Shows/Edits concept', ''])
      h.push(['description     (what)', 'Shows/Edits description', ''])
      h.push([
        'resolvePoints',
        'Sets current and maximum resolve points (0 for NPC)',
        'rp'])
      if (!this.current.npc) {
        h.push(['r++', '+1 resolve point', ''])
        h.push(['r--', '-1 resolve point', ''])
        h.push(['addTrademark    what', 'Adds trademark', 'at'])
        h.push(['removeTrademark index', 'Removes trademark', 'rt'])
        h.push(['addFlaw         what', 'Adds flaw', 'af'])
        h.push(['removeFlaw      index', 'Removes flaw', 'rf'])
        h.push(['addRelation     what', 'Adds relation', 'ar'])
        h.push(['removeRelation  index', 'Removes relation', 'rr'])
        h.push(['addCondition    what', 'Adds condition', 'ac'])
        h.push(['removeCondition index', 'Removes condition', 'rc'])
        h.push(['addDrive        what', 'Adds drive', 'ad'])
        h.push(['removeDrive     index', 'Removes drive', 'rd'])
        h.push(['setCurrent      index', 'Sets drives as current', 'scu'])
        h.push(['setAchieved     index', 'Sets drives as achieved', 'sac'])
        h.push(['setFailed       index', 'Sets drives as failed', 'sfa'])
      }
      h.push(['thumbnail url', 'Sets thumbnail (if none, disable it)', 't'])
      h.push(['setMinor        index', 'Sets condition as minor', 'smi'])
      h.push(['setModerate     index', 'Sets condition as moderated', 'smo'])
      h.push(['setMajor        index', 'Sets condition as major', 'sma'])
    }
    return h
  }

  'r++' () {
    if (this.current.npc) return 'Invalid for NPC'
    if (this.current.resolvePoints < this.current.maxResolvePoints) {
      this.current.resolvePoints++
    }
    return this.current.rp
  }

  'r--' () {
    if (this.current.npc) return 'Invalid for NPC'
    if (this.current.resolvePoints === 0) {
      this.current.retired = true
      return ':skull_crossbones: ' + this.current.name + ' fades into history.'
    }
    this.current.resolvePoints--
    return this.current.rp + (this.current.resolvePoints ? '' : (' :warning: '
      + this.current.name + ' losts the scenarium armor.'))
  }

  rc () { return this.removeCondition()}

  rd () { return this.removeDrive()}

  removeCondition () { return this._remove(CONDITIONS)}

  removeDrive () {return this._remove(DRIVES)}

  removeFlaw () { return this._remove('flaws')}

  removeRelation () { return this._remove('relations')}

  removeTrademark () { return this._remove('trademarks')}

  resolvePoints () {
    let i = parseInt(this.message.content)
    if (i >= 0) {
      this.current.maxResolvePoints = i
      this.current.resolvePoints = this.current.maxResolvePoints
      this.current.retired = false
      return this.current.rp
    }

    return 'Arguments need to be \n 0 for npn-playing character\n 1 or more for player like character'
  }

  rf () { return this.removeFlaw()}

  rp () { return this.resolvePoints()}

  rr () { return this.removeRelation()}

  rt () { return this.removeTrademark()}

  sac () {return this.setAchieved()}

  scu () { return this.setCurrent()}

  setAchieved () { return this._toggle(DRIVES, 'achieved')}

  setCurrent () { return this._toggle(DRIVES, 'current')}

  setFailed () {return this._toggle(DRIVES, 'failed')}

  setMajor () { return this._toggle(CONDITIONS, 'major')}

  setMinor () { return this._toggle(CONDITIONS, 'minor')}

  setModerate () { return this._toggle(CONDITIONS, 'moderate')}

  sfa () {return this.setFailed()}

  sma () { return this.setMajor()}

  smi () { return this.setMinor()}

  smo () { return this.setModerate()}

  t () { return this.thumbnail()}

  thumbnail () {
    this.current.thumbnail = this.message.content
    return 'Thumbnail set'
  }
}

export default Character