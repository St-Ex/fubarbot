import fs from 'fs'
import path from 'path'
import logger from 'winston'
import Config, { reset as configReset } from './Config'
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
    this._objects = {}
    logger.info(model, this)
  }

  get (name) {
    if (!this._objects[name]) {
      this._objects[name] = new Models[this._model](name)
    }
    return this._objects[name]
  }

  reload () {
    Object.values(this._objects).forEach(o => {
      Object.setPrototypeOf(o, Models[this._model].prototype)
    })
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

  logger.info('Reloading stores')
  for (let store in content.stores) {
    Stores[store] = content.stores[store]
    Object.setPrototypeOf(Stores[store], Store.prototype)
    Stores[store].reload()
  }
} else {
  reset()
}

/**
 * Flush config and stores every 2 sec
 */
setInterval(
  () => fs.writeFileSync(
    file,
    JSON.stringify({config: Config, stores: Stores}, null, 2),
  ),
  2000,
)

export default Stores