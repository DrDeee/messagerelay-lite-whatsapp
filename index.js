require('dotenv').config()

const db = require('./db')
db.load()

const venom = require('venom-bot')
const Websocket = require('ws').WebSocket


const parseHtml = require('./parser')

const apiToken = process.env.API_TOKEN
const gateway = new Websocket('wss://' + process.env.API_ORIGIN + '/api/v1/gateway/backend')

const iaows = process.env.IAOW.split('|')
const wids = process.env.WID.split('|')

let waClient

gateway.onopen = () => {
    console.log('Websocket connected.')
    gateway.send(JSON.stringify({ type: 'code', code: apiToken }))
}

gateway.onerror = (e) => {
    console.log('Error:', e)
}

gateway.onmessage = async(msg) => {
    const data = JSON.parse(msg.data)
    switch (data.type) {
        case 'error':
            console.error('Error with gateway:', data.msg)
            break
        case 'verified':
            console.info('Gateway connection verified.')
            break
        case 'create':
            const content = parseHtml(data.content)
            switch (data.target) {
                case 'wid':
                    for (const wid of wids) {
                        const msgId = (await waClient.sendText(wid, content)).to._serialized
                        db.addMessage(data.id, msgId + '|||' + wid)
                    }
                    db.saveAsync()
                    break
                case 'iaow':
                    for (const iaow of iaows) {
                        const msgId = (await waClient.sendText(iaow, content)).to._serialized
                        db.addMessage(data.id, msgId + '|||' + iaow)
                    }
                    db.saveAsync()
                    break
            }
            break
        case 'delete':
            const msgs = db.getMessages(data.id)
            for (const msg of msgs) {
                const parts = msg.split('|||')
                waClient.deleteMessage(parts[1], [parts[0]]).catch(e => console.log('Error hile deleting message', e))
            }
            db.removeMessages(data.id)
            db.saveAsync()

    }
}

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        process.exit()
    });

async function start(client) {
    console.log('============')
    for (const chat of await client.getAllChats()) {
        if (chat.name == undefined) continue
        console.log(chat.name, chat.id._serialized)
    }
    console.log('============')
    waClient = client
}

const close = () => {
    db.save()
    client.close()
}

process.on('SIGINT', close)
process.on('SIGTERM', close)