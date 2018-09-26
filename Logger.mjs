import winston from 'winston'

const format = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
})

export default logger