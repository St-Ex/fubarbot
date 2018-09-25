class Help {

  constructor (message) {
    this.message = message
  }

  helps () {
    return [['help', 'Shows this help', 'h']]
  }

  /**
   * Return available command
   * @return {string}
   */
  help () {
    let maxSize = Math.max(
      ...this.helps()
        .map(k => 1 + k[0].length + (k[2] ? k[2].length + 2 : 0)),
    )
    return '```\n'
      + this.helps()
        .map(([long, label, short]) => {
          let cmd = (short ? '!' + short + ' ' : '') + '!' + long
          return cmd.padEnd(maxSize) + ' - ' + label
        })
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