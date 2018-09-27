const Config = {}

export function reset () {
  for (let key in Config) {
    delete Config[key]
  }
  Config['roll.criticalMode'] = false
}

reset()

export default Config