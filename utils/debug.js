const colors = require('colors')
const prefix = '[stylish-backend] - '

colors.setTheme({
    input: 'grey',
    info: ['cyan', 'italic'],
    prompt: 'grey',
    success: ['green', 'bold'],
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: ['red', 'underline'],
})

const debug = (message = '', type = 'info', hasPrefix = true) => {
    if (process.env.NODE_ENV === 'production') return

    message = hasPrefix ? `${prefix} ${message}` : message

    switch (type) {
        case 'success':
            console.log(message.success)
            break
        case 'error':
            console.log(message.error)
            break
        case 'warn':
            console.log(message.warn)
            break
        case 'rainbow':
            console.log(message.rainbow.bold)
            break
        case 'info':
        default:
            console.log(message.info)
            break
    }
}

module.exports = debug
