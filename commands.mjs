import botRoll from './roll'

const Commands = {
  r: message => ({embed: botRoll(message)}),
  rc: message => ({embed: botRoll(message, true)}),
  h: () => '```' +
    '- !h(elp)   - show this help\n' +
    '- !r(oll)   - roll some dices\n' +
    '- !rc       - same as !r with **Critical Mode ON**\n' +
    '```',
  help: () => Commands.h(),
  roll: m => Commands.roll(m),
}

export default Commands