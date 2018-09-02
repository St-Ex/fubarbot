import Discord from 'discord.js'
import logger from 'winston'
import auth from './auth.json'
import Admin from './command/Admin'
import Character from './command/Character'
import Roll from './command/Roll'

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {colorize: true})
logger.level = 'debug'

// Initialize Discord Bot
let bot = new Discord.Client()

bot.on('ready', () => {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
})

bot.on('error', evt => {
  logger.error(evt)
})

let run = function (message) {
  if (message.content.charAt(0) === '!') {
    let cmd = message.content.substr(1).split(' ')[0].toLowerCase()
    let runner
    if (message.channel.name.startsWith('c-')) {
      runner = new Character(message)
    } else if (message.channel.name.toLowerCase() === 'admin') {
      runner = new Admin(message)
    } else {
      runner = new Roll(message)
    }

    if (typeof runner[cmd] === 'function') {
      message.channel.send(runner[cmd](message))
    } else {
      message.reply('_What is '
        + (cmd === 'love'
          ? 'love ?_ Is it https://dai.ly/xjwg9i ?'
          : cmd + ' ?_'))
    }
  }
}

bot.on('message', message => run(message))
bot.on('messageUpdate', (oldMessage, newMessage) => run(newMessage))
bot.login(auth.token)