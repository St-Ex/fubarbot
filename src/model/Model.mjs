import Stores from 'src/store/Stores'

class Model {
  constructor (id) {
    this._id = id
  }

  get id () {
    return this._id
  }

  /**
   * @return {Store}
   */
  get store () {
    return Stores[this.constructor.name]
  }
}

export default Model