import botRoll from '../roll'
import Help from './Help'

class Roll extends Help {

  helps () {
    let h = super.helps()
    h.push(['roll', 'roll some dices', 'r'])
    return h
  }

  /**
   * @see Roll.roll
   * @return {{embed}}
   */
  r () { return this.roll()}

  /**
   * Role dices
   * @return {{embed: *}}
   */
  roll () {
    return {embed: botRoll(this.message)}
  }
}

export default Roll