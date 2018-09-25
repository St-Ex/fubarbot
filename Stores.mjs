import fs from 'fs'
import path from 'path'
import Config, { reset as configReset } from './Config'
import logger from './Logger'
import Character from './model/Character'

const Models = {
  Character: Character,
}

/**
 * Store class
 */
class Store {

  constructor (model) {
    this._model = model
    this.clear()
  }

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

  delete (key) {
    if (!this.has(key)) return false
    logger.info({message: 'delete', name: key})
    delete this._objects[key]
    save()
    return true
  }

  entries () {
    return Object.entries(this._objects)
  }

  forEach (fn, thisArg = null) {
    if (thisArg) {
      fn.bind(thisArg)
    }
    for (let o of Object.values(this._objects)) {
      fn(o)
    }
  }

  get (key) {
    if (!this.has(key)) {
      this.set(key, new Models[this._model](key))
    }
    return this._objects[key]
  }

  has (key) {
    return this._objects.hasOwnProperty(key)
  }

  keys () {
    return Object.keys(this._objects)
  }

  set (key, value) {
    this._objects[key] = value
    return this
  }

  values () {
    return Object.values(this._objects)
  }
}

const file = path.resolve(path.dirname('') + '/stores.json')
let Stores = {}

/**
 * Resets stores
 */
export function reset () {
  if (fs.existsSync(file)) {
    fs.createReadStream(file)
      .pipe(fs.createWriteStream(file + '.bak.' + new Date().toISOString()))
  }
  configReset()
  Stores = {}
  Object.keys(Models).forEach(m => Stores[m] = new Store(m))
}

/**
 * Reloads config and stores
 */
if (fs.existsSync(file)) {
  logger.info('stores.json file found')
  let content = JSON.parse(fs.readFileSync(file).toString())

  logger.info('Reloading config')
  Object.assign(Config, content.config)

  logger.info('Creating stores')
  Object.keys(Models).forEach(model => {
    let store = new Store(model)
    let data = content.stores && content.stores[model]
    if (data) {
      logger.info('Reloading ' + model + ' store')
      Object.assign(store._objects, data._objects)
      for (let o of store) {
        Object.setPrototypeOf(o, Models[model].prototype)
      }
    }
    Stores[model] = store
  })
} else {
  reset()
}

function save () {
  logger.debug('Saving')
  fs.writeFileSync(file,
    JSON.stringify({config: Config, stores: Stores}, null, 2),
  )
}

/**
 * Flush config and stores every 2 sec
 */
setInterval(save, 2000)

export default Stores