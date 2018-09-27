import Log from 'src/Log'
import { save } from 'src/store/Stores'

/**
 * Class Store
 */
class Store {
  constructor () {
    this.clear()
  }

  // noinspection JSUnusedGlobalSymbols
  get length () {
    return this.keys().length
  }

  * [Symbol.iterator] () {
    let keys = Object.keys(this._objects)
    for (let key of keys) {
      yield this._objects[key]
    }
  }

  clear () {
    this._objects = {}
  }

  // noinspection JSUnusedGlobalSymbols
  delete (key) {
    if (!this.has(key)) return false
    Log.info({message: 'delete', name: key})
    delete this._objects[key]
    save()
    return true
  }

  // noinspection JSUnusedGlobalSymbols
  entries () {
    return Object.entries(this._objects)
  }

  // noinspection JSUnusedGlobalSymbols
  forEach (fn, thisArg = null) {
    if (thisArg) {
      fn.bind(thisArg)
    }
    for (let o of Object.values(this._objects)) {
      fn(o)
    }
  }

  // noinspection JSUnusedGlobalSymbols
  get (key) {
    return this.has(key) ? this._objects[key] : false
  }

  has (key) {
    return this._objects.hasOwnProperty(key)
  }

  keys () {
    return Object.keys(this._objects)
  }

  // noinspection JSUnusedGlobalSymbols
  set (key, value) {
    this._objects[key] = value
    save()
    return this
  }

  // noinspection JSUnusedGlobalSymbols
  values () {
    return Object.values(this._objects)
  }
}

export default Store
