const app = require('./app')
const http = require('http')
const path = require('path')
const exec = require('child_process').exec

const port = normalizePort(process.env.PORT || '3000')
const callPage = path.join(__dirname + '/external-calls/callPage.js')

app.set('port', port)

const server = http.createServer(app)

function normalizePort(val) {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

server.listen(port)

server.on('listening', () => {
    console.log(`server is listening on port ${server.address().port}`)
    let workerProcess = exec(`node ${callPage}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        }
    })
    workerProcess.stdout.on('data', (data) => {
        console.log(data)
    })
})
