const path = require('path')
const request = require('request')
const http = require('http')
const exec = require('child_process').exec
const fs = require('fs')

const writeDir = path.join(__dirname + '/files/')

const base = 'https://bitcointalk.org/index.php?action=profile;u=28405;sa=showPosts;start=' 

const catchMeIfYouCan = path.join(__dirname + '../assets/catch-me-if-you-can-title.mp3')

const startTime = Date.now()

let currentStats = {
    post: 1620,
    startTime: startTime,
    lastCheck: '',
    last: false,
    count: 0
}

const reducePost = function() {
    console.log(`reducing posts`)
    if (currentStats.post >= 21) {
        currentStats.post = currentStats.post - 20
        console.log(`next postNum: ${currentStats.post}`)
        return
    } else if (currentStats.post < 21 && !currentStats.last) {
        currentStats.last = true
        currentStats.post = 1
        return
    } else if (currentStats.last) {
        let themeSong = exec(`xdg-open ${catchMeIfYouCan}`, (err, stdout, stderr) => {
            if (err) { console.error(err) }
        })

        themeSong.stderr.on('data', (data) => {
        console.error(data)
        })
        themeSong.stdout.on('data', (data) => {
            console.log(`data: ${data}`)
        })
        themeSong.on('exit', (code) => {
            process.exit()
        })
        process.exit()
    }
}

const getPage = () => {
    currentStats.count += 1
    process.stdout.write('\033c')
    console.log(`fetching post#: ${currentStats.post}\ncurrentCount: ${currentStats.count}`)

    request.get(base + JSON.stringify(currentStats.post), (err, res, body) => {
        if (err) {
            console.error(err)
            process.exit()
        }

        if (res.statusCode !== 200) {
            console.log(`status: ${res.statusCode}`)
            process.exit()
        }

        fs.writeFile(writeDir + 'Tier_Nolan_BTT_' + currentStats.post + '.html', body, 'utf8', (err) => {
            if (err) throw err
            console.log(`File saved.`)
            reducePost()
        })
    })

    return
}

const scrape = function() {
    process.stdout.write('\033c')
    console.log(`starting...`)
    setInterval(function() { getPage() }, 3000)
}

scrape()

module.exports = {

}
