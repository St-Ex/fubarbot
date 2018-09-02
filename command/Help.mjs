class Help {

  constructor (message) {
    this.message = message
  }

  helps () {
    return {'h(elp)': 'Shows this help'}
  }

  /**
   * Return available command
   * @return {string}
   */
  help () {
    let maxSize = Math.max(...Object.keys(this.helps()).map(k => k.length))
    return '```\n'
      + Object.entries(this.helps())
        .map(([cmd, text]) => '!' + cmd.padEnd(maxSize) + ' - ' + text)
        .join('\n') +
      '```'
  }

  /**
   * @see Roll.help
   * @return {*}
   */
  h () { return this.help()}
}

export default Help