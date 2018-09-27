import winston from 'winston'

const format = winston.format

const Log = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
})

export default Log