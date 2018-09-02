import Stores from '../Stores'
import Help from './Help'

class Character extends Help {

   helps () {
    let h = super.helps()
    h['s(how)'] = 'Shows this character data'
    return h
  }

  /**
   * @return {*|{root, dir, base, ext, name}|number}
   */
   s () { return this.show()}

  /**
   * Show character data
   * @return {*|{root, dir, base, ext, name}|number}
   */
   show () {
    let name = this.message.channel.name.replace('c-', '')
    let player = Stores.character.get(name)
    return player.parse()
  }
}

export default Character