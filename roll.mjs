import Config from './Config'
import Discord from 'discord.js'

const REG = /[+\-]\d+/g

const RESULT = {
  0: 'no, and...',
  1: 'no',
  2: 'no, but...',
  3: 'yes, but...',
  4: 'yes',
  5: 'yes, and...',
}

const NO_LIMIT = ' and...'

const COLOR = {
  0: 0xdd2c00,
  1: 0xff6d00,
  2: 0xffab00,
  3: 0x00b8d4,
  4: 0x00bfa5,
  5: 0x00c853,
}

function sort (a, b) {
  if (a % 2 === b % 2) return b - a
  if (b % 2 === 0) return 1
  return -1
}

/**
 * Do a FUBAR roll with bonus/malus
 * @param bonus
 * @param malus
 */
function roll (bonus, malus) {
  let us = bonus - malus

  if (Math.abs(us) > 20) {
    return {
      text: 'Really :thinking: That many dices...',
      color: COLOR[0],
      dices: [],
    }
  }

  // Throw dices
  let dices = []
  for (let i = 0; i < 5 + Math.abs(us); i++) {
    dices.push(Math.floor(Math.random() * 6) + 1)
  }

  dices.sort((a, b) => sort(a, b))
  if (us < 0) {
    dices = dices.reverse()
  }

  let result = dices.slice(0, 5)
    .reduce((evens, dice) => evens + 1 - dice % 2, 0)
  return {
    text: RESULT[result],
    color: COLOR[result],
    dices,
  }
}

/**
 * Handle roll by the bot
 * @param message
 */
export default function botRoll (message) {
  let bonus = 0, malus = 0
  let group = REG.exec(message.content)
  while (group) {
    group = group[0]
    let operand = group.charAt(0)
    let number = group.substring(1)
    switch (operand) {
      case '+':
        bonus += parseInt(number)
        break
      case '-':
        malus += parseInt(number)
        break
    }
    group = REG.exec(message.content)
  }

  let result = roll(bonus, malus)
  if (result.dices.length > 5) {
    result.dices[5] = '~~' + result.dices[5]
    result.dices[result.dices.length - 1] += '~~ '
  }

  if (Config['roll.criticalMode']) {
    let number = result.dices.filter(
      d => (d === 1 && result.text === RESULT[0])
        || (d === 6 && result.text === RESULT[5])).length - 1
    if (number > 0) {
      result.text += NO_LIMIT.repeat(number)
    }
  }

  return new Discord.RichEmbed()
    .setTitle(message.author.username + ' > ' + result.text)
    .setColor(result.color)
    .setDescription(result.dices.join(' '))
}