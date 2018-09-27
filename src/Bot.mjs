import Discord from 'discord.js'
import Admin from 'src/command/Admin'
import Character from 'src/command/Character'
import Roll from 'src/command/Roll'
import Log from 'src/Log'
import Stores from 'src/store/Stores'
import auth from '../auth.json'

// Initialize Discord Bot
let Bot = new Discord.Client()

Bot.on('ready', () => {
  Log.info({message: 'Logged in as ' + Bot.user.username, id: Bot.user.id})
})

Bot.on('error', evt => {
  Log.error(evt)
})

/**
 * Returns true if is a character channel
 * @param channel
 * @return {boolean}
 */
function isCharChannel (channel) {
  return channel.name.startsWith('c-')
}

let run = function (message) {
  if (message.content.charAt(0) === '!') {
    let runner
    if (isCharChannel(message.channel)) {
      runner = new Character(message)
    } else if (message.channel.name.toLowerCase() === 'admin') {
      runner = new Admin(message)
    } else {
      runner = new Roll(message)
    }

    let cmd = message.content.substr(1).split(' ')[0]
    if (typeof runner[cmd] === 'function') {
      runner.message.content = runner.message.content.replace('!' + cmd, '')
        .trim()
      let response = runner[cmd]()
      if (response) message.channel.send(response).catch(Log.error)
      if (runner._afterCommand) {
        runner._afterCommand()
      }
    } else {
      message.reply('_What is '
        + (cmd === 'love'
          ? 'love ?_ Is it https://dai.ly/xjwg9i ?'
          : cmd + ' ?_'))
    }
  }
}

Bot.on('message', message => run(message))
Bot.on('messageUpdate', (oldMessage, newMessage) => run(newMessage))
Bot.on('channelDelete',
  channel => isCharChannel(channel) && Stores.Characters.delete(channel.id),
)
Bot.on('channelCreate',
  channel => isCharChannel(channel) && channel.send('!create'))
Bot.on('channelUpdate',
  channel => {
    if (isCharChannel(channel)) {
      let character = Stores.Characters.get(channel.id)
      if (character) {
        character.rename()
        character.output()
      }
    }
  })
Bot.login(auth.token).catch(Log.error)

export default Bot