import Stores from '../Stores'
import Help from './Help'

class Character extends Help {

  /**
   * Current Character
   * @return {Character}
   */
  get current () {
    if (!this._current) {
      let name = this.message.channel.name
        .replace('c-', '')
        .split('-')
        .map(t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
        .join(' ')
      this._current = Stores.Character.get(name)
    }
    return this._current
  }

  helps () {
    let h = super.helps()
    h['s(how) (full)'] = 'Shows ' + this.current.name + '\'s data'
    h['concept            (what)'] = 'Shows/Edits concept'
    h['description        (what)'] = 'Shows/Edits description'
    h['a(dd)t(rademark)    what'] = 'Adds trademark'
    h['a(dd)f(law)         what'] = 'Adds flaw'
    h['a(dd)r(elation)     what'] = 'Adds relation'
    h['a(dd)c(ondition)    what'] = 'Adds condition'
    h['a(dd)d(rive)        what'] = 'Adds drive'
    h['s(et)mi(nor)        index'] = 'Sets condition as minor'
    h['s(et)mo(derate)     index'] = 'Sets condition as moderated'
    h['s(et)ma(jor)        index'] = 'Sets condition as major'
    h['s(et)cu(rrent)      index'] = 'Sets drives as current'
    h['s(et)ac(hieved)     index'] = 'Sets drives as achieved'
    h['s(et)fa(ailed)      index'] = 'Sets drives as failed'
    h['r(emove)t(rademark) index'] = 'Removes trademark'
    h['r(emove)f(flaw)     index'] = 'Removes flaw'
    h['r(emove)r(relation) index'] = 'Removes relation'
    h['r(emove)c(ondition) index'] = 'Removes condition'
    h['r(emove)d(rive)     index'] = 'Removes drive'
    h.delete = 'Delete ' + this.current.name + ' !! This action is permanent !!'
    return h
  }

  at () { return this.addTrademark()}

  addTrademark () {
    this.current.trademarks.push(this.message.content)
    return 'Trademark added'
  }

  rt () { return this.removeTrademark()}

  removeTrademark () { return this._remove('trademark')}

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

  setMinor () { return this._toggle('conditions', 'minor')}

  smo () { return this.setModerate()}

  setModerate () { return this._toggle('conditions', 'moderate')}

  sma () { return this.setMajor()}

  setMajor () { return this._toggle('conditions', 'major')}

  rc () { return this.removeCondition()}

  removeCondition () { return this._remove('conditions')}

  ad () {return this.addDrive() }

  addDrive () {
    this.current.drives.push({status: 'current', label: this.message.content})
    return 'Drive added'
  }

  scu () { return this.setCurrent()}

  setCurrent () { return this._toggle('drives', 'current')}

  sac () {return this.setAchieved()}

  setAchieved () { return this._toggle('drives', 'achieved')}

  sfa () {return this.setFailed()}

  setFailed () {return this._toggle('drives', 'failed')}

  rd () { return this.removeDrive()}

  removeDrive () {return this._remove('drives')}

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

  /**
   * Erases character
   * @return {string}
   */
  delete () {
    Stores.Character.delete(this.current.name)
    return ':no_entry_sign:' + this.current.name + ' deleted'
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