import Discord from 'discord.js'
import logger from 'winston'
import auth from './auth.json'
import commands from './commands'

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {colorize: true})
logger.level = 'debug'

// Initialize Discord Bot
let bot = new Discord.Client()

bot.on('ready', (evt) => {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
})

let run = function (message) {
  if (message.content.charAt(0) === '!') {
    let cmd = message.content.substr(1).split(' ')[0].toLowerCase()
    if (typeof commands[cmd] === 'function') {
      message.reply(commands[cmd](message))
    }
  }
}
bot.on('message', message => run(message))
bot.on('messageUpdate', (oldMessage, newMessage) => {
  oldMessage.
  run(newMessage)
})

bot.login(auth.token)