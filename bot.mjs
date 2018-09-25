import Discord from 'discord.js'
import auth from './auth.json'
import Admin from './command/Admin'
import Character from './command/Character'
import Roll from './command/Roll'
import logger from './Logger'

// Initialize Discord Bot
let bot = new Discord.Client()

bot.on('ready', () => {
  logger.info({message: 'Logged in as ' + bot.user.username, id: bot.user.id})
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
      runner.message.content = runner.message.content
        .replace('!' + cmd, '').trim()
      let response = runner[cmd]()
      if (response) message.channel.send(response)
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
bot.on('channelDelete', channel => new Admin({}).delete(channel))
bot.login(auth.token)

export default bot