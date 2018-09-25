import Model from '../model/Character'
import Stores from '../Stores'
import Help from './Help'

const CONDITIONS = 'conditions'
const DRIVES = 'drives'

class Character extends Help {

  /**
   * Current Character
   * @return {Character}
   */
  get current () {
    if (!this._current) {
      this._current = Stores.Character.get(
        Model.getName(this.message.channel.name),
      )
    }
    return this._current
  }

  helps () {
    let h = super.helps()
    h.push(['show (full)', 'Shows ' + this.current.name + '\'s data', 's'])
    h.push(['concept         (what)', 'Shows/Edits concept', ''])
    h.push(['description     (what)', 'Shows/Edits description', ''])
    h.push(['r++', '+1 resolve point', ''])
    h.push(['r--', '-1 resolve point', ''])
    h.push(['rmax', 'Sets maximum resolve points', ''])
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
    h.push(
      ['setThumbnail    url', 'Sets thumbnail (if none, disable it)', 'st'])
    h.push(['setMinor        index', 'Sets condition as minor', 'smi'])
    h.push(['setModerate     index', 'Sets condition as moderated', 'smo'])
    h.push(['setMajor        index', 'Sets condition as major', 'sma'])
    h.push(['setCurrent      index', 'Sets drives as current', 'scu'])
    h.push(['setAchieved     index', 'Sets drives as achieved', 'sac'])
    h.push(['setFailed       index', 'Sets drives as failed', 'sfa'])
    return h
  }

  at () { return this.addTrademark()}

  addTrademark () {
    this.current.trademarks.push(this.message.content)
    return 'Trademark added'
  }

  rt () { return this.removeTrademark()}

  removeTrademark () { return this._remove('trademarks')}

  af () { return this.addFlaw()}

  addFlaw () {
    this.current.flaws.push(this.message.content)
    return 'Flaw added'
  }

  rf () { return this.removeFlaw()}

  removeFlaw () { return this._remove('flaws')}

  ar () { return this.addRelation()}

  addRelation () {
    this.current.relations.push(this.message.content)
    return 'Relation added'
  }

  rr () { return this.removeRelation()}

  removeRelation () { return this._remove('relations')}

  ac () {return this.addCondition() }

  addCondition () {
    this.current.conditions.push({level: 'minor', label: this.message.content})
    return 'Condition added'
  }

  smi () { return this.setMinor()}

  setMinor () { return this._toggle(CONDITIONS, 'minor')}

  smo () { return this.setModerate()}

  setModerate () { return this._toggle(CONDITIONS, 'moderate')}

  sma () { return this.setMajor()}

  setMajor () { return this._toggle(CONDITIONS, 'major')}

  rc () { return this.removeCondition()}

  removeCondition () { return this._remove(CONDITIONS)}

  ad () {return this.addDrive() }

  addDrive () {
    this.current.drives.push({status: 'current', label: this.message.content})
    return 'Drive added'
  }

  scu () { return this.setCurrent()}

  setCurrent () { return this._toggle(DRIVES, 'current')}

  sac () {return this.setAchieved()}

  setAchieved () { return this._toggle(DRIVES, 'achieved')}

  sfa () {return this.setFailed()}

  setFailed () {return this._toggle(DRIVES, 'failed')}

  rd () { return this.removeDrive()}

  removeDrive () {return this._remove(DRIVES)}

  st () { return this.setThumbnail()}

  setThumbnail () {
    this.current.thumbnail = this.message.content
    return 'Thumbnail set'
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

  _remove (what) {
    let i = parseInt(this.message.content)
    if (i > 0 && i <= this.current[what].length) {
      this.current[what].splice(i - 1, 1)
      return 'Removed'
    } else {
      return 'Argument must be the index to delete'
    }
  }

  'r++' () {
    if (this.current.resolvePoints < this.current.maxResolvePoints) {
      this.current.resolvePoints++
    }
    return this.current.rp
  }

  'r--' () {
    if (this.current.resolvePoints === 0) {
      this.current.retired = true
      return ':skull_crossbones: ' + this.current.name + ' fades into history.'
    }
    this.current.resolvePoints--
    return this.current.rp + (this.current.resolvePoints ? '' : (' :warning: '
      + this.current.name + ' losts the scenarium armor.'))
  }

  rmax () {
    let i = parseInt(this.message.content)
    if (i >= 0) {
      this.current.maxResolvePoints = i
      this.current.resolvePoints = this.current.maxResolvePoints
      this.current.retired = false
      return this.current.rp
    } else {
      return 'Arguments need to be a positive integer'
    }
  }

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
   * Shows/Edits description
   * @return {function()}
   */
  description () {
    if (this.message.content.length) {
      this.current.description = this.message.content
    }
    return this.current.description
  }

  s () { return this.show()}

  /**
   * Show character data
   * @return {*|{root, dir, base, ext, name}|number}
   */
  show () {
    return this.current.parse(this.message.content.toLowerCase() === 'full')
  }
}

export default Character