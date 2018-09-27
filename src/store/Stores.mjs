import fs from 'fs'
import path from 'path'
import Config, { reset as configReset } from 'src/Config'
import Log from 'src/Log'
import Character from 'src/model/Character'
import Store from 'src/store/Store'

/**
 * @type {{Characters: Character}}
 */
const Models = {
  Characters: Character,
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
  Log.info('stores.json file found')
  let content = JSON.parse(fs.readFileSync(file).toString())

  Log.info('Reloading config')
  Object.assign(Config, content.config)

  Log.info('Creating stores')
  Object.keys(Models).forEach(name => {
    let store = new Store()
    let data = content.stores && content.stores[name]
    if (data) {
      Log.info('Reloading ' + name + ' store')
      Object.assign(store._objects, data._objects)
      for (let o of store) {
        Object.setPrototypeOf(o, Models[name].prototype)
      }
    }
    Stores[name] = store
  })
} else {
  reset()
}

export function save () {
  Log.debug('Saving')
  fs.writeFileSync(file,
    JSON.stringify({config: Config, stores: Stores}, null, 2),
  )
}

/**
 * Flush config and stores every 2 sec
 */
setInterval(save, 2000)

export default Stores